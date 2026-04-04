import { NextResponse } from "next/server";
import { getUsersWithActiveProjects } from "@/lib/queries/users-with-projects";

export async function GET() {
  try {
    const data = await getUsersWithActiveProjects();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
