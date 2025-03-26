"use client";

import React, { useState } from "react";

export const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newHistory = [...chatHistory, { sender: "user", text: userMessage }];
    setChatHistory(newHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || "Sorry, I couldn't understand." },
      ]);
    } catch (err) {
      console.error("Frontend error:", err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "There was an error. Please try again." },
      ]);
    }

    setUserMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg z-50"
      >
        💬 Chat
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[350px] sm:w-[400px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Ask the Tax Bot</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 text-xl">
              &times;
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 max-h-80 overflow-y-auto px-4 py-2 scrollbar-hide">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 text-sm ${
                  msg.sender === "user" ? "text-right text-blue-600" : "text-left text-gray-800"
                }`}
              >
                <div className="inline-block bg-gray-100 px-3 py-2 rounded-lg max-w-[80%]">
                  <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex border-t p-2">
            <input
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
              placeholder="Type your question..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};
