'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Error boundary to catch rendering errors
class MDXErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { fallback: React.ReactNode, children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error: Error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// Custom components with safety checks
const CustomHeading = memo(({ children }: { children: React.ReactNode }) => {
    if (!children) return null;
    return <h1 className="text-2xl font-bold my-4 text-blue-600">{children}</h1>;
});

CustomHeading.displayName = 'CustomHeading';

const CustomParagraph = memo(({ children }: { children: React.ReactNode }) => {
    if (!children) return null;
    return <p className="my-2 leading-relaxed">{children}</p>;
});
CustomParagraph.displayName = 'CustomParagraph';


const CustomCard = memo(({ title, children }: { title?: string; children: React.ReactNode }) => {
    if (!children) return null;
    return (
        <Card className="my-4">
            <CardHeader>
                <CardTitle>{title || ''}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
});

CustomCard.displayName = 'CustomCard';


// a quiz component with 4 options and a submit button that will show the correct answer
// green for correct, red for wrong

const Quiz = memo(({ question, options, correctAnswer }: { question: string; options: string[]; correctAnswer: string }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        setShowAnswer(true);
    };

    const isCorrect = showAnswer && selectedAnswer === correctAnswer;

    return (
        <div className="my-6 p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">{question}</h2>
            <ul className="space-y-2">
                {options.map((option, index) => (
                    <li key={index}>
                        <button
                            className={`w-full text-left p-3 border rounded transition-colors duration-200 ease-in-out
                              ${selectedAnswer === option ? (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : 'border-gray-300 hover:bg-gray-100'}
                              ${showAnswer && selectedAnswer !== option && option === correctAnswer ? 'bg-green-100 border-green-500' : ''}
                            `}
                            onClick={() => handleAnswer(option)}
                            disabled={showAnswer}
                        >
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
           {!showAnswer && <button
                className="w-full mt-4 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
                onClick={handleSubmit}
            >
                Submit
            </button>}

            {showAnswer && (
                <div className="mt-4 p-3 rounded  font-semibold">
                    {isCorrect ? (
                        <div className="text-green-600 bg-green-100 rounded p-2">Correct!</div>
                    ) : (
                        <div className="text-red-600 bg-red-100 rounded p-2">
                            Wrong! The correct answer is <span className="font-bold">{correctAnswer}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});


Quiz.displayName = 'Quiz';

// Safely wrap MDX content
const SafeMDXContent = ({ content, components }: { content: MDXRemoteSerializeResult; components: any }) => {
    return (
        <MDXErrorBoundary fallback={<div className="text-gray-500">Loading...</div>}>
            <MDXRemote {...content} components={components} />
        </MDXErrorBoundary>
    );
};

const components = {
    h1: CustomHeading,
    p: CustomParagraph,
    Card: CustomCard,
    Quiz: Quiz,
};


// Memoize the MDX serialization and rendering
const MDXRenderer = memo(({ content }: { content: string }) => {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const prevContentRef = useRef<string | null>(null);


    useEffect(() => {
        if (!content) {
            setMdxSource(null)
           return;
        }
        if (prevContentRef.current === content) {
            return;
        }
        prevContentRef.current = content;

        const prepareMDX = async () => {
            try {
                const mdxSource = await serialize(content, {
                    components: components,
                });
                setMdxSource(mdxSource);
            } catch (error) {
                console.error('Error serializing MDX:', error);
                setMdxSource(null) // set to null if error so we can try again on next content
            }
        };

        prepareMDX();
    }, [content]);

    return (
        <div className="prose max-w-none">
            {mdxSource ? (
                <SafeMDXContent content={mdxSource} components={components} />
            ) : (
                <div className="text-gray-500">Loading...</div>
            )}
        </div>
    );
}, (prevProps, nextProps) => prevProps.content === nextProps.content)

MDXRenderer.displayName = 'MDXRenderer';

export default MDXRenderer;