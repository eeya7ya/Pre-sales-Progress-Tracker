type Status = "active" | "upcoming" | "completed" | "lost";

const statusStyles: Record<Status, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  upcoming: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  lost: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<Status, string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
  lost: "Lost",
};

export default function Badge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
