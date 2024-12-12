import React, { useEffect, useState } from 'react';
import { title } from '@/components/primitives';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIChatPage = () => {
  const [response, setResponse] = useState<string>('');

  useEffect(() => { 
    const fetchAIResponse = async () => {
      const genAI = new GoogleGenerativeAI('AIzaSyDZ5oJXhU8XvZ5X2YJY9XjZ5X2YJY9X');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      try {
        const prompt = 'Explain how AI works';
        const result = await model.generateContent(prompt);
        setResponse(result.response.text);
      } catch (error) {
        console.error('Error fetching AI response:', error);
      }
    };

    fetchAIResponse();
  }, []);

  return (
    <div>
      <h1 className={title()}>AI Chat</h1>
      <div>
        <h2>AI Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default AIChatPage;