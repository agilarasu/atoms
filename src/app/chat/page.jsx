'use client';

import { useChat } from 'ai/react';
import {MemoizedMarkdown} from '@/components/memoized-markdown.tsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export default function Page() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop } =
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

    return (
        <>
            <div>
                <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch  overflow-y-auto">
                    <div className="space-y-8 mb-4">
                        {messages.map(message => (
                            <>
                                <Card className="my-4">

                                    <CardHeader>
                                        <CardTitle>{message.role === 'user' ? 'You' : 'Assistant'} </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <MemoizedMarkdown id={message.id} content={message.content} />
                                    </CardContent>
                                </Card>
                            </>

                        ))}
                    </div>

                </div>
                <form onSubmit={handleSubmit} className="flex space-x-2 w-full justify-center fixed bottom-0 p-4">
                    <input
                        name="prompt"
                        value={input}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className='w-1/2 p-2 border border-gray-300 rounded'
                    />
                    {!isLoading && (
                        <button type="submit" className="p-2 text-black rounded border border-gray-300">
                            Submit
                        </button>
                    )}

                    {isLoading && (
                        <div>
                            <button type="button" onClick={() => stop()}>
                                Stop
                            </button>
                        </div>
                    )}

                    {error && (
                        <>
                            <div>An error occurred.</div>
                            <button type="button" onClick={() => reload()}>
                                Retry
                            </button>
                        </>
                    )}
                </form>
            </div>
        </>
    );
}