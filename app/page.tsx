"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(res.ok ? data.message : data.error);
    } catch {
      setStatus("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>IPO Informer</h1>
      <p>Get an email the moment a new ordinary-share IPO opens.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Subscribe"}
        </button>
      </form>

      {status && <p className="status">{status}</p>}
    </main>
  );
}
