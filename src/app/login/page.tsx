"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = async () => {
    await signIn("credentials", {
      identifier,
      password,
      role,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4 p-6 border rounded-md">
      <h2 className="text-2xl font-bold">Login</h2>

      <Label>Role</Label>
      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
        <option value="student">Student</option>
        <option value="parent">Parent</option>
        <option value="admin">Admin</option>
      </select>

      <Label>Index / Parent ID / Username</Label>
      <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />

      <Label>Password</Label>
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button onClick={handleLogin} className="w-full mt-4">Login</Button>
    </div>
  );
}
