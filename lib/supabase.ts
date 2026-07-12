import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Admin client — bypasses RLS, server-side only
export const adminClient = () => createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Public client — for login/session
export const publicClient = () => createClient(url, anonKey);
