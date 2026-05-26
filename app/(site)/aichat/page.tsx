"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { instruction } from "@/components/constant/instruction";
import { ChatHistoryMessage, ChatResponse, InstructionKey } from "@/lib/ai/chat-types";

const instructionsOptions: Record<InstructionKey, string> = {
  todoList: "Todo List",
  customerService: "Customer Service",
  datingSims: "Dating Sims",
  therapist: "Therapist Consultant",
  socialMedia: "Social Media Influencer",
  storyTeller: "Story Teller",
  writer: "Writer",
  songWritter: "Song Writter",
  careerCoach: "Career Coach",
  relationshipCouncelor: "Relationship Counsellor",
  triviaHost: "Trivia Host",
  techSupport: "Tech Support",
  bhaktaSupport: "Bhakta Support",
};

const AIChatPage = () => {
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedInstruction, setSelectedInstruction] =
    useState<InstructionKey>("customerService");

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
          instructionKey: selectedInstruction,
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
      <div className="flex justify-center mb-2">
        <select
          className="bg-gray-200 dark:bg-gray-700 border border-gray-300 rounded-md p-2"
          value={selectedInstruction}
          onChange={(e) => {
            setSelectedInstruction(e.target.value as InstructionKey);
            setMessages([]);
          }}
        >
          {Object.keys(instruction).map((key) => (
            <option value={key} key={key}>
              {instructionsOptions[key as InstructionKey] || key}
            </option>
          ))}
        </select>
      </div>
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

export default AIChatPage;
