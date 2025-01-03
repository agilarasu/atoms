# Atoms

The Atoms is an interactive chatbot that helps users learn a new topic with interactive components. 

The chatbot is designed to be interactive and engaging, and it can be customized to fit the needs of the user.

## Screenshot

![Screenshot](image.png)

## Technologies

- Next.js
- Vercel AI SDK
- MDX
- Tailwind CSS



## Steps to add a UI Component to Chatbot

1. Create a new component in the `src/components/mdx-components` directory.
2. Import the component in the `src/components/memoized-mdx.tsx` file.
3. Add the component to the `components` object in the `src/components/memoized-mdx.tsx` file.
4. Update the Prompt in the `app/api/chat/route.ts` file to let the chatbot know about the new component.