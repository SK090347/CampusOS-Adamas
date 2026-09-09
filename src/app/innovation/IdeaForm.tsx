"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function IdeaForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [name, setName] = useState("Aarav Sen (demo)");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, submitterName: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOk(true);
      setTitle("");
      setDescription("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-3 p-5">
      <h2 className="text-sm font-semibold">Submit Idea</h2>
      <input className="input py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="input min-h-[100px]" placeholder="Describe your idea" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input className="input py-2" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input className="input py-2" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm text-emerald-700">Idea received. Thank you.</p>}
      <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Submitting…" : "Submit Idea"}</button>
    </form>
  );
}
