import { adminClient } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";

export const dynamic = "force-dynamic";

async function getContacts() {
  const db = adminClient();
  const { data } = await db.from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    support:     { label: "Support",     bg: "#DBEAFE", color: "#2563EB" },
    partnership: { label: "Partnership", bg: "#F3F0FF", color: "#7C3AED" },
  };
  const s = map[type] ?? { label: "General", bg: "#F3F3F1", color: "#999" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: "32px 40px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", color: "#0d0d0d" }}>Contacts</h1>
          <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{contacts.length} messages received</p>
        </div>

        {contacts.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "80px 40px", textAlign: "center" }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>💬</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#bbb" }}>No submissions yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {contacts.map((c: Record<string, string>) => (
              <div key={c.id} style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0d0d0d" }}>{c.name}</span>
                      <TypeBadge type={c.subject_type} />
                    </div>
                    <a href={`mailto:${c.email}`} style={{ fontSize: 12, color: "#9748FF", textDecoration: "none" }}>{c.email}</a>
                  </div>
                  <span style={{ fontSize: 11, color: "#bbb", whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(c.created_at)}</span>
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{c.message}</p>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F5F5F3" }}>
                  <a href={`mailto:${c.email}?subject=Re: Your message to JustLog`}
                    style={{ fontSize: 12, fontWeight: 700, color: "#9748FF", textDecoration: "none" }}>
                    Reply →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
