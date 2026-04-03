import { getUsersWithActiveProjects } from "@/lib/queries/users-with-projects";
import DisplayScreen from "@/components/display/DisplayScreen";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getUsersWithActiveProjects();
  return <DisplayScreen initialData={data} />;
}
