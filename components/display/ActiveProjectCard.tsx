import type { Project } from "@/lib/types";

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

export default function ActiveProjectCard({ project }: { project: Project }) {
  const overdue = isOverdue(project.deadline);
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h3 className="text-2xl font-bold text-white leading-tight">{project.title}</h3>
        {project.deadline && (
          <span
            className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              overdue
                ? "bg-red-500/80 text-white"
                : "bg-white/20 text-white"
            }`}
          >
            {overdue ? "Overdue · " : "Due "}
            {new Date(project.deadline).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
      {project.notes && (
        <p className="mt-3 text-white/70 text-base line-clamp-3">{project.notes}</p>
      )}
    </div>
  );
}
