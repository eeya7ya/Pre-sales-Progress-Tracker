"use client";

import { useEffect, useState } from "react";
import { getProjectsByUser } from "@/lib/actions/projects";
import ProjectRow from "./ProjectRow";
import ProjectForm from "./ProjectForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Project, User } from "@/lib/types";

type ProjectListProps = {
  user: User;
  userPin: string;
  onSignOut: () => void;
};

export default function ProjectList({ user, userPin, onSignOut }: ProjectListProps) {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [adding, setAdding] = useState(false);

  async function load() {
    const data = await getProjectsByUser(user.id);
    setProjectList(data);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [user.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
        <p className="text-sm text-gray-500 mb-8">Your pre-sales projects</p>

        <div className="flex justify-end mb-4">
          <Button onClick={() => setAdding(true)}>+ Add Project</Button>
        </div>

        <div className="flex flex-col gap-3">
          {projectList.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-1">No projects yet.</p>
              <p className="text-sm">Click &ldquo;Add Project&rdquo; to get started.</p>
            </div>
          )}
          {projectList.map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              userId={user.id}
              userPin={userPin}
              onMutate={load}
            />
          ))}
        </div>
      </div>

      <Modal isOpen={adding} onClose={() => setAdding(false)} title="Add Project">
        <ProjectForm
          userId={user.id}
          userPin={userPin}
          onSuccess={() => { setAdding(false); load(); }}
          onCancel={() => setAdding(false)}
        />
      </Modal>
    </div>
  );
}
