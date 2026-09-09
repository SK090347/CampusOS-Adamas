"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MAP_DISCLAIMER } from "@/lib/geo";

type Node = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  x: number;
  y: number;
  lat: number | null;
  lng: number | null;
  label: string | null;
  description: string | null;
};
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

  const [nName, setNName] = useState("");
  const [nx, setNx] = useState(500);
  const [ny, setNy] = useState(400);
  const [nLat, setNLat] = useState("");
  const [nLng, setNLng] = useState("");
  const [nKind, setNKind] = useState("LANDMARK");
  const [nDesc, setNDesc] = useState("");

  const [fromId, setFromId] = useState(nodes[0]?.id || "");
  const [toId, setToId] = useState(nodes[1]?.id || "");
  const [weight, setWeight] = useState(1);

  const [editId, setEditId] = useState<string>("");
  const editing = nodes.find((n) => n.id === editId);

  async function addNode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/admin/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nName,
        x: nx,
        y: ny,
        kind: nKind,
        description: nDesc || undefined,
        lat: nLat === "" ? undefined : Number(nLat),
        lng: nLng === "" ? undefined : Number(nLng),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Failed");
    setMsg(`Node created: ${data.node.name}`);
    setNName("");
    setNDesc("");
    setNLat("");
    setNLng("");
    router.refresh();
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setErr(null);
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/admin/nodes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        name: String(fd.get("name") || editing.name),
        slug: String(fd.get("slug") || editing.slug),
        kind: String(fd.get("kind") || editing.kind),
        label: String(fd.get("label") || ""),
        description: String(fd.get("description") || ""),
        x: Number(fd.get("x")),
        y: Number(fd.get("y")),
        lat: fd.get("lat") === "" ? null : Number(fd.get("lat")),
        lng: fd.get("lng") === "" ? null : Number(fd.get("lng")),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Update failed");
    setMsg(`Updated ${data.node.name}`);
    router.refresh();
  }

  async function deleteNode(id: string) {
    if (!confirm("Delete node and its edges?")) return;
    const res = await fetch(`/api/admin/nodes?id=${id}`, { method: "DELETE" });
    if (!res.ok) return setErr("Delete failed");
    setMsg("Node deleted");
    setEditId("");
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
      {msg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {msg}
        </div>
      )}
      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-900" role="alert">
          {err}
        </div>
      )}

      <section className="card p-5">
        <h2 className="font-display text-base font-semibold">{universityName}</h2>
        <p className="text-xs text-ink-500">
          {nodes.length} nodes · {edges.length} edges · {MAP_DISCLAIMER}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addNode} className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold">Add CampusNode</h3>
          <input
            className="input py-2"
            placeholder="Name"
            value={nName}
            onChange={(e) => setNName(e.target.value)}
            required
          />
          <textarea
            className="input py-2"
            placeholder="Description (optional)"
            value={nDesc}
            onChange={(e) => setNDesc(e.target.value)}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              Layout X (0–1000)
              <input
                type="number"
                className="input mt-1 py-2"
                value={nx}
                onChange={(e) => setNx(Number(e.target.value))}
              />
            </label>
            <label className="text-xs">
              Layout Y (0–800)
              <input
                type="number"
                className="input mt-1 py-2"
                value={ny}
                onChange={(e) => setNy(Number(e.target.value))}
              />
            </label>
            <label className="text-xs">
              Lat (optional approx)
              <input
                className="input mt-1 py-2"
                value={nLat}
                onChange={(e) => setNLat(e.target.value)}
                placeholder="auto from X/Y"
              />
            </label>
            <label className="text-xs">
              Lng (optional approx)
              <input
                className="input mt-1 py-2"
                value={nLng}
                onChange={(e) => setNLng(e.target.value)}
                placeholder="auto from X/Y"
              />
            </label>
          </div>
          <select className="input py-2" value={nKind} onChange={(e) => setNKind(e.target.value)}>
            {["BUILDING", "GATE", "JUNCTION", "FACILITY", "LANDMARK"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary text-xs">
            Create node
          </button>
        </form>

        <form onSubmit={addEdge} className="card space-y-3 p-5">
          <h3 className="text-sm font-semibold">Add CampusEdge</h3>
          <label className="text-xs">
            From
            <select className="input mt-1 py-2" value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            To
            <select className="input mt-1 py-2" value={toId} onChange={(e) => setToId(e.target.value)}>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            Relative weight (not metres)
            <input
              type="number"
              step="0.1"
              className="input mt-1 py-2"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </label>
          <button type="submit" className="btn-primary text-xs">
            Create edge
          </button>
        </form>
      </section>

      <section className="card space-y-3 p-5">
        <h3 className="text-sm font-semibold">Edit node overlay</h3>
        <select className="input py-2" value={editId} onChange={(e) => setEditId(e.target.value)}>
          <option value="">Select node…</option>
          {nodes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
        {editing && (
          <form onSubmit={saveEdit} className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs sm:col-span-2">
              Name
              <input name="name" className="input mt-1 py-2" defaultValue={editing.name} required />
            </label>
            <label className="text-xs">
              Slug
              <input name="slug" className="input mt-1 py-2" defaultValue={editing.slug} required />
            </label>
            <label className="text-xs">
              Kind
              <select name="kind" className="input mt-1 py-2" defaultValue={editing.kind}>
                {["BUILDING", "GATE", "JUNCTION", "FACILITY", "LANDMARK"].map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="text-xs">
              Label
              <input name="label" className="input mt-1 py-2" defaultValue={editing.label || ""} />
            </label>
            <label className="text-xs sm:col-span-2">
              Description
              <input
                name="description"
                className="input mt-1 py-2"
                defaultValue={editing.description || ""}
              />
            </label>
            <label className="text-xs">
              X
              <input name="x" type="number" className="input mt-1 py-2" defaultValue={editing.x} />
            </label>
            <label className="text-xs">
              Y
              <input name="y" type="number" className="input mt-1 py-2" defaultValue={editing.y} />
            </label>
            <label className="text-xs">
              Lat (approx)
              <input
                name="lat"
                className="input mt-1 py-2"
                defaultValue={editing.lat ?? ""}
                placeholder="approx"
              />
            </label>
            <label className="text-xs">
              Lng (approx)
              <input
                name="lng"
                className="input mt-1 py-2"
                defaultValue={editing.lng ?? ""}
                placeholder="approx"
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button type="submit" className="btn-primary text-xs">
                Save node
              </button>
              <button
                type="button"
                className="btn-ghost text-xs text-red-700"
                onClick={() => deleteNode(editing.id)}
              >
                Delete node
              </button>
            </div>
            <p className="text-[11px] text-ink-400 sm:col-span-2">{MAP_DISCLAIMER}</p>
          </form>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Edges</h3>
        <ul className="card max-h-64 divide-y divide-ink-100 overflow-y-auto">
          {edges.map((e) => (
            <li key={e.id} className="flex items-center justify-between px-4 py-2 text-sm">
              <span>
                {e.fromName} → {e.toName}{" "}
                <span className="text-ink-400">(w={e.weight})</span>
              </span>
              <button
                type="button"
                className="btn-ghost text-xs text-red-600"
                onClick={() => deleteEdge(e.id)}
              >
                Delete
              </button>
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
              <div className="text-xs text-ink-500">
                {n.sourceType} · {n.status}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Nodes directory</h3>
        <ul className="card max-h-72 divide-y divide-ink-100 overflow-y-auto text-sm">
          {nodes.map((n) => (
            <li key={n.id} className="px-4 py-2">
              <button type="button" className="text-left hover:text-campus-800" onClick={() => setEditId(n.id)}>
                <span className="font-medium">{n.name}</span> · {n.kind} · layout ({n.x}, {n.y})
                {n.lat != null && n.lng != null && (
                  <span className="text-ink-400">
                    {" "}
                    · ≈{n.lat.toFixed(5)}, {n.lng.toFixed(5)}
                  </span>
                )}
              </button>
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
