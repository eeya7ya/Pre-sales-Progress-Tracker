"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UserWithProjects } from "@/lib/types";
import UserCard from "./UserCard";

const STORAGE_KEY = "display_interval_ms";
const DEFAULT_INTERVAL = 30_000;
const POLL_INTERVAL = 3_000;

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

  // Auto-refresh data every 3 seconds
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/users-with-projects");
        if (res.ok) {
          const fresh: UserWithProjects[] = await res.json();
          setData(fresh);
        }
      } catch {
        // silent — keep showing cached data
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
  const pct = Math.max(0, Math.min(100, (timeLeft / intervalMs) * 100));

  // Per-user accent colors (light-theme friendly)
  const accents = [
    { bar: "bg-indigo-600", light: "bg-indigo-50", text: "text-indigo-700" },
    { bar: "bg-violet-600", light: "bg-violet-50", text: "text-violet-700" },
    { bar: "bg-cyan-600",   light: "bg-cyan-50",   text: "text-cyan-700"   },
    { bar: "bg-emerald-600",light: "bg-emerald-50",text: "text-emerald-700"},
    { bar: "bg-rose-600",   light: "bg-rose-50",   text: "text-rose-700"   },
    { bar: "bg-amber-600",  light: "bg-amber-50",  text: "text-amber-700"  },
  ];
  const accent = accents[index % accents.length];

  if (data.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400">📋</span>
          </div>
          <p className="text-gray-500 text-xl font-semibold">No users yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add users at <span className="font-mono bg-gray-100 px-1 rounded">/admin</span>{" "}
            and projects at <span className="font-mono bg-gray-100 px-1 rounded">/input</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* ── Slim top control bar ─────────────────────────────────── */}
      <div className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          Pre-sales Progress Tracker
        </span>

        <div className="flex items-center gap-2">
          {/* Auto-refresh indicator */}
          <span className="flex items-center gap-1.5 text-gray-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>

          {/* Timer / settings toggle */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="text-gray-400 hover:text-gray-700 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 transition-colors"
          >
            ⏱ {Math.ceil(timeLeft / 1000)}s
          </button>

          {/* Pagination */}
          <span className="text-gray-400 text-xs font-medium w-10 text-center">
            {index + 1} / {data.length}
          </span>

          <button
            onClick={goPrev}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm transition-colors"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      {/* Settings popover */}
      {settingsOpen && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <label className="text-gray-600 text-sm">Rotation interval (seconds)</label>
          <input
            type="number"
            min={5}
            max={300}
            value={inputSec}
            onChange={(e) => setInputSec(e.target.value)}
            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={applyInterval}
            className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={() => setSettingsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Main content (fills remaining height) ───────────────── */}
      <div className="flex-1 p-3 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {current && <UserCard user={current} accent={accent} />}
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div className="h-1 bg-gray-200 shrink-0">
        <div
          className="h-full bg-indigo-500 transition-all duration-100 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
