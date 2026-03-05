import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartRecipe Hub",
  description: "Retro-styled recipe app with favorites, shopping lists, meal planning, and admin tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="app-shell">
          <header className="topbar">
            <div className="container">
              <nav className="nav" aria-label="Primary">
                <div className="brand">
                  <span className="brand-title">SmartRecipe Hub</span>
                  <span className="brand-sub">Retro recipes • neon vibes • fast flows</span>
                </div>
                <div className="nav-links">
                  <Link className="link" href="/">Recipes</Link>
                  <Link className="link" href="/favorites">Favorites</Link>
                  <Link className="link" href="/shopping-lists">Shopping</Link>
                  <Link className="link" href="/meal-plans">Meal Plans</Link>
                  <Link className="link" href="/admin">Admin</Link>
                  <Link className="link" href="/login">Login</Link>
                </div>
              </nav>
            </div>
          </header>

          <main className="main">
            <div className="container">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
