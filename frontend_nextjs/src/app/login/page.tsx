"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, setToken } from "@/lib/api";

type TokenResponse = { access_token: string; token_type: string };

export default function LoginPage() {
  const [email, setEmail] = useState("demo@smartrecipehub.local");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.access_token);
      window.location.href = "/";
    } catch (e2) {
      const err = e2 as ApiError;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card card-pad" style={{ maxWidth: 560, margin: "0 auto" }}>
      <h1 className="h1">Insert Coin • Login</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Use demo credentials (pre-filled) or register a new account.
      </p>

      <hr className="hr" />

      <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link className="btn" href="/register">Register</Link>
        </div>
      </form>
    </section>
  );
}
