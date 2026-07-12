import { adminClient } from "@/lib/supabase";
import { Sidebar } from "../page";
import { UserActions } from "./UserActions";

export const dynamic = "force-dynamic";

async function getUsers() {
  const db = adminClient();
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  const users = data?.users ?? [];

  const { data: subs } = await db.from("subscriptions")
    .select("user_id, status, valid_until, plan, created_at")
    .order("created_at", { ascending: false });

  const subMap = new Map<string, { status: string; valid_until: string; plan: string }>();
  for (const s of subs ?? []) {
    if (!subMap.has(s.user_id)) subMap.set(s.user_id, s);
  }

  return users.map(u => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in: u.last_sign_in_at ?? "",
    provider: u.app_metadata?.provider ?? "email",
    sub: subMap.get(u.id),
  })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function planBadge(status?: string) {
  if (!status) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-400">Free</span>;
  if (status === "trialing") return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Trial</span>;
  if (status === "active") return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Pro</span>;
  if (status === "cancelled") return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-500">Cancelled</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-400">{status}</span>;
}

function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen">
      <Sidebar active="users" />
      <main className="ml-56 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#0d0d0d] tracking-tight">Users</h1>
            <p className="text-sm text-gray-500 mt-1">{users.length} total accounts</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Signed Up</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Active</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Provider</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === users.length - 1 ? "border-0" : ""}`}>
                  <td className="px-5 py-3.5 font-medium text-[#0d0d0d]">{u.email}</td>
                  <td className="px-5 py-3.5">{planBadge(u.sub?.status)}</td>
                  <td className="px-5 py-3.5 text-gray-500">{fmt(u.created_at)}</td>
                  <td className="px-5 py-3.5 text-gray-500">{fmt(u.last_sign_in)}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-gray-400 capitalize">{u.provider}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <UserActions userId={u.id} status={u.sub?.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
