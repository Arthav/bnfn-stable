"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import clsx from "clsx";

import { instruction } from "@/components/constant/instruction";

const AIChatPage = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInstruction, setSelectedInstruction] =
    useState<keyof typeof instruction>("customerService");
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);

  const instructionsOptions = {
    customerService: "Customer Service",
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

  const generationConfig = {
    temperature: 0.9,
    maxOutputTokens: 250,
    topP: 0.9,
    topK: 50,
  };

  const initializeChatSession = (apiKey: string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: instruction[selectedInstruction],
          },
        ],
      },
      generationConfig,
    });

    return model.startChat(); // Return new ChatSession instance
  };

  // const systempersonality = data;
  // const defaultPersonality = systempersonality;
  // const systemInstructionText = JSON.stringify(defaultPersonality);

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

      // Initialize ChatSession if not already initialized
      let session = chatSession;
      if (!session) {
        session = initializeChatSession(geminiKey);
        setChatSession(session);
      }

      // Send the user's message to the model
      const result = await session.sendMessage(inputValue);

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
    <div className="flex justify-center mb-2">
      <select
        className="bg-gray-200 dark:bg-gray-700 border border-gray-300 rounded-md p-2"
        value={selectedInstruction}
        onChange={(e) => {
          setSelectedInstruction(
            e.target.value as keyof typeof instruction
          );
          setMessages([]);
          setChatSession(null);
        }}
      >
        {Object.entries(instructionsOptions).map(([instruction, label]) => (
          <option value={instruction} key={instruction}>
            {label}
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
            key={index}
            className={clsx(
              "chat-message",
              "rounded-lg",
              "border",
              message.user === "User"
                ? "bg-gray-500 text-white flex justify-end text-right"
                : "flex justify-start text-left"
            )}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: message.text
                  .replace(/(?:\r\n|\r|\n)/g, "<br />")
                  .replace(/`([^`]+)`/g, "<code>$1</code>")
                  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*([^*]+)\*/g, "<em>$1</em>"),
              }}
            />
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
