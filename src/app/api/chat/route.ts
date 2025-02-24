import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const system = `
Teach if a topic is given
use h1, h2 and highlight important keywords 
use tables, code blocks, ordered and unordered lists and make it visually appealing
 `;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: system,
    messages,
  });

  return result.toDataStreamResponse();
}