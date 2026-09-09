"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PeopleFilters({
  initialQ,
  initialRole,
}: {
  initialQ: string;
  initialRole: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [role, setRole] = useState(initialRole);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (role) params.set("role", role);
    router.push(`/people?${params.toString()}`);
  }

  return (
    <form onSubmit={apply} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
      <label className="flex-1 text-xs">
        <span className="label-muted">Search</span>
        <input className="input mt-1 py-2" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or designation" />
      </label>
      <label className="text-xs sm:w-48">
        <span className="label-muted">Role</span>
        <select className="input mt-1 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All</option>
          <option value="LEADERSHIP">Leadership</option>
          <option value="FACULTY">Faculty</option>
          <option value="STAFF">Staff</option>
        </select>
      </label>
      <button type="submit" className="btn-primary">Filter</button>
    </form>
  );
}
