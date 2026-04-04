import { getUsersWithActiveProjects } from "@/lib/queries/users-with-projects";
import DisplayScreen from "@/components/display/DisplayScreen";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const data = await getUsersWithActiveProjects();
    return <DisplayScreen initialData={data} />;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="max-w-md rounded-xl border border-red-800 bg-red-950/40 p-8 text-center">
          <h1 className="mb-2 text-xl font-semibold text-red-400">
            Unable to load data
          </h1>
          <p className="text-sm text-red-300/70">{message}</p>
        </div>
      </div>
    );
  }
}
