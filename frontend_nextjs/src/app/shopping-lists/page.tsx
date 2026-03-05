"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, getToken } from "@/lib/api";

type ShoppingList = { id: number; title: string; items: string; updated_at: string };

export default function ShoppingListsPage() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [title, setTitle] = useState("My Shopping List");
  const [items, setItems] = useState("Milk\nEggs\nTomatoes");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    try {
      const data = await apiFetch<ShoppingList[]>("/shopping-lists", undefined, { auth: true });
      setLists(data);
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      setError("Login required.");
      return;
    }
    void load();
  }, []);

  async function create() {
    setBusy(true);
    setError("");
    try {
      await apiFetch("/shopping-lists", { method: "POST", body: JSON.stringify({ title, items }) }, { auth: true });
      await load();
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    setBusy(true);
    setError("");
    try {
      await apiFetch(`/shopping-lists/${id}`, { method: "DELETE" }, { auth: true });
      await load();
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid" style={{ gap: 16 }}>
      <div className="card card-pad">
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <h1 className="h1">Shopping Lists</h1>
          <Link className="btn" href="/">Back</Link>
        </div>
        {error ? <p style={{ marginTop: 10, color: "var(--danger)" }}>{error}</p> : null}
      </div>

      <div className="grid cols-2">
        <div className="card card-pad">
          <h2 className="h2">New List</h2>
          <div className="grid" style={{ gap: 10, marginTop: 10 }}>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="textarea" value={items} onChange={(e) => setItems(e.target.value)} />
            <button className="btn btn-primary" disabled={busy} onClick={() => void create()}>
              {busy ? "Working..." : "Create"}
            </button>
          </div>
        </div>

        <div className="card card-pad">
          <h2 className="h2">My Lists</h2>
          <div className="grid" style={{ gap: 10, marginTop: 10 }}>
            {lists.length === 0 ? (
              <p className="muted">No lists yet.</p>
            ) : (
              lists.map((l) => (
                <div key={l.id} className="card" style={{ padding: 12, background: "rgba(11,16,32,0.35)" }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <strong>{l.title}</strong>
                    <button className="btn btn-danger" onClick={() => void remove(l.id)} disabled={busy}>
                      Delete
                    </button>
                  </div>
                  <pre className="muted" style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{l.items}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
