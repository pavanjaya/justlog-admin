import { adminClient } from "@/lib/supabase";
import { Sidebar } from "../page";

export const dynamic = "force-dynamic";

async function getContacts() {
  const db = adminClient();
  const { data } = await db.from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

function typeBadge(type: string) {
  if (type === "support") return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600">Support</span>;
  if (type === "partnership") return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-600">Partnership</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">General</span>;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="min-h-screen">
      <Sidebar active="contacts" />
      <main className="ml-56 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#0d0d0d] tracking-tight">Contact Submissions</h1>
          <p className="text-sm text-gray-500 mt-1">{contacts.length} messages received</p>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-16 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm font-semibold text-gray-400">No submissions yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {contacts.map((c: Record<string, string>) => (
              <div key={c.id} className="bg-white rounded-2xl border border-black/5 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[#0d0d0d]">{c.name}</span>
                      {typeBadge(c.subject_type)}
                    </div>
                    <a href={`mailto:${c.email}`} className="text-xs text-[#9748FF] hover:underline">{c.email}</a>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{fmt(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <a href={`mailto:${c.email}?subject=Re: Your message to JustLog`}
                    className="text-xs font-semibold text-[#9748FF] hover:underline">
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
