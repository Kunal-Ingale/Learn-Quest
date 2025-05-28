import { Progress } from "@/components/ui/progress";

export default function Sidebar({
  total,
  completed,
}: {
  total: number;
  completed: number;
}) {
  const percent = Math.round((completed / total) * 100);
  return (
    <div className="bg-zinc-900 text-white p-6 rounded-lg w-full lg:w-72">
      <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
      <div className="space-y-4">
        <Progress value={percent} />
        <div>{percent}% completed</div>
        <div>Total Videos: {total}</div>
        <div>Completed: {completed}</div>
        <div>Remaining: {total - completed}</div>
      </div>
    </div>
  );
}
