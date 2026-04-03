import type { UserWithProjects } from "@/lib/types";
import ActiveProjectCard from "./ActiveProjectCard";
import UpcomingProjectRow from "./UpcomingProjectRow";

export default function UserCard({ user }: { user: UserWithProjects }) {
  const active = user.projects.filter((p) => p.status === "active");
  const upcoming = user.projects.filter((p) => p.status === "upcoming");

  return (
    <div className="flex flex-col h-full min-h-0">
      <h2 className="text-5xl font-black text-white mb-8 tracking-tight">{user.name}</h2>

      {/* Active projects */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-3">
          Active
        </p>
        {active.length === 0 ? (
          <p className="text-white/40 text-lg italic">No active projects</p>
        ) : (
          <div className="flex flex-col gap-4">
            {active.map((p) => (
              <ActiveProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming projects */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">
            Upcoming
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {upcoming.map((p) => (
              <UpcomingProjectRow key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
