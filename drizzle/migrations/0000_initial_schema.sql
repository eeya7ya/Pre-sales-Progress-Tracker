-- Initial schema migration
-- Creates the project_status enum, users table, and projects table

DO $$ BEGIN
  CREATE TYPE "project_status" AS ENUM ('active', 'upcoming', 'completed', 'lost');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(100) NOT NULL UNIQUE,
  "pin_hash" varchar(64) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "title" varchar(200) NOT NULL,
  "status" "project_status" DEFAULT 'upcoming' NOT NULL,
  "deadline" date,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
