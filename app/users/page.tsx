import { adminClient } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { UsersTable } from "./UsersTable";

export const dynamic = "force-dynamic";

async function getUsers() {
  const db = adminClient();
  const [{ data: authData }, { data: subs }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("subscriptions").select("user_id, status, valid_until, plan, created_at").order("created_at", { ascending: false }),
  ]);

  const subMap = new Map<string, { status: string; valid_until: string; plan: string }>();
  for (const s of subs ?? []) {
    if (!subMap.has(s.user_id)) subMap.set(s.user_id, s);
  }

  return (authData?.users ?? []).map(u => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in: u.last_sign_in_at ?? "",
    provider: u.app_metadata?.provider ?? "email",
    sub: subMap.get(u.id),
  })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: "32px 40px" }}>
        <UsersTable users={users} />
      </main>
    </div>
  );
}
