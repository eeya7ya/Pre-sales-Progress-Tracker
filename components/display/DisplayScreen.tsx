"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UserWithProjects } from "@/lib/types";
import UserCard from "./UserCard";
import CountdownBar from "./CountdownBar";

const STORAGE_KEY = "display_interval_ms";
const DEFAULT_INTERVAL = 30_000;
const POLL_INTERVAL = 5_000;

export default function DisplayScreen({
  initialData,
}: {
  initialData: UserWithProjects[];
}) {
  const [data, setData] = useState(initialData);
  const [index, setIndex] = useState(0);
  const [intervalMs, setIntervalMs] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_INTERVAL;
    return Number(localStorage.getItem(STORAGE_KEY) ?? DEFAULT_INTERVAL);
  });
  const [timeLeft, setTimeLeft] = useState(intervalMs);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inputSec, setInputSec] = useState(String(Math.round(intervalMs / 1000)));
  const intervalMsRef = useRef(intervalMs);
  intervalMsRef.current = intervalMs;

  // Rotation tick
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          setIndex((i) => (i + 1) % (data.length || 1));
          return intervalMsRef.current;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(id);
  }, [data.length, intervalMs]);

  // Polling
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/users-with-projects");
        if (res.ok) {
          const fresh: UserWithProjects[] = await res.json();
          setData(fresh);
        }
      } catch {
        // silent — we keep showing cached data
      }
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % (data.length || 1));
    setTimeLeft(intervalMs);
  }, [data.length, intervalMs]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + (data.length || 1)) % (data.length || 1));
    setTimeLeft(intervalMs);
  }, [data.length, intervalMs]);

  function applyInterval() {
    const secs = Math.max(5, Number(inputSec) || 30);
    const ms = secs * 1000;
    setIntervalMs(ms);
    setTimeLeft(ms);
    localStorage.setItem(STORAGE_KEY, String(ms));
    setSettingsOpen(false);
  }

  const current = data[index];

  // Gradient backgrounds cycling per user
  const gradients = [
    "from-indigo-900 via-blue-900 to-slate-900",
    "from-violet-900 via-purple-900 to-slate-900",
    "from-cyan-900 via-teal-900 to-slate-900",
    "from-emerald-900 via-green-900 to-slate-900",
    "from-rose-900 via-pink-900 to-slate-900",
    "from-orange-900 via-amber-900 to-slate-900",
  ];
  const gradient = gradients[index % gradients.length];

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-2xl font-light">No users yet.</p>
          <p className="text-white/30 text-base mt-2">
            Add users at <span className="font-mono">/admin</span> and projects at{" "}
            <span className="font-mono">/input</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-700 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-4">
        <div className="text-white/40 text-sm font-medium">
          Pre-sales Progress
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/30 text-sm">
            {index + 1} / {data.length}
          </span>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="text-white/40 hover:text-white/70 transition-colors text-sm"
          >
            ⏱ {Math.ceil(timeLeft / 1000)}s
          </button>
        </div>
      </div>

      {/* Settings drawer */}
      {settingsOpen && (
        <div className="mx-8 mb-4 bg-black/30 backdrop-blur-sm rounded-xl px-6 py-4 flex items-center gap-4">
          <label className="text-white/60 text-sm whitespace-nowrap">
            Rotation interval (seconds)
          </label>
          <input
            type="number"
            min={5}
            max={300}
            value={inputSec}
            onChange={(e) => setInputSec(e.target.value)}
            className="w-24 rounded-lg bg-white/10 border border-white/20 text-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={applyInterval}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            Apply
          </button>
          <button
            onClick={() => setSettingsOpen(false)}
            className="text-white/40 hover:text-white/70 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 px-8 pb-16 overflow-auto">
        {current && <UserCard user={current} />}
      </div>

      {/* Nav buttons */}
      <div className="fixed bottom-4 right-6 flex gap-2">
        <button
          onClick={goPrev}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        >
          ›
        </button>
      </div>

      <CountdownBar timeLeft={timeLeft} total={intervalMs} />
    </div>
  );
}
