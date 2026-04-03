import { getDb } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { inArray, asc } from "drizzle-orm";
import type { UserWithProjects } from "@/lib/types";

export async function getUsersWithActiveProjects(): Promise<UserWithProjects[]> {
  const db = getDb();
  const result = await db.query.users.findMany({
    with: {
      projects: {
        where: inArray(projects.status, ["active", "upcoming"]),
        orderBy: [asc(projects.status), asc(projects.deadline)],
      },
    },
  });
  return result as UserWithProjects[];
}
