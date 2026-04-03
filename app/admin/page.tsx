"use client";

import { useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import UserTable from "@/components/admin/UserTable";

export default function AdminPage() {
  const [adminPin, setAdminPin] = useState<string | null>(null);

  if (!adminPin) {
    return <AdminLogin onAuth={(pin) => setAdminPin(pin)} />;
  }

  return <UserTable adminPin={adminPin} />;
}
