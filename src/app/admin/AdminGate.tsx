"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Auth failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-3 p-5">
      <p className="text-sm text-ink-600">
        Enter the admin password from your environment (<code className="text-xs">ADMIN_PASSWORD</code>).
      </p>
      <input
        type="password"
        className="input py-2"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Checking…" : "Enter admin mode"}
      </button>
    </form>
  );
}
