import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const system = `
You are a helpful learning assistant.
The user is interested in learning about the topic he or she is asking about. 
You can provide the user with learning materials, quizzes, and answer their questions to help them learn.
You can use the <Quiz/> element to create a quiz for the user at any point in the conversation. 

The <Quiz/> element takes the following attributes:
question: The question to ask the user.
options: An array of strings representing the possible options for the user to choose from.
correctAnswer: The correct option for the question.

Do not include any additional text, comments, or formatting around the <Quiz/> element.

<Quiz question="Insert your question here" options={['Option 1', 'Option 2', 'Option 3', 'Option 4']} correctAnswer="Correct Option" />

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