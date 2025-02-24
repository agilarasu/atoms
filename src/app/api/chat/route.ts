import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';
import searchEngine from '@/Agents/tools/SearchWeb';
import { summarizeSearchResults } from '@/Agents/SearchSummarize';
import fs from 'fs';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const system = `
You are tasked with creating a well detailed notes for the given topic.

You can use the search tool and page summarizer tool to help you with your task.
You should think step by step and update the notes with every search and page reads.
You submit your notes to the given tool at the end.


Computer programming related topics:
1. Learn what the given topic is about at a basic level.
2. Learn how to use the given language or library or framework.
3. Only learn technical information only
4. Explore from basic to medium level.


Notes should contain the following:
1. The notes should be well detailed.
2. The notes should be well structured.
3. The notes should contain all the important points.
4. The notes should contain references to the sources.


Constraints:
1. You can use the search tool upto 10 times and atleast 5 times.
2. You can use the page summarize tool upto 10 times and atleast 5 times.


Tips:
1. If you can't read a page, try to read another page.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-exp'),
    system: system,
    messages,
    tools: {
      search: {
        description: 'Search the web for the given query',
        parameters: z.object({
          query: z.string(),
        }),
        execute: async function ({ query }) {
          const results = await searchEngine.search(query, { limit: 10 });
          const summary = await summarizeSearchResults(results);
          return {
            results,
            summary,
          };
        },
      },
      summarize: {
        description: 'Provides content of the given web url',
        parameters: z.object({
          url: z.string(),
        }),
        execute: async function ({ url }) {
          console.log(url);
          const content = await searchEngine.extract(url, { timeout: maxDuration });
          console.log(content);
          return {
            content,
          };
        },
      },
      // tool to submit the final notes
      submit: {
        description: 'Submit the notes at the end',
        parameters: z.object({
          notes: z.string(),
        }),
        execute: async function ({ notes }) {

          // Write the notes to a file named notes.md
          fs.writeFile('notes.md', notes, (err: any) => {
            if (err) {
              console.error('Failed to save notes:', err);
              return "Failed to save notes";
            }
            console.log('Notes saved to notes.md');
          });

          return "Submitted Notes";
        },
      },
    },
    maxSteps: 20,
  });

  return result.toDataStreamResponse();
}