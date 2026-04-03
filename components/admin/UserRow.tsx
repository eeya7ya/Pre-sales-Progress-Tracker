"use client";

import { useState } from "react";
import { deleteUser, resetPin } from "@/lib/actions/users";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type UserRowProps = {
  user: { id: number; name: string; createdAt: Date };
  adminPin: string;
  onMutate: () => void;
};

export default function UserRow({ user, adminPin, onMutate }: UserRowProps) {
  const [resetting, setResetting] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete user "${user.name}" and all their projects?`)) return;
    setLoading(true);
    const result = await deleteUser(adminPin, user.id);
    if (result.error) setError(result.error);
    else onMutate();
    setLoading(false);
  }

  async function handleResetPin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await resetPin(adminPin, user.id, newPin);
    if (result.error) {
      setError(result.error);
    } else {
      setResetting(false);
      setNewPin("");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-xl bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-400">
            Added {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setResetting(!resetting); setError(""); setNewPin(""); }}
          >
            Reset PIN
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </div>
      </div>

      {resetting && (
        <form onSubmit={handleResetPin} className="flex items-end gap-2 mt-1">
          <Input
            label="New PIN (4 digits)"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="••••"
            error={error}
          />
          <Button type="submit" size="sm" disabled={loading || newPin.length !== 4}>
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { setResetting(false); setError(""); setNewPin(""); }}
          >
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
}
