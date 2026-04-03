import { NextResponse } from "next/server";
import { getUsersWithActiveProjects } from "@/lib/queries/users-with-projects";

export const runtime = "edge";

export async function GET() {
  const data = await getUsersWithActiveProjects();
  return NextResponse.json(data);
}
