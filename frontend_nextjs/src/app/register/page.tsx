"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";

type UserPublic = { id: number; name: string; email: string; role: string; created_at: string };

export default function RegisterPage() {
  const [name, setName] = useState("New Player");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [done, setDone] = useState<UserPublic | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await apiFetch<UserPublic>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setDone(user);
    } catch (e2) {
      const err = e2 as ApiError;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card card-pad" style={{ maxWidth: 560, margin: "0 auto" }}>
      <h1 className="h1">Register</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Create an account to favorite and add recipes.
      </p>

      <hr className="hr" />

      {done ? (
        <div className="grid" style={{ gap: 12 }}>
          <p>Account created for <strong>{done.email}</strong>.</p>
          <Link className="btn btn-primary" href="/login">Go to Login</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <label className="grid" style={{ gap: 6 }}>
            <span className="muted">Name</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="grid" style={{ gap: 6 }}>
            <span className="muted">Email</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="grid" style={{ gap: 6 }}>
            <span className="muted">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}

          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
            <Link className="btn" href="/login">Back to Login</Link>
          </div>
        </form>
      )}
    </section>
  );
}
