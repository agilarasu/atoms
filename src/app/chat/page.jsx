'use client';

import { useChat } from 'ai/react';
import {MemoizedMarkdown} from '@/components/memoized-markdown.tsx';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus } from 'lucide-react';

import notion from '@/app/notion.module.css';
import { FaStar } from 'react-icons/fa';
import WelcomeComponent from '@/components/welcome-component';

export default function Page() {
    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, error, reload, stop } =
        useChat({});


    const { data: session, status } = useSession();
    if (status === 'loading') return null;
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">You need to sign in to view this page.</p>
            </div>
        );
    }

    const handleDownloadPdf = async (content, messageId) => {
        try {
            const response = await fetch('/api/md-to-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ markdown: content }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `message-${messageId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to generate PDF');
                alert('Failed to download PDF. Please try again.');
            }
        } catch (error) {
            console.error('Error during PDF download:', error);
            alert('Failed to download PDF. Please check the console for details.');
        }
    };

    const handleExampleClick = (example) => {
        setInput(example);
    };


    return (
        <>
            <div>
                <div className="flex flex-col w-full md:w-[60%] py-24 mx-auto stretch overflow-y-auto">
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <WelcomeComponent onExampleClick={handleExampleClick} />
                        ) : (
                            messages.map(message => (
                                <div key={message.id} className={`mb-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.role === 'assistant' && (
                                        <div className="mr-2">
                                            <FaStar />
                                        </div>
                                    )}
                                    <div className={`rounded-xl px-4 py-2 ${message.role === 'user' ? 'bg-gray-200 text-black' : 'bg-white text-black shadow'}`}>
                                        {message.role !== 'user' && (
                                            <div className={notion.markdownContainer}>
                                                <MemoizedMarkdown id={message.id} content={message.content} />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() => handleDownloadPdf(message.content, message.id)}
                                                >
                                                    Download PDF
                                                </Button>
                                            </div>
                                        )}
                                        {message.role === 'user' && message.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex space-x-2 w-full justify-center fixed bottom-0 p-4 bg-white">
                    <div className="relative flex items-center w-full md:w-1/2 rounded-full bg-gray-200 border border-gray-200">
                        <div className="pl-4">
                            <Plus className="h-5 w-5 text-gray-00" />
                        </div>
                        <Input
                            name="prompt"
                            value={input}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="Ask Atoms."
                            className="bg-transparent h-[10vh] border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent focus:outline-none"
                        />
                        <div className="absolute right-2">
                            {!isLoading && (
                                <Button type="submit" variant="ghost" className="rounded-full p-2 hover:bg-gray-200">
                                    <Send className="h-5 w-5" />
                                </Button>
                            )}
                            {isLoading && (
                                <Button type="button" variant="destructive" onClick={() => stop()}>
                                    Stop
                                </Button>
                            )}
                            {error && (
                                <>
                                    <div>An error occurred.</div>
                                    <Button type="button" variant="destructive" onClick={() => reload()}>
                                        Retry
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}