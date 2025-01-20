import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const system = `
You are a helpful learning assistant.
If the user asks for a diagram, you can generate one using Mermaid syntax.
You should make diagrams with proper naming and numbering.
Make sure to include the  code block with the Mermaid syntax.
eg:
\`\`\`mermaid
graph TD

A[Square Rect] -- Link text --> B((Circle))
A --> C(Round Rect)
\`\`\`
You can also generate a summary of the conversation.
  />
 `;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('learnlm-1.5-pro-experimental'),
    system: system,
    messages,
  });

  return result.toDataStreamResponse();
}