"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, getToken } from "@/lib/api";

type RecipePublic = { id: number; title: string };

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [dietaryTags, setDietaryTags] = useState("");
  const [cookingTime, setCookingTime] = useState(20);
  const [difficulty, setDifficulty] = useState("easy");
  const [ingredients, setIngredients] = useState("Ingredient 1\nIngredient 2");
  const [instructions, setInstructions] = useState("1) Step one\n2) Step two");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const authed = !!getToken();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const recipe = await apiFetch<RecipePublic>(
        "/recipes",
        {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            category,
            dietary_tags: dietaryTags,
            cooking_time_minutes: cookingTime,
            difficulty,
            ingredients,
            instructions,
          }),
        },
        { auth: true },
      );
      window.location.href = `/recipes/${recipe.id}`;
    } catch (e2) {
      const err = e2 as ApiError;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <section className="card card-pad" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 className="h1">New Recipe</h1>
        <p className="muted" style={{ marginTop: 6 }}>Login required to create recipes.</p>
        <hr className="hr" />
        <div className="row">
          <Link className="btn btn-primary" href="/login">Go to Login</Link>
          <Link className="btn" href="/">Back</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="card card-pad" style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <h1 className="h1">New Recipe</h1>
        <Link className="btn" href="/">Back</Link>
      </div>

      <hr className="hr" />

      <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
        <label className="grid" style={{ gap: 6 }}>
          <span className="muted">Title</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <div className="grid cols-3">
          <label className="grid" style={{ gap: 6 }}>
            <span className="muted">Category</span>
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </label>
          <label className="grid" style={{ gap: 6 }}>
            <span className="muted">Dietary tags (CSV)</span>
            <input className="input" value={dietaryTags} onChange={(e) => setDietaryTags(e.target.value)} />
          </label>
          <label className="grid" style={{ gap: 6 }}>
            <span className="muted">Difficulty</span>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </label>
        </div>

        <label className="grid" style={{ gap: 6 }}>
          <span className="muted">Cooking time (minutes)</span>
          <input
            className="input"
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(Number(e.target.value))}
            min={1}
          />
        </label>

        <label className="grid" style={{ gap: 6 }}>
          <span className="muted">Description</span>
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label className="grid" style={{ gap: 6 }}>
          <span className="muted">Ingredients</span>
          <textarea className="textarea" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </label>

        <label className="grid" style={{ gap: 6 }}>
          <span className="muted">Instructions</span>
          <textarea className="textarea" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </label>

        {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </form>
    </section>
  );
}
