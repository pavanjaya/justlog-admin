import { adminClient } from "@/lib/supabase";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

export const dynamic = "force-dynamic";

async function getStats() {
  const db = adminClient();
  const [{ data: authData }, { data: subs }, { data: contacts }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("subscriptions").select("status, user_id"),
    db.from("contact_submissions").select("id"),
  ]);

  const totalUsers = authData?.users?.length ?? 0;
  const trialing = subs?.filter(s => s.status === "trialing").length ?? 0;
  const paid = subs?.filter(s => s.status === "active").length ?? 0;
  const convRate = totalUsers > 0 ? ((paid / totalUsers) * 100).toFixed(1) : "0";
  const contactCount = contacts?.length ?? 0;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const newUsers = authData?.users?.filter(u => u.created_at > sevenDaysAgo).length ?? 0;

  return { totalUsers, trialing, paid, convRate, contactCount, newUsers };
}

export default async function DashboardPage() {
  const s = await getStats();

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: "32px 40px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", color: "#0d0d0d" }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>Overview of JustLog</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Users" value={s.totalUsers} sub={`+${s.newUsers} this week`} accent="#9748FF" />
          <StatCard label="On Trial" value={s.trialing} sub="7-day free trial" accent="#F59E0B" />
          <StatCard label="Paid" value={s.paid} sub="Active subscribers" accent="#10B981" />
          <StatCard label="Conversion" value={`${s.convRate}%`} sub="Free → Paid" accent="#3B82F6" />
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, maxWidth: 640 }}>
          <QuickLink href="/users" icon="👥" label="Users" desc="View all user accounts" />
          <QuickLink href="/contacts" icon="💬" label="Contacts" desc={`${s.contactCount} messages`} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub: string; accent: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px 22px" }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{label}</p>
      <p style={{ fontSize: 30, fontWeight: 900, color: accent, letterSpacing: "-1px", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#bbb", marginTop: 8 }}>{sub}</p>
    </div>
  );
}

function QuickLink({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 14,
      background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16,
      padding: "18px 22px", textDecoration: "none", transition: "border-color 0.15s",
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0d0d0d" }}>{label}</p>
        <p style={{ fontSize: 12, color: "#bbb", marginTop: 2 }}>{desc}</p>
      </div>
    </Link>
  );
}
