"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { ChatHistoryMessage, ChatResponse } from "@/lib/ai/chat-types";

const PdfChat = () => {
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    const previousMessages = messages;
    setMessages((prevMessages) => [...prevMessages, { user: "User", text: message }]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          instructionKey: "bhaktaSupport",
          history: previousMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as ChatResponse;
      setMessages((prevMessages) => [...prevMessages, { user: "AI", text: data.text }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "AI", text: "Error loading AI response. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <div
        className="mx-auto p-4 md:p-6 rounded-lg bg-gray-100 dark:bg-gray-900 shadow-md overflow-y-scroll"
        style={{ maxHeight: "80vh", minHeight: "80vh" }}
      >
        {messages.map((message, index) => (
          <div
            key={`${message.user}-${index}`}
            className={clsx(
              "chat-message",
              "rounded-lg",
              "border",
              "whitespace-pre-wrap",
              message.user === "User"
                ? "bg-gray-500 text-white flex justify-end text-right"
                : "flex justify-start text-left"
            )}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 py-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          aria-label="Type your message"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || inputValue.trim() === ""}
          aria-label="Send your message"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default PdfChat;
