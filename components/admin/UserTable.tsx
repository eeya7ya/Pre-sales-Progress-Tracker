"use client";

import { useEffect, useState } from "react";
import { getAllUsers, createUser } from "@/lib/actions/users";
import UserRow from "./UserRow";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type UserSummary = { id: number; name: string; createdAt: Date };

export default function UserTable({ adminPin }: { adminPin: string }) {
  const [userList, setUserList] = useState<UserSummary[]>([]);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await getAllUsers();
    setUserList(data as UserSummary[]);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await createUser(adminPin, name, pin);
    if (result.error) {
      setError(result.error);
    } else {
      setName("");
      setPin("");
      await load();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
      <p className="text-sm text-gray-500 mb-8">Add or remove users and reset their PINs.</p>

      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah"
          />
          <Input
            label="Initial PIN (4 digits)"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
          />
        </div>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <Button
          type="submit"
          disabled={loading || !name.trim() || pin.length !== 4}
        >
          {loading ? "Adding..." : "Add User"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {userList.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No users yet. Add one above.</p>
        )}
        {userList.map((u) => (
          <UserRow key={u.id} user={u} adminPin={adminPin} onMutate={load} />
        ))}
      </div>
    </div>
  );
}
