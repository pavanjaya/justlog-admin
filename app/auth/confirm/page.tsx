"use client";
import { useEffect } from "react";
import { publicClient } from "@/lib/supabase";

export default function AuthConfirmPage() {
  useEffect(() => {
    const supabase = publicClient();
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Store token in cookie via API then redirect
        fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: session.access_token, email: session.user.email }),
        }).then(r => {
          if (r.ok) window.location.href = "/";
          else window.location.href = "/login?error=unauthorized";
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-[#9748FF] animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Signing you in…</p>
      </div>
    </div>
  );
}
