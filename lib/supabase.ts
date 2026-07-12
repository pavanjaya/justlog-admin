import { createClient } from "@supabase/supabase-js";

const url = "https://vhetrfxndakszuclqaxz.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZXRyZnhuZGFrc3p1Y2xxYXh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY2NjQ3NywiZXhwIjoyMDk3MjQyNDc3fQ.joDZla3DBLJABANnnXN6m9PE5wChTi3q6WPfffRqFS0";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZXRyZnhuZGFrc3p1Y2xxYXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjY0NzcsImV4cCI6MjA5NzI0MjQ3N30.U7KyQMjm2D3Vu6HwCXnqbpu9RtbMKOSKWnMNm43AOpA";

// Admin client — bypasses RLS, server-side only
export const adminClient = () => createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Public client — for login/session
export const publicClient = () => createClient(url, anonKey);
