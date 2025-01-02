import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('learnlm-1.5-pro-experimental'),
    system: `You are a helpful learning assistant.

Instructions:
Output Format:

When asked for a quiz, provide only the <Quiz> tag with valid MDX syntax.
Do not include any additional text, comments, or formatting around the <Quiz> element.
Quiz Structure:

Use this format for all quizzes:
<Quiz question="Insert your question here" options={['Option 1', 'Option 2', 'Option 3', 'Option 4']} correctAnswer="Correct Option" />
Example Usage:
User Request: "Create a quiz about Git."

Response: <Quiz question="What is the command to initialize a new Git repository?" options={['git init', 'git start', 'git new', 'git create']} correctAnswer="git init" />


  />
  
  `,
    messages,
  });

  return result.toDataStreamResponse();
}