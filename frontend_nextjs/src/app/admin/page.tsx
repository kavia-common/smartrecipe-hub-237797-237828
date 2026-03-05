"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, getToken } from "@/lib/api";

type UserPublic = { id: number; name: string; email: string; role: string; created_at: string };
type RecipePublic = { id: number; title: string; category: string; author_id: number };

export default function AdminPage() {
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [recipes, setRecipes] = useState<RecipePublic[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    try {
      const [u, r] = await Promise.all([
        apiFetch<UserPublic[]>("/admin/users", undefined, { auth: true }),
        apiFetch<RecipePublic[]>("/admin/recipes", undefined, { auth: true }),
      ]);
      setUsers(u);
      setRecipes(r);
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      setError("Login required (admin).");
      return;
    }
    void load();
  }, []);

  async function deleteRecipe(id: number) {
    setBusy(true);
    setError("");
    try {
      await apiFetch<void>(`/admin/recipes/${id}`, { method: "DELETE" }, { auth: true });
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
          <h1 className="h1">Admin Console</h1>
          <Link className="btn" href="/">Back</Link>
        </div>
        {error ? <p style={{ marginTop: 10, color: "var(--danger)" }}>{error}</p> : null}
      </div>

      <div className="grid cols-2">
        <div className="card card-pad">
          <h2 className="h2">Users</h2>
          <div className="grid" style={{ gap: 8, marginTop: 10 }}>
            {users.length === 0 ? <p className="muted">No users.</p> : users.map((u) => (
              <div key={u.id} className="row" style={{ justifyContent: "space-between" }}>
                <span className="muted">{u.email}</span>
                <span className="badge">{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h2 className="h2">Recipes (Moderation)</h2>
          <div className="grid" style={{ gap: 10, marginTop: 10 }}>
            {recipes.length === 0 ? <p className="muted">No recipes.</p> : recipes.map((r) => (
              <div key={r.id} className="card" style={{ padding: 12, background: "rgba(11,16,32,0.35)" }}>
                <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                  <div className="row" style={{ flexWrap: "wrap" }}>
                    <span className="badge">#{r.id}</span>
                    <span className="badge">{r.category}</span>
                    <span className="badge">author {r.author_id}</span>
                  </div>
                  <div className="row">
                    <Link className="btn" href={`/recipes/${r.id}`}>View</Link>
                    <button className="btn btn-danger" disabled={busy} onClick={() => void deleteRecipe(r.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <strong style={{ display: "block", marginTop: 8 }}>{r.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
