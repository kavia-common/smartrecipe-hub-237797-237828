"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, getToken } from "@/lib/api";

type MealPlan = { id: number; plan_date: string; meal_type: string; recipe_id?: number | null; note: string };

export default function MealPlansPage() {
  const [items, setItems] = useState<MealPlan[]>([]);
  const [planDate, setPlanDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [mealType, setMealType] = useState("dinner");
  const [recipeId, setRecipeId] = useState<string>("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    try {
      const data = await apiFetch<MealPlan[]>("/meal-plans", undefined, { auth: true });
      setItems(data);
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
      await apiFetch(
        "/meal-plans",
        {
          method: "POST",
          body: JSON.stringify({
            plan_date: planDate,
            meal_type: mealType,
            recipe_id: recipeId.trim() ? Number(recipeId) : null,
            note,
          }),
        },
        { auth: true },
      );
      setNote("");
      setRecipeId("");
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
      await apiFetch(`/meal-plans/${id}`, { method: "DELETE" }, { auth: true });
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
          <h1 className="h1">Meal Plans</h1>
          <Link className="btn" href="/">Back</Link>
        </div>
        {error ? <p style={{ marginTop: 10, color: "var(--danger)" }}>{error}</p> : null}
      </div>

      <div className="grid cols-2">
        <div className="card card-pad">
          <h2 className="h2">New Entry</h2>
          <div className="grid" style={{ gap: 10, marginTop: 10 }}>
            <label className="grid" style={{ gap: 6 }}>
              <span className="muted">Date</span>
              <input className="input" type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)} />
            </label>

            <label className="grid" style={{ gap: 6 }}>
              <span className="muted">Meal type</span>
              <select className="input" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="breakfast">breakfast</option>
                <option value="lunch">lunch</option>
                <option value="dinner">dinner</option>
                <option value="snack">snack</option>
              </select>
            </label>

            <label className="grid" style={{ gap: 6 }}>
              <span className="muted">Recipe ID (optional)</span>
              <input className="input" value={recipeId} onChange={(e) => setRecipeId(e.target.value)} placeholder="e.g. 1" />
            </label>

            <label className="grid" style={{ gap: 6 }}>
              <span className="muted">Note</span>
              <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." />
            </label>

            <button className="btn btn-primary" disabled={busy} onClick={() => void create()}>
              {busy ? "Working..." : "Create"}
            </button>
          </div>
        </div>

        <div className="card card-pad">
          <h2 className="h2">My Plan</h2>
          <div className="grid" style={{ gap: 10, marginTop: 10 }}>
            {items.length === 0 ? (
              <p className="muted">No entries yet.</p>
            ) : (
              items.map((m) => (
                <div key={m.id} className="card" style={{ padding: 12, background: "rgba(11,16,32,0.35)" }}>
                  <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                    <div className="row" style={{ flexWrap: "wrap" }}>
                      <span className="badge">{m.plan_date}</span>
                      <span className="badge">{m.meal_type}</span>
                      {m.recipe_id ? <span className="badge">recipe #{m.recipe_id}</span> : null}
                    </div>
                    <button className="btn btn-danger" onClick={() => void remove(m.id)} disabled={busy}>
                      Delete
                    </button>
                  </div>
                  {m.note ? <p className="muted" style={{ marginTop: 8 }}>{m.note}</p> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
