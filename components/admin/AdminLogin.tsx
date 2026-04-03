"use client";

import { useState } from "react";
import { verifyAdminPin } from "@/lib/actions/users";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminLogin({ onAuth }: { onAuth: (pin: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await verifyAdminPin(pin);
    if (ok) {
      onAuth(pin);
    } else {
      setError("Invalid admin PIN");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
        <p className="text-sm text-gray-500 mb-6">Enter the admin PIN to manage users.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Admin PIN"
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
