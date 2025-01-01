'use client';

import { useChat } from 'ai/react';

export default function Page() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop } =
        useChat({});

    return (
        <>
            {messages.map(message => (
                <div key={message.id}>
                    {message.role === 'user' ? 'User: ' : 'AI: '}
                    {message.content}
                </div>
            ))}

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

            <form onSubmit={handleSubmit}>
                <input
                    name="prompt"
                    value={input}
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}