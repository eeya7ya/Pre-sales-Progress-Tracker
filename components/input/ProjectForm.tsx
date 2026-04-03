"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/lib/actions/projects";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Project } from "@/lib/types";

type ProjectFormProps = {
  userId: number;
  userPin: string;
  project?: Project;
  onSuccess: () => void;
  onCancel: () => void;
};

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "lost", label: "Lost" },
];

export default function ProjectForm({
  userId,
  userPin,
  project,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [status, setStatus] = useState<"active" | "upcoming" | "completed" | "lost">(project?.status ?? "upcoming");
  const [deadline, setDeadline] = useState(project?.deadline ?? "");
  const [notes, setNotes] = useState(project?.notes ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = {
      title,
      status,
      deadline: deadline || null,
      notes: notes || null,
    };
    const result = project
      ? await updateProject(project.id, userId, userPin, data)
      : await createProject(userId, userPin, data);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. ACME Corp Deal"
        required
      />
      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as "active" | "upcoming" | "completed" | "lost")}
        options={STATUS_OPTIONS}
      />
      <Input
        label="Deadline (optional)"
        type="date"
        value={deadline ?? ""}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          value={notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any relevant context..."
          rows={3}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !title.trim()}>
          {loading ? "Saving..." : project ? "Save Changes" : "Add Project"}
        </Button>
      </div>
    </form>
  );
}
