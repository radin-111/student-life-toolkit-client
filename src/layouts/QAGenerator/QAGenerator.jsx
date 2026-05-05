import React, { useState } from "react";
import { FaSpinner, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useLenis, AnimatedPage, AnimatedCard } from "../../utils/animations";

const QAGenerator = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showAnswers, setShowAnswers] = useState({});

  // Initialize smooth scrolling
  useLenis();

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
    } catch {
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
    <AnimatedPage className="max-w-4xl mx-auto p-6">
      <motion.h1 
        className="text-3xl font-bold text-center mb-6 text-indigo-700"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        📚 Smart Exam & QA Generator Powered by Deepseek R1
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.textarea
          className="w-full p-4 border rounded-lg shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={6}
          placeholder="Paste your study notes here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileFocus={{ scale: 1.02 }}
        />

        <motion.button
          onClick={generateQuestions}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: "inline-block", marginRight: "8px" }}
              >
                <FaSpinner />
              </motion.div>
              Generating...
            </motion.div>
          ) : (
            "✨ Generate Questions"
          )}
        </motion.button>
      </motion.div>

      {/* Render Questions */}
      <AnimatePresence>
        <motion.div 
          className="mt-8 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {questions.map((q, i) => (
            <AnimatedCard
              key={i}
              className="p-5 border rounded-xl bg-white shadow hover:shadow-md transition-all duration-300"
              delay={0.7 + i * 0.1}
            >
              <motion.p 
                className="font-semibold text-lg mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                Q{i + 1}: {q.question}
              </motion.p>

              <AnimatePresence>
                {q.options && (
                  <motion.ul 
                    className="list-disc list-inside text-gray-700 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    {q.options.map((opt, j) => (
                      <motion.li 
                        key={j} 
                        className="pl-1"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 + i * 0.1 + j * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        {opt}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {q.answer !== undefined && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 + i * 0.1 }}
                  >
                    <motion.button
                      className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                      onClick={() => toggleAnswer(i)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                    </motion.button>

                    <AnimatePresence>
                      {showAnswers[i] && (
                        <motion.div
                          className="mt-3 p-3 border-l-4 border-green-600 bg-green-50 rounded"
                          initial={{ opacity: 0, y: -20, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -20, height: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <motion.p 
                            className="font-bold text-green-700"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            ✅ Answer:{" "}
                            {typeof q.answer === "boolean"
                              ? q.answer
                                ? "True"
                                : "False"
                              : q.answer}
                          </motion.p>
                          <AnimatePresence>
                            {q.explanation && (
                              <motion.p 
                                className="mt-1 text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                {q.explanation}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedCard>
          ))}
        </motion.div>
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default QAGenerator;
