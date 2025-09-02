import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

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
    <div className="flex items-center justify-center min-h-screen bg-base-100 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">⏱ Timer</h1>

        {/* Mode Switch */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`btn ${
              mode === "stopwatch" ? "btn-primary" : "btn-soft btn-primary"
            }`}
            onClick={() => {
              resetTimer();
              setMode("stopwatch");
            }}
          >
            Stopwatch
          </button>
          <button
            className={`btn ${
              mode === "countdown" ? "btn-primary" : "btn-soft btn-primary"
            }`}
            onClick={() => {
              resetTimer();
              setMode("countdown");
            }}
          >
            Countdown
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-4xl font-mono font-semibold mb-6">
          {formatTime(time)}
        </div>

        {/* Stopwatch Controls */}
        {mode === "stopwatch" && (
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {!isActive ? (
              <button
                className="btn btn-success w-24"
                onClick={() => setIsActive(true)}
              >
                {time === 0 ? "Start" : "Resume"}
              </button>
            ) : (
              <button
                className="btn btn-warning w-24"
                onClick={() => setIsActive(false)}
              >
                Pause
              </button>
            )}
            <button className="btn btn-error w-24" onClick={resetTimer}>
              Reset
            </button>
            {time > 0 && (
              <button className="btn btn-info w-24" onClick={addLap}>
                Lap
              </button>
            )}
          </div>
        )}

        {/* Countdown Controls */}
        {mode === "countdown" && (
          <div>
            <div className="flex justify-center gap-2 mb-4">
              <input
                type="number"
                min="0"
                placeholder="HH"
                className="input input-bordered w-20"
                value={countdownInput.h}
                onChange={(e) =>
                  setCountdownInput({ ...countdownInput, h: +e.target.value })
                }
              />
              <input
                type="number"
                min="0"
                placeholder="MM"
                className="input input-bordered w-20"
                value={countdownInput.m}
                onChange={(e) =>
                  setCountdownInput({ ...countdownInput, m: +e.target.value })
                }
              />
              <input
                type="number"
                min="0"
                placeholder="SS"
                className="input input-bordered w-20"
                value={countdownInput.s}
                onChange={(e) =>
                  setCountdownInput({ ...countdownInput, s: +e.target.value })
                }
              />
            </div>
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <button
                  className="btn btn-success w-24"
                  onClick={startCountdown}
                >
                  Start
                </button>
              ) : (
                <button
                  className="btn btn-warning w-24"
                  onClick={() => setIsActive(false)}
                >
                  Pause
                </button>
              )}
              <button className="btn btn-error w-24" onClick={resetTimer}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Lap History */}
        {mode === "stopwatch" && laps.length > 0 && (
          <div className="mt-6 text-left">
            <h2 className="font-semibold mb-2">Lap Times:</h2>
            <ul className="space-y-1">
              {laps.map((lap, i) => (
                <li key={i} className="p-2 rounded bg-base-200">
                  Lap {i + 1}: {lap}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
