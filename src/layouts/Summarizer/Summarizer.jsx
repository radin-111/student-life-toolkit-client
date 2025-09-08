import React, { useState } from "react";
import { FaRegFileAlt, FaMagic, FaSpinner } from "react-icons/fa";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setSummary("");

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "qwen/qwen3-235b-a22b:free",
            messages: [
              {
                role: "user",
                content: `Summarize the following text at three levels:
1. TL;DR (1-2 sentences)
2. Bullet points (max 6)
3. Detailed summary (1 paragraph)

Text:
${text}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        }
      );

      const data = await response.json();
      setSummary(data.choices[0].message.content);
    } catch {
      setSummary("Error: Could not generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-base-100 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">
          Multi-Level Text Summarizer
        </h1>

        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-400 text-xl">
            <FaRegFileAlt />
          </span>
          <textarea
            className="textarea textarea-bordered w-full h-48 pl-10 pr-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-full mb-6 flex items-center justify-center gap-2"
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-lg" />
              Generating...
            </>
          ) : (
            "Generate Summary"
          )}
        </button>

        {summary && (
          <div className="bg-base-100 p-6 rounded-xl shadow-inner border border-gray-200">
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-secondary">
              <FaMagic /> Summary
            </h2>
            <p className="whitespace-pre-wrap text-gray-700">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summarizer;
