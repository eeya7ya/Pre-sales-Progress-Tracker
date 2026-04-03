"use client";

import { useState } from "react";
import { verifyPin } from "@/lib/actions/users";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { User } from "@/lib/types";

type UserSummary = { id: number; name: string };

type LoginFormProps = {
  users: UserSummary[];
  onAuth: (user: User, pin: string) => void;
};

export default function LoginForm({ users, onAuth }: LoginFormProps) {
  const [userId, setUserId] = useState(users[0]?.id?.toString() ?? "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const user = await verifyPin(Number(userId), pin);
    if (user) {
      onAuth(user, pin);
    } else {
      setError("Invalid PIN. Please try again.");
    }
    setLoading(false);
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <p className="text-gray-500">No users have been added yet.</p>
          <p className="text-sm text-gray-400 mt-1">Ask your admin to add users at <code>/admin</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h1>
        <p className="text-sm text-gray-500 mb-6">Select your name and enter your PIN to manage projects.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Who are you?"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            options={users.map((u) => ({ value: u.id.toString(), label: u.name }))}
          />
          <Input
            label="PIN"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            error={error}
          />
          <Button type="submit" disabled={loading || pin.length !== 4}>
            {loading ? "Checking..." : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
