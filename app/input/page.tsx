"use client";

import { useState } from "react";
import { getAllUsers } from "@/lib/actions/users";
import LoginForm from "@/components/input/LoginForm";
import ProjectList from "@/components/input/ProjectList";
import type { User } from "@/lib/types";
import { useEffect } from "react";

type UserSummary = { id: number; name: string };

export default function InputPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [authedUser, setAuthedUser] = useState<User | null>(null);
  const [userPin, setUserPin] = useState<string>("");

  useEffect(() => {
    getAllUsers().then((data) => setUsers(data as UserSummary[]));
  }, []);

  if (authedUser) {
    return (
      <ProjectList
        user={authedUser}
        userPin={userPin}
        onSignOut={() => { setAuthedUser(null); setUserPin(""); }}
      />
    );
  }

  return (
    <LoginForm
      users={users}
      onAuth={(user, pin) => { setAuthedUser(user); setUserPin(pin); }}
    />
  );
}
