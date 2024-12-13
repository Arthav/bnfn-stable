"use client";

import React, { useState } from "react";
import { title } from "@/components/primitives";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Stream } from "stream";
import clsx from "clsx";

const AIChatPage = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { user: "User", text: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const geminiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;

      if (!geminiKey) {
        throw new Error("Missing API Key");
      }

      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(inputValue);

      const aiMessage = {
        user: "AI",
        text: result.response.text() || "No response received from AI.",
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        user: "AI",
        text: "Error loading AI response. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
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
  // add test comment

  return (
    <div>
      <div
        className="max-w-3xl min-w-3xl mx-auto p-4 md:p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md overflow-y-scroll"
        style={{ maxHeight: "80vh", minHeight: "80vh" }}
      >
        {messages.length === 0 && (
          <p className="text-center h-full flex items-center justify-center">
            Start messaging by typing a message in the chatbox below.
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              "chat-message",
              "rounded-lg",
              "border",
              message.user === "User"
                ? "bg-blue-500 text-white flex justify-end text-right"
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

export default AIChatPage;
