import React, { useState, useRef, useEffect } from "react";
import { FaCopy, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

const AICoder = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // Scroll to bottom when new responses are added
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [response]);

  const parseResponse = (text) => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    const parts = [];
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
        language: match[1] || "text",
        content: match[2],
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      Swal.fire("Warning", "Please enter a prompt.", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_QWEN_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("No response returned from the model.");

      setResponse((prev) => [...prev, ...parseResponse(content)]);
      setPrompt("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to get AI response", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    Swal.fire("Copied!", "Code copied to clipboard.", "success");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[80vh] flex flex-col relative">
      <h1 className="text-3xl font-bold text-center mb-4">CodeBRO</h1>

      {/* Scrollable Responses */}
      <div
        ref={chatRef}
        className="space-y-4 overflow-y-auto mb-36 flex-1 pr-2"
      >
        {response.length > 0 &&
          response.map((part, idx) =>
            part.type === "code" ? (
              <div
                key={idx}
                className="relative bg-base-200 p-4 rounded-lg overflow-x-auto"
              >
                <pre className="whitespace-pre-wrap">{part.content}</pre>
                <button
                  onClick={() => handleCopy(part.content)}
                  className="btn btn-sm btn-secondary absolute top-2 right-2 flex items-center"
                >
                  <FaCopy className="mr-1" /> Copy
                </button>
              </div>
            ) : (
              <p
                key={idx}
                className="bg-base-100 p-2 rounded-lg whitespace-pre-wrap"
              >
                {part.content.trim()}
              </p>
            )
          )}
      </div>

      {/* Fixed Textarea */}
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-4 left-0 w-full px-4 flex flex-col"
      >
        <textarea
          className="textarea w-full h-32 mb-2 border-2 border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg resize-none shadow-inner"
          placeholder="Enter your coding prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center"
          disabled={loading}
        >
          {loading && <FaSpinner className="animate-spin mr-2" />}
          Generate Code
        </button>
      </form>
    </div>
  );
};

export default AICoder;
