"use server";

import { getDb } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyPin } from "./users";
import type { Project } from "@/lib/types";

type ProjectInput = {
  title: string;
  status: "active" | "upcoming" | "completed" | "lost";
  deadline?: string | null;
  notes?: string | null;
};

export async function getProjectsByUser(userId: number): Promise<Project[]> {
  const db = getDb();
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(projects.status, projects.deadline);
}

export async function createProject(
  userId: number,
  pin: string,
  data: ProjectInput
): Promise<{ error?: string }> {
  const user = await verifyPin(userId, pin);
  if (!user) return { error: "Invalid PIN" };
  if (!data.title.trim()) return { error: "Title is required" };
  const db = getDb();
  await db.insert(projects).values({
    userId,
    title: data.title.trim(),
    status: data.status,
    deadline: data.deadline || null,
    notes: data.notes || null,
  });
  revalidatePath("/");
  return {};
}

export async function updateProject(
  projectId: number,
  userId: number,
  pin: string,
  data: ProjectInput
): Promise<{ error?: string }> {
  const user = await verifyPin(userId, pin);
  if (!user) return { error: "Invalid PIN" };
  if (!data.title.trim()) return { error: "Title is required" };
  const db = getDb();
  await db
    .update(projects)
    .set({
      title: data.title.trim(),
      status: data.status,
      deadline: data.deadline || null,
      notes: data.notes || null,
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
  revalidatePath("/");
  return {};
}

export async function deleteProject(
  projectId: number,
  userId: number,
  pin: string
): Promise<{ error?: string }> {
  const user = await verifyPin(userId, pin);
  if (!user) return { error: "Invalid PIN" };
  const db = getDb();
  await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
  revalidatePath("/");
  return {};
}
