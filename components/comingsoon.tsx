import React from "react";

const ComingSoon: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white px-4">
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4">🚀 Coming Soon 🚀</h1>
      <p className="text-lg mb-8">We're working hard to bring you this feature.</p>
      <div className="inline-flex space-x-2">
        <span className="h-2 w-2 bg-white rounded-full animate-ping"></span>
        <span className="h-2 w-2 bg-white rounded-full animate-ping delay-150"></span>
        <span className="h-2 w-2 bg-white rounded-full animate-ping delay-300"></span>
      </div>
    </div>
  </div>
);

export default ComingSoon;
