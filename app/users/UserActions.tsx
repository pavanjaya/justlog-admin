"use client";
import { useState } from "react";

export function UserActions({ userId, status }: { userId: string; status?: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isPro = status === "active";

  async function handleUpgrade() {
    if (!confirm(isPro ? "Downgrade this user to Free?" : "Upgrade this user to Pro for 1 year?")) return;
    setLoading(true);
    await fetch("/api/users/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: isPro ? "downgrade" : "upgrade" }),
    });
    setDone(true);
    setLoading(false);
    window.location.reload();
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
        isPro
          ? "text-red-400 hover:bg-red-50"
          : "text-[#9748FF] hover:bg-purple-50"
      }`}
    >
      {loading ? "…" : isPro ? "Downgrade" : "→ Pro"}
    </button>
  );
}
