"use server";

import { createHash } from "crypto";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { User } from "@/lib/types";

function hashPin(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

export async function verifyPin(
  userId: number,
  pin: string
): Promise<User | null> {
  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) return null;
  if (user.pinHash !== hashPin(pin)) return null;
  return user;
}

export async function verifyAdminPin(pin: string): Promise<boolean> {
  return hashPin(pin) === hashPin(process.env.ADMIN_PIN ?? "0000");
}

export async function getAllUsers(): Promise<Pick<User, "id" | "name" | "createdAt">[]> {
  const db = getDb();
  return db
    .select({ id: users.id, name: users.name, createdAt: users.createdAt })
    .from(users)
    .orderBy(users.name);
}

export async function createUser(
  adminPin: string,
  name: string,
  pin: string
): Promise<{ error?: string }> {
  if (!(await verifyAdminPin(adminPin))) return { error: "Invalid admin PIN" };
  if (!name.trim()) return { error: "Name is required" };
  if (!/^\d{4}$/.test(pin)) return { error: "PIN must be 4 digits" };
  const db = getDb();
  try {
    await db.insert(users).values({ name: name.trim(), pinHash: hashPin(pin) });
    revalidatePath("/");
    return {};
  } catch {
    return { error: "User already exists" };
  }
}

export async function deleteUser(
  adminPin: string,
  userId: number
): Promise<{ error?: string }> {
  if (!(await verifyAdminPin(adminPin))) return { error: "Invalid admin PIN" };
  const db = getDb();
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/");
  return {};
}

export async function resetPin(
  adminPin: string,
  userId: number,
  newPin: string
): Promise<{ error?: string }> {
  if (!(await verifyAdminPin(adminPin))) return { error: "Invalid admin PIN" };
  if (!/^\d{4}$/.test(newPin)) return { error: "PIN must be 4 digits" };
  const db = getDb();
  await db
    .update(users)
    .set({ pinHash: hashPin(newPin) })
    .where(eq(users.id, userId));
  return {};
}
