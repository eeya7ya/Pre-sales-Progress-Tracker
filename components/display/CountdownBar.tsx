export default function CountdownBar({
  timeLeft,
  total,
}: {
  timeLeft: number;
  total: number;
}) {
  const pct = Math.max(0, Math.min(100, (timeLeft / total) * 100));
  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/10">
      <div
        className="h-full bg-blue-400 transition-all duration-100 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
