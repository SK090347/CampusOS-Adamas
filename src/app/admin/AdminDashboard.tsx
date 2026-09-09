"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Node = { id: string; name: string; slug: string; kind: string; x: number; y: number; label: string | null };
type Edge = { id: string; fromNodeId: string; toNodeId: string; weight: number; fromName: string; toName: string };
type Pulse = { id: string; area: string; status: string; message: string };

export function AdminDashboard({
  nodes,
  edges,
  pulse,
  notices,
  universityName,
}: {
  nodes: Node[];
  edges: Edge[];
  pulse: Pulse[];
  notices: { id: string; title: string; sourceType: string; status: string }[];
  universityName: string;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // New node form
  const [nName, setNName] = useState("");
  const [nx, setNx] = useState(500);
  const [ny, setNy] = useState(400);
  const [nKind, setNKind] = useState("LANDMARK");

  // New edge
  const [fromId, setFromId] = useState(nodes[0]?.id || "");
  const [toId, setToId] = useState(nodes[1]?.id || "");
  const [weight, setWeight] = useState(1);

  async function addNode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/admin/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nName, x: nx, y: ny, kind: nKind }),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Failed");
    setMsg(`Node created: ${data.node.name}`);
    setNName("");
    router.refresh();
  }

  async function addEdge(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/admin/edges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromNodeId: fromId, toNodeId: toId, weight }),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Failed");
    setMsg("Edge created");
    router.refresh();
  }

  async function deleteEdge(id: string) {
    const res = await fetch(`/api/admin/edges?id=${id}`, { method: "DELETE" });
    if (!res.ok) return setErr("Delete failed");
    setMsg("Edge deleted");
    router.refresh();
  }

  async function updatePulse(id: string, status: string, message: string) {
    const res = await fetch("/api/admin/pulse", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, message }),
    });
    if (!res.ok) return setErr("Pulse update failed");
    setMsg("Pulse updated");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{msg}</div>}
      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-900">{err}</div>}

      <section className="card p-5">
        <h2 className="text-sm font-semibold">{universityName}</h2>
        <p className="text-xs text-ink-500">{nodes.length} nodes · {edges.length} edges · topology only</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addNode} className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold">Add CampusNode</h3>
          <input className="input py-2" placeholder="Name" value={nName} onChange={(e) => setNName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">X (0–1000)
              <input type="number" className="input mt-1 py-2" value={nx} onChange={(e) => setNx(Number(e.target.value))} />
            </label>
            <label className="text-xs">Y (0–800)
              <input type="number" className="input mt-1 py-2" value={ny} onChange={(e) => setNy(Number(e.target.value))} />
            </label>
          </div>
          <select className="input py-2" value={nKind} onChange={(e) => setNKind(e.target.value)}>
            {["BUILDING", "GATE", "JUNCTION", "FACILITY", "LANDMARK"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary text-xs">Create node</button>
        </form>

        <form onSubmit={addEdge} className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold">Add CampusEdge</h3>
          <label className="text-xs">From
            <select className="input mt-1 py-2" value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </label>
          <label className="text-xs">To
            <select className="input mt-1 py-2" value={toId} onChange={(e) => setToId(e.target.value)}>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </label>
          <label className="text-xs">Relative weight (not metres)
            <input type="number" step="0.1" className="input mt-1 py-2" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
          </label>
          <button type="submit" className="btn-primary text-xs">Create edge</button>
        </form>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Edges</h3>
        <ul className="card max-h-64 divide-y divide-ink-100 overflow-y-auto">
          {edges.map((e) => (
            <li key={e.id} className="flex items-center justify-between px-4 py-2 text-sm">
              <span>{e.fromName} → {e.toName} <span className="text-ink-400">(w={e.weight})</span></span>
              <button type="button" className="btn-ghost text-xs text-red-600" onClick={() => deleteEdge(e.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Campus Pulse</h3>
        <ul className="space-y-3">
          {pulse.map((p) => (
            <PulseEditor key={p.id} pulse={p} onSave={updatePulse} />
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Notice source review</h3>
        <ul className="card divide-y divide-ink-100">
          {notices.map((n) => (
            <li key={n.id} className="px-4 py-3 text-sm">
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-ink-500">{n.sourceType} · {n.status}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Nodes (relative coordinates)</h3>
        <ul className="card max-h-64 divide-y divide-ink-100 overflow-y-auto text-sm">
          {nodes.map((n) => (
            <li key={n.id} className="px-4 py-2">
              {n.name} · {n.kind} · ({n.x}, {n.y})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PulseEditor({
  pulse,
  onSave,
}: {
  pulse: Pulse;
  onSave: (id: string, status: string, message: string) => void;
}) {
  const [status, setStatus] = useState(pulse.status);
  const [message, setMessage] = useState(pulse.message);
  return (
    <div className="card space-y-2 p-4">
      <div className="text-sm font-medium">{pulse.area}</div>
      <select className="input py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
        {["OPEN", "LIMITED", "CLOSED", "INFO"].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input className="input py-2" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="button" className="btn-secondary text-xs" onClick={() => onSave(pulse.id, status, message)}>
        Save pulse
      </button>
    </div>
  );
}
