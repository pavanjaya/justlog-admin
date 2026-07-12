import { adminClient } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const db = adminClient();

  const { data: users } = await db.auth.admin.listUsers({ perPage: 1000 });
  const totalUsers = users?.users?.length ?? 0;

  const { data: subs } = await db.from("subscriptions").select("status, user_id");
  const trialing = subs?.filter(s => s.status === "trialing").length ?? 0;
  const paid = subs?.filter(s => s.status === "active").length ?? 0;
  const free = totalUsers - trialing - paid;
  const convRate = totalUsers > 0 ? ((paid / totalUsers) * 100).toFixed(1) : "0";

  const { data: contacts } = await db.from("contact_submissions").select("id", { count: "exact" });
  const contactCount = contacts?.length ?? 0;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const newUsers = users?.users?.filter(u => u.created_at > sevenDaysAgo).length ?? 0;

  return { totalUsers, trialing, paid, free, convRate, contactCount, newUsers };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen">
      <Sidebar active="dashboard" />
      <main className="ml-56 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#0d0d0d] tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of JustLog</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
          <StatCard label="Total Users" value={stats.totalUsers} sub={`+${stats.newUsers} this week`} color="#9748FF" />
          <StatCard label="On Trial" value={stats.trialing} sub="7-day free trial" color="#F59E0B" />
          <StatCard label="Paid" value={stats.paid} sub="Active subscribers" color="#10B981" />
          <StatCard label="Conversion" value={`${stats.convRate}%`} sub="Free → Paid" color="#3B82F6" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <QuickLink href="/users" icon="👥" label="Users" desc="View all user accounts" />
          <QuickLink href="/contacts" icon="💬" label="Contact Submissions" desc={`${stats.contactCount} messages`} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black tracking-tight" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function QuickLink({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <Link href={href} className="bg-white rounded-2xl border border-black/5 p-5 flex items-center gap-4 hover:border-[#9748FF]/30 transition-colors group">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm font-bold text-[#0d0d0d] group-hover:text-[#9748FF] transition-colors">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </Link>
  );
}

export function Sidebar({ active }: { active: string }) {
  const links = [
    { href: "/", icon: "⚡", label: "Dashboard" },
    { href: "/users", icon: "👥", label: "Users" },
    { href: "/contacts", icon: "💬", label: "Contacts" },
  ];
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-black/5 flex flex-col p-4">
      <div className="mb-8 px-2 pt-2">
        <div className="text-xs font-bold text-[#9748FF] uppercase tracking-widest mb-0.5">Justlog</div>
        <div className="text-sm font-black text-[#0d0d0d]">Admin</div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active === l.label.toLowerCase() ? "bg-[#9748FF]/10 text-[#9748FF] font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-[#0d0d0d]"}`}>
            <span>{l.icon}</span>{l.label}
          </Link>
        ))}
      </nav>
      <form action="/api/auth/logout" method="POST">
        <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <span>🚪</span> Logout
        </button>
      </form>
    </aside>
  );
}
