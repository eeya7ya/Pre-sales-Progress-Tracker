"use client";

import { useState } from "react";
import { deleteProject } from "@/lib/actions/projects";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ProjectForm from "./ProjectForm";
import type { Project } from "@/lib/types";

type ProjectRowProps = {
  project: Project;
  userId: number;
  userPin: string;
  onMutate: () => void;
};

export default function ProjectRow({ project, userId, userPin, onMutate }: ProjectRowProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"?`)) return;
    setLoading(true);
    await deleteProject(project.id, userId, userPin);
    onMutate();
    setLoading(false);
  }

  return (
    <>
      <div className="flex items-start justify-between p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-medium text-gray-900 truncate">{project.title}</p>
            <Badge status={project.status} />
          </div>
          {project.deadline && (
            <p className="text-xs text-gray-500">
              Due {new Date(project.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
          {project.notes && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{project.notes}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </div>
      </div>

      <Modal
        isOpen={editing}
        onClose={() => setEditing(false)}
        title="Edit Project"
      >
        <ProjectForm
          userId={userId}
          userPin={userPin}
          project={project}
          onSuccess={() => { setEditing(false); onMutate(); }}
          onCancel={() => setEditing(false)}
        />
      </Modal>
    </>
  );
}
