'use client';

import React from 'react';
import { FileCode, DatabaseIcon, PuzzleIcon } from 'lucide-react';

interface WelcomeComponentProps {
    onExampleClick: (example: string) => void;
}

const examplePrompts = [
    {
        title: 'Javascript Help',
        description: 'Understand Javascript concepts and code snippets.',
        prompt: 'Explain Closures in Javascript with a code example',
        icon: <FileCode className="w-6 h-6 text-yellow-500" />, // Javascript Icon
    },
    {
        title: 'SQL Injection',
        description: 'Learn about SQL injection vulnerabilities and prevention.',
        prompt: 'What is SQL injection and how can I prevent it in my Node.js application?',
        icon: <DatabaseIcon className="w-6 h-6 text-red-500" />, // Database/Security Icon - Changed color to red to indicate security
    },
    {
        title: 'LeetCode Practice',
        description: 'Get hints and approaches for LeetCode problems.',
        prompt: 'LeetCode problem: Two Sum - Give me hints on how to solve it',
        icon: <PuzzleIcon className="w-6 h-6 text-green-500" />, // Puzzle/Problem Solving Icon - Changed color to green for practice/success
    },
];


const WelcomeComponent: React.FC<WelcomeComponentProps> = ({ onExampleClick }) => {
  return (
    <div className="text-center p-6 sm:p-8">
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">Learn Smart</h2>
      <p className="text-gray-700 mb-6 sm:mb-8"> With Atoms., learning adapts to you, making every experience personalized and seamless. 🚀
      </p>
      <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
        {examplePrompts.map((example, index) => (
          <div
            key={index}
            onClick={() => onExampleClick(example.prompt)}
            className="rounded-lg bg-gray-100 p-4 cursor-pointer hover:bg-gray-200 transition-colors w-full sm:w-auto"
          >
            <div className="flex justify-center">{example.icon}</div>
            <h3 className="font-semibold mt-2">{example.title}</h3>
            <p className="text-sm text-gray-600">{example.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeComponent;