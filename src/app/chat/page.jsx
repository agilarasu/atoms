'use client';

import { useChat } from 'ai/react';
import { MemoizedMarkdown } from '@/components/memoized-markdown';

export default function Page() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop } =
        useChat({});

    return (
        <>
        <div>
            <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch  overflow-y-auto">
                <div className="space-y-8 mb-4">
                    {messages.map(message => (
                        <div key={message.id}>
                            <div className="font-bold mb-2">
                                {message.role === 'user' ? 'You' : 'Assistant'}
                            </div>
                            <div className="prose space-y-2">
                                <MemoizedMarkdown id={message.id} content={message.content} />
                            </div>
                        </div>
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