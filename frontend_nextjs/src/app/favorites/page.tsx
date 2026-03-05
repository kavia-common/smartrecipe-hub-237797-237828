"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, getToken } from "@/lib/api";

type Recipe = { id: number; title: string; category: string; cooking_time_minutes: number; difficulty: string };

export default function FavoritesPage() {
  const [items, setItems] = useState<Recipe[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<Recipe[]>("/favorites", undefined, { auth: true });
      setItems(data);
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      setError("Login required.");
      return;
    }
    void load();
  }, []);

  return (
    <section className="grid" style={{ gap: 16 }}>
      <div className="card card-pad">
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <h1 className="h1">Favorites</h1>
          <Link className="btn" href="/">Back</Link>
        </div>
        {error ? <p style={{ marginTop: 10, color: "var(--danger)" }}>{error}</p> : null}
      </div>

      {loading ? (
        <div className="card card-pad"><p className="muted">Loading...</p></div>
      ) : items.length === 0 ? (
        <div className="card card-pad"><p className="muted">No favorites yet.</p></div>
      ) : (
        <div className="grid cols-3">
          {items.map((r) => (
            <article key={r.id} className="card card-pad">
              <span className="badge">{r.category}</span>
              <h2 className="h2" style={{ marginTop: 10 }}>{r.title}</h2>
              <p className="muted" style={{ marginTop: 6 }}>{r.cooking_time_minutes}m • {r.difficulty}</p>
              <div className="row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
                <Link className="btn" href={`/recipes/${r.id}`}>View</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
