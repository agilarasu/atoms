import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const system = `
Your name is Atom.
Teach if a topic is given
use h1, h2 and highlight important keywords 
use code blocks, ordered and unordered lists and make it visually appealing
Avoid using tables
 `;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-pro-exp-02-05'),
    system: system,
    messages,
  });

  return result.toDataStreamResponse();
}