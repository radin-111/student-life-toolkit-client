import React, { useState } from "react";
import { FaRegFileAlt, FaMagic, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis, AnimatedPage, AnimatedCard } from "../../utils/animations";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize smooth scrolling
  useLenis();

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
    <AnimatedPage className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-3xl bg-base-100 p-8 rounded-2xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, duration: 0.6 }}
      >
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center text-primary"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Multi-Level Text Summarizer
        </motion.h1>

        <motion.div 
          className="relative mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.span 
            className="absolute left-3 top-3 text-gray-400 text-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaRegFileAlt />
          </motion.span>
          <motion.textarea
            className="textarea textarea-bordered w-full h-48 pl-10 pr-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.button
          className="btn btn-primary w-full mb-6 flex items-center justify-center gap-2"
          onClick={handleSummarize}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
                <FaSpinner className="text-lg" />
              </motion.div>
              Generating...
            </motion.div>
          ) : (
            "Generate Summary"
          )}
        </motion.button>

        <AnimatePresence>
          {summary && (
            <AnimatedCard 
              className="bg-base-100 p-6 rounded-xl shadow-inner border border-gray-200"
              delay={0.5}
            >
              <motion.h2 
                className="text-2xl font-semibold mb-3 flex items-center gap-2 text-secondary"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaMagic />
                </motion.div>
                Summary
              </motion.h2>
              <motion.p 
                className="whitespace-pre-wrap text-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {summary}
              </motion.p>
            </AnimatedCard>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatedPage>
  );
};

export default Summarizer;
