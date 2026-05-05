import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useLenis, AnimatedPage } from "../../utils/animations";

export default function Timer() {
  const [mode, setMode] = useState("stopwatch"); // "stopwatch" | "countdown"
  const [time, setTime] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);
  const [countdownInput, setCountdownInput] = useState({ h: 0, m: 0, s: 0 });

  const intervalRef = useRef(null);
  const beepRef = useRef(
    typeof Audio !== "undefined"
      ? new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
      : null
  );

  // Initialize smooth scrolling
  useLenis();

  // Stopwatch / Countdown effect
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (mode === "stopwatch") {
            return prev + 1;
          } else {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsActive(false);

              // Play sound
              if (beepRef.current) {
                beepRef.current.play().catch(() => {});
              }

              // SweetAlert notification
              Swal.fire("⏰ Time's up!", "Your countdown finished!", "info");
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, mode]);

  // Format time as HH:MM:SS
  const formatTime = (sec) => {
    const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setTime(mode === "stopwatch" ? 0 : 0);
    setLaps([]);
  };

  // Record lap
  const addLap = () => {
    setLaps((prev) => [...prev, formatTime(time)]);
  };

  // Start countdown with input
  const startCountdown = () => {
    const totalSeconds =
      countdownInput.h * 3600 + countdownInput.m * 60 + countdownInput.s;
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setIsActive(true);
    } else {
      Swal.fire(
        "⚠️ Invalid Input",
        "Please set a valid countdown time.",
        "warning"
      );
    }
  };

  return (
    <AnimatedPage className="flex items-center justify-center min-h-screen bg-base-100 px-4">
      <motion.div 
        className="card w-full max-w-md shadow-xl bg-base-100 p-6 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, duration: 0.6 }}
      >
        <motion.h1 
          className="text-2xl font-bold mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ⏱ Timer
        </motion.h1>

        {/* Mode Switch */}
        <motion.div 
          className="flex justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.button
            className={`btn ${
              mode === "stopwatch" ? "btn-primary" : "btn-soft btn-primary"
            }`}
            onClick={() => {
              resetTimer();
              setMode("stopwatch");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Stopwatch
          </motion.button>
          <motion.button
            className={`btn ${
              mode === "countdown" ? "btn-primary" : "btn-soft btn-primary"
            }`}
            onClick={() => {
              resetTimer();
              setMode("countdown");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Countdown
          </motion.button>
        </motion.div>

        {/* Timer Display */}
        <motion.div 
          className="text-4xl font-mono font-semibold mb-6"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <motion.span
            key={time}
            initial={{ scale: 1.2, rotate: 5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(time)}
          </motion.span>
        </motion.div>

        {/* Stopwatch Controls */}
        <AnimatePresence>
          {mode === "stopwatch" && (
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {!isActive ? (
                <motion.button
                  className="btn btn-success w-24"
                  onClick={() => setIsActive(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {time === 0 ? "Start" : "Resume"}
                </motion.button>
              ) : (
                <motion.button
                  className="btn btn-warning w-24"
                  onClick={() => setIsActive(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Pause
                </motion.button>
              )}
              <motion.button 
                className="btn btn-error w-24" 
                onClick={resetTimer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Reset
              </motion.button>
              {time > 0 && (
                <motion.button 
                  className="btn btn-info w-24" 
                  onClick={addLap}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Lap
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown Controls */}
        <AnimatePresence>
          {mode === "countdown" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div 
                className="flex justify-center gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.input
                  type="number"
                  min="0"
                  placeholder="HH"
                  className="input input-bordered w-20"
                  value={countdownInput.h}
                  onChange={(e) =>
                    setCountdownInput({ ...countdownInput, h: +e.target.value })
                  }
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileFocus={{ scale: 1.05 }}
                />
                <motion.input
                  type="number"
                  min="0"
                  placeholder="MM"
                  className="input input-bordered w-20"
                  value={countdownInput.m}
                  onChange={(e) =>
                    setCountdownInput({ ...countdownInput, m: +e.target.value })
                  }
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  whileFocus={{ scale: 1.05 }}
                />
                <motion.input
                  type="number"
                  min="0"
                  placeholder="SS"
                  className="input input-bordered w-20"
                  value={countdownInput.s}
                  onChange={(e) =>
                    setCountdownInput({ ...countdownInput, s: +e.target.value })
                  }
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileFocus={{ scale: 1.05 }}
                />
              </motion.div>
              <motion.div 
                className="flex justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {!isActive ? (
                  <motion.button
                    className="btn btn-success w-24"
                    onClick={startCountdown}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    Start
                  </motion.button>
                ) : (
                  <motion.button
                    className="btn btn-warning w-24"
                    onClick={() => setIsActive(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Pause
                  </motion.button>
                )}
                <motion.button 
                  className="btn btn-error w-24" 
                  onClick={resetTimer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  Reset
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lap History */}
        <AnimatePresence>
          {mode === "stopwatch" && laps.length > 0 && (
            <motion.div 
              className="mt-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.h2 
                className="font-semibold mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Lap Times:
              </motion.h2>
              <motion.ul 
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {laps.map((lap, i) => (
                  <motion.li 
                    key={i} 
                    className="p-2 rounded bg-base-200"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    Lap {i + 1}: {lap}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatedPage>
  );
}
