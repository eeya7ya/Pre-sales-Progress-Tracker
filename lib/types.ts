import type { InferSelectModel } from "drizzle-orm";
import type { users, projects } from "./db/schema";

export type User = InferSelectModel<typeof users>;
export type Project = InferSelectModel<typeof projects>;

export type UserWithProjects = User & {
  projects: Project[];
};
