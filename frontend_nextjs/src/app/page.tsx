"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, getToken } from "@/lib/api";

type Recipe = {
  id: number;
  author_id: number;
  title: string;
  description?: string | null;
  cooking_time_minutes: number;
  difficulty: string;
  category: string;
  dietary_tags: string;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const [q, setQ] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const isAuthed = useMemo(() => !!getToken(), []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      const data = await apiFetch<Recipe[]>(`/recipes?${params.toString()}`);
      setRecipes(data);
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="grid" style={{ gap: 16 }}>
      <div className="card card-pad">
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">Recipe Arcade</h1>
            <p className="muted">
              Browse, search, and favorite recipes. Create your own if you’re logged in.
            </p>
          </div>
          <div className="row" style={{ flexWrap: "wrap" }}>
            <Link className="btn" href="/login">Login</Link>
            {isAuthed ? (
              <Link className="btn btn-primary" href="/recipes/new">+ New Recipe</Link>
            ) : null}
          </div>
        </div>

        <hr className="hr" />

        <div className="row" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
          <input
            className="input"
            placeholder="Search by name, ingredient, category, tag..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search recipes"
            style={{ flex: "1 1 320px" }}
          />
          <button className="btn btn-primary" onClick={() => void load()}>
            Search
          </button>
        </div>

        {error ? <p style={{ marginTop: 12, color: "var(--danger)" }}>{error}</p> : null}
      </div>

      <div className="grid cols-3">
        {loading ? (
          <div className="card card-pad"><p className="muted">Loading recipes...</p></div>
        ) : recipes.length === 0 ? (
          <div className="card card-pad"><p className="muted">No recipes found.</p></div>
        ) : (
          recipes.map((r) => (
            <article key={r.id} className="card card-pad">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="badge">{r.category}</span>
                <span className="badge">{r.cooking_time_minutes}m</span>
              </div>
              <h2 className="h2" style={{ marginTop: 10 }}>{r.title}</h2>
              {r.description ? <p className="muted" style={{ marginTop: 6 }}>{r.description}</p> : null}
              <div className="row" style={{ marginTop: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
                <span className="badge">{r.difficulty}</span>
                <Link className="btn" href={`/recipes/${r.id}`}>View</Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
