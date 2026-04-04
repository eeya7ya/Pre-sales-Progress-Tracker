"use client";

import type { UserWithProjects } from "@/lib/types";
import type { Project } from "@/lib/types";

type StatusConfig = {
  label: string;
  dot: string;
  text: string;
  border: string;
  bg: string;
  icon: string;
};

function getStatusConfig(status: Project["status"]): StatusConfig {
  switch (status) {
    case "active":
      return {
        label: "Active",
        dot: "bg-emerald-400",
        text: "text-emerald-300",
        border: "border-emerald-400/40",
        bg: "bg-emerald-400/10",
        icon: "▶",
      };
    case "upcoming":
      return {
        label: "Pending",
        dot: "bg-amber-400",
        text: "text-amber-300",
        border: "border-amber-400/40",
        bg: "bg-amber-400/10",
        icon: "○",
      };
    case "completed":
      return {
        label: "Completed",
        dot: "bg-slate-400",
        text: "text-slate-400",
        border: "border-slate-400/30",
        bg: "bg-slate-400/10",
        icon: "✓",
      };
    case "lost":
      return {
        label: "Lost",
        dot: "bg-red-400",
        text: "text-red-400",
        border: "border-red-400/30",
        bg: "bg-red-400/10",
        icon: "✕",
      };
  }
}

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

export default function UserCard({ user }: { user: UserWithProjects }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = today.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Primary project for RHS: first active, then first upcoming, then any
  const activeProjects = user.projects.filter((p) => p.status === "active");
  const primaryProject =
    activeProjects[0] ??
    user.projects.find((p) => p.status === "upcoming") ??
    user.projects[0] ??
    null;

  const sidebarProjects = user.projects.filter(
    (p) => p.id !== primaryProject?.id
  );

  const completedCount = user.projects.filter(
    (p) => p.status === "completed"
  ).length;
  const totalCount = user.projects.length;

  return (
    <div className="flex flex-col h-full gap-0">
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 py-5 bg-black/20 backdrop-blur-sm border-b border-white/10 rounded-t-2xl">
        {/* Left: name + date */}
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black text-white tracking-tight leading-none">
            {user.name}
          </h2>
          <p className="text-white/50 text-sm font-medium">
            {dateStr} &nbsp;·&nbsp; {timeStr}
          </p>
        </div>

        {/* Right: summary chips */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center bg-emerald-400/15 border border-emerald-400/30 rounded-xl px-5 py-2.5">
            <span className="text-emerald-300 text-2xl font-black leading-none">
              {activeProjects.length}
            </span>
            <span className="text-emerald-400/70 text-xs font-semibold uppercase tracking-wide mt-0.5">
              Active
            </span>
          </div>
          <div className="flex flex-col items-center bg-slate-400/10 border border-slate-400/25 rounded-xl px-5 py-2.5">
            <span className="text-slate-300 text-2xl font-black leading-none">
              {completedCount} / {totalCount}
            </span>
            <span className="text-slate-400/70 text-xs font-semibold uppercase tracking-wide mt-0.5">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* ── BODY: LHS + RHS ────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* ── LHS: All other projects ────────────────────────────────── */}
        <div className="w-72 shrink-0 flex flex-col bg-black/15 border-r border-white/10 rounded-bl-2xl overflow-y-auto">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-white/35">
              Other Projects
            </p>
          </div>

          {sidebarProjects.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/25 text-sm italic text-center px-4">
                No other projects
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5 p-3">
            {sidebarProjects.map((p) => {
              const cfg = getStatusConfig(p.status);
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${cfg.bg} ${cfg.border}`}
                >
                  {/* Status icon */}
                  <span
                    className={`text-xs font-bold shrink-0 w-4 text-center ${cfg.text}`}
                  >
                    {cfg.icon}
                  </span>

                  {/* Title */}
                  <span className="flex-1 text-sm font-medium text-white/80 truncate leading-snug">
                    {p.title}
                  </span>

                  {/* Status label */}
                  <span
                    className={`text-xs font-bold shrink-0 ${cfg.text} ml-1`}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RHS: Current / Primary project ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-black/10 rounded-br-2xl">
          {/* Section label */}
          <div className="px-8 py-4 border-b border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-white/35">
              {primaryProject?.status === "active"
                ? "Current Project"
                : primaryProject
                ? "Next Up"
                : "No Project"}
            </p>
          </div>

          {!primaryProject ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/25 text-xl italic">No projects yet</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-6 px-8 py-7 overflow-y-auto">
              {/* Project title + deadline */}
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <h3 className="text-5xl font-black text-white leading-tight tracking-tight flex-1 min-w-0">
                  {primaryProject.title}
                </h3>

                {primaryProject.deadline &&
                  (() => {
                    const overdue = isOverdue(primaryProject.deadline);
                    return (
                      <span
                        className={`shrink-0 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold ${
                          overdue
                            ? "bg-red-500/70 text-white border border-red-400/50"
                            : "bg-white/10 text-white/90 border border-white/20"
                        }`}
                      >
                        <span>{overdue ? "⚠" : "📅"}</span>
                        <span>
                          {overdue ? "Overdue · " : "Due "}
                          {new Date(
                            primaryProject.deadline
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                    );
                  })()}
              </div>

              {/* Status badge */}
              {(() => {
                const cfg = getStatusConfig(primaryProject.status);
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${
                        primaryProject.status === "active"
                          ? "shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]"
                          : ""
                      }`}
                    />
                    <span className={`text-sm font-bold ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })()}

              {/* Divider */}
              <div className="h-px bg-white/10" />

              {/* Notes */}
              {primaryProject.notes ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/30">
                    Notes
                  </p>
                  <p className="text-white/75 text-lg leading-relaxed">
                    {primaryProject.notes}
                  </p>
                </div>
              ) : (
                <p className="text-white/20 text-base italic">No notes added</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
