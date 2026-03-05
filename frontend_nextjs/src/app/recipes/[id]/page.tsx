"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, getToken } from "@/lib/api";

type Recipe = {
  id: number;
  author_id: number;
  title: string;
  description?: string | null;
  ingredients: string;
  instructions: string;
  cooking_time_minutes: number;
  difficulty: string;
  category: string;
  dietary_tags: string;
  image_url?: string | null;
};

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipeId = Number(params.id);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const authed = useMemo(() => !!getToken(), []);

  async function load() {
    setError("");
    try {
      const data = await apiFetch<Recipe>(`/recipes/${recipeId}`);
      setRecipe(data);
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  async function favorite() {
    setBusy(true);
    setError("");
    try {
      await apiFetch<void>(`/recipes/${recipeId}/favorite`, { method: "POST" }, { auth: true });
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function unfavorite() {
    setBusy(true);
    setError("");
    try {
      await apiFetch<void>(`/recipes/${recipeId}/favorite`, { method: "DELETE" }, { auth: true });
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid" style={{ gap: 16 }}>
      <div className="card card-pad">
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">{recipe?.title || "Recipe"}</h1>
            <p className="muted">
              {recipe ? `${recipe.category} • ${recipe.cooking_time_minutes}m • ${recipe.difficulty}` : null}
            </p>
          </div>
          <div className="row" style={{ flexWrap: "wrap" }}>
            <Link className="btn" href="/">Back</Link>
            {authed ? (
              <>
                <button className="btn btn-primary" onClick={() => void favorite()} disabled={busy}>
                  Favorite
                </button>
                <button className="btn" onClick={() => void unfavorite()} disabled={busy}>
                  Unfavorite
                </button>
              </>
            ) : (
              <Link className="btn btn-primary" href="/login">Login to favorite</Link>
            )}
          </div>
        </div>

        {error ? <p style={{ marginTop: 12, color: "var(--danger)" }}>{error}</p> : null}
      </div>

      {recipe ? (
        <div className="grid cols-2">
          <div className="card card-pad">
            <h2 className="h2">Ingredients</h2>
            <pre className="muted" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
              {recipe.ingredients}
            </pre>
          </div>
          <div className="card card-pad">
            <h2 className="h2">Instructions</h2>
            <pre className="muted" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
              {recipe.instructions}
            </pre>
          </div>
        </div>
      ) : (
        <div className="card card-pad"><p className="muted">Loading...</p></div>
      )}
    </section>
  );
}
