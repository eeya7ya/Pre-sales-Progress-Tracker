import type { Project } from "@/lib/types";

export default function UpcomingProjectRow({ project }: { project: Project }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-white/10 last:border-b-0">
      <span className="text-white/80 text-lg">{project.title}</span>
      {project.deadline && (
        <span className="text-white/50 text-sm shrink-0 ml-4">
          {new Date(project.deadline).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}
        </span>
      )}
    </div>
  );
}
