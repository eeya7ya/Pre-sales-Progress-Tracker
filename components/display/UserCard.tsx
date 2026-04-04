import type { UserWithProjects } from "@/lib/types";
import type { Project } from "@/lib/types";

type Accent = { bar: string; light: string; text: string };

type StatusMeta = {
  label: string;
  icon: string;
  dot: string;
  pill: string;
  rowBg: string;
  rowBorder: string;
  iconColor: string;
};

function statusMeta(status: Project["status"]): StatusMeta {
  switch (status) {
    case "active":
      return {
        label: "Active",
        icon: "▶",
        dot: "bg-emerald-500",
        pill: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        rowBg: "bg-emerald-50",
        rowBorder: "border-emerald-200",
        iconColor: "text-emerald-600",
      };
    case "upcoming":
      return {
        label: "Pending",
        icon: "○",
        dot: "bg-amber-400",
        pill: "bg-amber-100 text-amber-700 border border-amber-200",
        rowBg: "bg-amber-50",
        rowBorder: "border-amber-200",
        iconColor: "text-amber-500",
      };
    case "completed":
      return {
        label: "Completed",
        icon: "✓",
        dot: "bg-gray-400",
        pill: "bg-gray-100 text-gray-600 border border-gray-200",
        rowBg: "bg-gray-50",
        rowBorder: "border-gray-200",
        iconColor: "text-gray-500",
      };
    case "lost":
      return {
        label: "Lost",
        icon: "✕",
        dot: "bg-red-400",
        pill: "bg-red-100 text-red-700 border border-red-200",
        rowBg: "bg-red-50",
        rowBorder: "border-red-200",
        iconColor: "text-red-500",
      };
  }
}

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

function fmtDate(d: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(d).toLocaleDateString("en-GB", opts ?? {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UserCard({
  user,
  accent,
}: {
  user: UserWithProjects;
  accent: Accent;
}) {
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

  const active    = user.projects.filter((p) => p.status === "active");
  const completed = user.projects.filter((p) => p.status === "completed");
  const total     = user.projects.length;

  // Primary project for RHS
  const primary =
    active[0] ??
    user.projects.find((p) => p.status === "upcoming") ??
    user.projects[0] ??
    null;

  const sidebar = user.projects.filter((p) => p.id !== primary?.id);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <div className={`shrink-0 ${accent.bar} px-6 py-4 flex items-center justify-between`}>
        {/* Name + date */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-3xl font-black text-white tracking-tight leading-none">
            {user.name}
          </h2>
          <p className="text-white/70 text-sm font-medium mt-1">
            {dateStr}&nbsp;&nbsp;·&nbsp;&nbsp;{timeStr}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-white text-2xl font-black leading-none">{active.length}</p>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mt-0.5">Active</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[80px]">
            <p className="text-white text-2xl font-black leading-none">
              {completed.length}<span className="text-white/50 text-lg font-normal"> / {total}</span>
            </p>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mt-0.5">Done</p>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* LHS — Project list sidebar ─────────────────────────────── */}
        <div className="w-64 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              All Projects
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
            {user.projects.length === 0 && (
              <p className="text-gray-400 text-sm italic text-center pt-6">No projects</p>
            )}

            {user.projects.map((p) => {
              const m       = statusMeta(p.status);
              const isCurr  = p.id === primary?.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 border transition-all ${
                    isCurr
                      ? `${m.rowBg} ${m.rowBorder} ring-2 ring-offset-1 ring-indigo-300`
                      : `${m.rowBg} ${m.rowBorder}`
                  }`}
                >
                  {/* status icon */}
                  <span className={`text-xs font-bold w-4 text-center shrink-0 ${m.iconColor}`}>
                    {m.icon}
                  </span>

                  {/* title */}
                  <span
                    className={`flex-1 text-sm font-medium truncate ${
                      isCurr ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {p.title}
                  </span>

                  {/* status pill */}
                  <span className={`text-xs font-semibold shrink-0 px-1.5 py-0.5 rounded-full ${m.pill}`}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RHS — Active project detail ─────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">

          {/* Section label */}
          <div className="px-8 py-3 border-b border-gray-100 shrink-0 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {primary?.status === "active"
                ? "Currently Working On"
                : primary
                ? "Next Up"
                : "—"}
            </p>
            {primary && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusMeta(primary.status).pill}`}>
                {statusMeta(primary.status).label}
              </span>
            )}
          </div>

          {/* Content */}
          {!primary ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-gray-300">📂</span>
                </div>
                <p className="text-gray-400 text-base">No projects yet</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">

              {/* Title + deadline */}
              <div className="flex items-start justify-between gap-6">
                <h3 className="text-5xl font-black text-gray-900 leading-tight tracking-tight flex-1 min-w-0">
                  {primary.title}
                </h3>

                {primary.deadline && (() => {
                  const overdue = isOverdue(primary.deadline);
                  return (
                    <div
                      className={`shrink-0 self-start flex flex-col items-end gap-1 px-5 py-3 rounded-xl border ${
                        overdue
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-widest ${overdue ? "text-red-400" : "text-gray-400"}`}>
                        {overdue ? "⚠ Overdue" : "Due date"}
                      </span>
                      <span className={`text-xl font-black ${overdue ? "text-red-600" : "text-gray-800"}`}>
                        {fmtDate(primary.deadline)}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Active glow dot */}
              {primary.status === "active" && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">In progress</span>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Notes */}
              {primary.notes ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Notes</p>
                  <p className="text-gray-700 text-lg leading-relaxed">{primary.notes}</p>
                </div>
              ) : (
                <p className="text-gray-300 text-sm italic">No notes added for this project.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
