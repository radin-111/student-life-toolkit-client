import React, { useState } from "react";
import { FaSpinner, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Swal from "sweetalert2";

const QAGenerator = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showAnswers, setShowAnswers] = useState({});

  const toggleAnswer = (i) =>
    setShowAnswers((prev) => ({ ...prev, [i]: !prev[i] }));

  const generateQuestions = async () => {
    if (!text.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please enter some text to generate questions.",
      });
      return;
    }

    setLoading(true);
    setQuestions([]);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Exam QA Generator",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: `Generate 10 exam-style questions (MCQ, T/F, or short answer) based on this text. 
                        Return only valid JSON in format:
                        { "questions": [ { "question": "...", "options": [...], "answer": "..." } ] }.
                        \n\nText:\n${text}`,
            },
          ],
        }),
      });

      const data = await res.json();

      let raw = data?.choices?.[0]?.message?.content || "";
      const match = raw.match(/```json([\s\S]*?)```/);
      const jsonString = match ? match[1].trim() : raw;

      const parsed = JSON.parse(jsonString);
      setQuestions(parsed.questions || []);

      Swal.fire({
        icon: "success",
        title: "Questions Generated!",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate questions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        📚 Smart Exam & QA Generator Powered by Deepseek R1
      </h1>

      <textarea
        className="w-full p-4 border rounded-lg shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={6}
        placeholder="Paste your study notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generateQuestions}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center transition ${
          loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" /> Generating...
          </>
        ) : (
          "✨ Generate Questions"
        )}
      </button>

      {/* Render Questions */}
      <div className="mt-8 space-y-6">
        {questions.map((q, i) => (
          <div
            key={i}
            className="p-5 border rounded-xl bg-white shadow hover:shadow-md transition"
          >
            <p className="font-semibold text-lg mb-2">
              Q{i + 1}: {q.question}
            </p>

            {q.options && (
              <ul className="list-disc list-inside text-gray-700 mb-3">
                {q.options.map((opt, j) => (
                  <li key={j} className="pl-1">
                    {opt}
                  </li>
                ))}
              </ul>
            )}

            {q.answer !== undefined && (
              <div>
                <button
                  className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                  onClick={() => toggleAnswer(i)}
                >
                  {showAnswers[i] ? (
                    <>
                      Hide Answer <FaChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Show Answer <FaChevronDown size={14} />
                    </>
                  )}
                </button>

                {showAnswers[i] && (
                  <div className="mt-3 p-3 border-l-4 border-green-600 bg-green-50 rounded">
                    <p className="font-bold text-green-700">
                      ✅ Answer:{" "}
                      {typeof q.answer === "boolean"
                        ? q.answer
                          ? "True"
                          : "False"
                        : q.answer}
                    </p>
                    {q.explanation && (
                      <p className="mt-1 text-gray-600">{q.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAGenerator;
