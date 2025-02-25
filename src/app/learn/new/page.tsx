'use client';

import { useChat } from 'ai/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export default function Page() {
    const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop } =
        useChat({
          "api": "/api/learn/new",
        });

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
        <>{messages.length == 0 && (
          <div>
            <h1 className='text-center'>Start Chatting to build your Learner Profile</h1>
          </div>
        )}
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
                                        <p>{message.content}</p>
                                    </CardContent>
                                </Card>
                                {message.toolInvocations?.map(toolInvocation => {
                                  const {toolName, toolCallId, state} = toolInvocation;
                                  if (state === 'result') {
                                    // clear messages
                                    setMessages([]);
                                    
                                    // redirect to new plan
                                    const { plan_id } = toolInvocation.result;
                                    window.location.href = `/learn/${plan_id}`;
                                    return null;
                                  } else {
                                    return <div key={toolCallId} className="text-center">Building your Plan ...</div>;
                                  }
                                })}
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