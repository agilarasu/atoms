"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

export default function Chat() {
    const { plan_id, module_id } = useParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        setMessages([...messages, message]);
        setMessage("");
    };

    return (
        <div>
            <h1>Chat page</h1>
            <p>(Rendered on client)</p>
            <h2>Plan {plan_id} Chat</h2>
            <h3>Module {module_id}</h3>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}