import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSend, AiOutlineUser, AiOutlineRobot } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import Swal from "sweetalert2";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm HappyBOT powered by Deepseek 🤖. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const OPENROUTER_API_KEY = import.meta.env.VITE_QWEN_KEY;

  const parseMessage = (text) => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: "code",
        content: match[2],
        language: match[1] || "text",
      });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setTyping(true);
    setInput("");

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3.1:free",
            messages: [{ role: "user", content: userMessage.text }],
          }),
        }
      );

      const data = await response.json();
      const botMessage =
        data?.choices?.[0]?.message?.content || "I couldn't get a response.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "bot", text: botMessage },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "Error: Could not reach the API.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    Swal.fire("Copied!", "Code copied to clipboard.", "success");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="flex justify-center items-center h-screen bg-base-100 text-base-content p-4">
      <div className="flex flex-col w-full max-w-5xl h-full bg-base-100 rounded-xl shadow-lg overflow-hidden border-2 border-base-300">
        {/* Header */}
        <div className="flex justify-between items-center bg-base-200 text-base-content p-5 shadow-md rounded-t-xl border-b border-base-300">
          <h2 className="text-xl font-bold tracking-wide">🤖 HappyBOT</h2>
          <span className="text-sm opacity-80 italic">AI Assistant</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-base-300">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="p-3 rounded-full bg-primary text-white shadow-md">
                  <AiOutlineRobot size={22} />
                </div>
              )}

              <div
                className={`px-4 py-3 rounded-2xl max-w-lg shadow-md text-sm md:text-base transition-all duration-200 leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-base-200 text-base-content rounded-bl-none"
                }`}
              >
                {parseMessage(msg.text).map((part, idx) =>
                  part.type === "code" ? (
                    <div
                      key={idx}
                      className="relative bg-base-300 p-2 rounded-lg my-1 overflow-x-auto"
                    >
                      <pre className="whitespace-pre-wrap">{part.content}</pre>
                      <button
                        onClick={() => handleCopy(part.content)}
                        className="absolute top-1 right-1 btn btn-xs btn-secondary flex items-center gap-1"
                      >
                        <FaCopy size={12} /> Copy
                      </button>
                    </div>
                  ) : (
                    <span key={idx}>{part.content}</span>
                  )
                )}
              </div>

              {msg.sender === "user" && (
                <div className="p-3 rounded-full bg-primary text-white shadow-md">
                  <AiOutlineUser size={22} />
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="p-3 rounded-full bg-primary text-white">
                <AiOutlineRobot size={22} />
              </div>
              <div className="bg-base-200 text-base-content rounded-2xl px-4 py-2">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 bg-base-100 flex flex-col md:flex-row gap-3 items-end rounded-b-xl border-t border-base-300">
          <textarea
            rows={4}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSend())
            }
            className="textarea w-full resize-none focus:ring-2 focus:ring-primary bg-base-200 rounded-xl border border-base-300"
          />
          <button
            onClick={handleSend}
            className="btn btn-primary px-6 py-2 shadow-md hover:scale-105 transition-transform self-stretch md:self-auto rounded-xl"
          >
            <AiOutlineSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
