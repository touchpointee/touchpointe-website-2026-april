"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function SubmissionsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/submissions");
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to load submissions.");
      }
      const data = await res.json();
      setContacts(data.contacts || []);
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to database.");
      setContacts([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  return (
    <AdminShell
      title="Form Submissions"
      description="View all contact enquiries and job applications submitted through the website."
    >
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{!loading && !error && `${contacts.length + applications.length} total submission${contacts.length + applications.length !== 1 ? "s" : ""}`}</p>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
          <p className="text-sm">Fetching submissions…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-700">Database unavailable</p>
            <p className="text-sm text-rose-600 mt-1">{error}</p>
            <button onClick={fetchSubmissions} className="mt-3 text-sm font-semibold text-rose-700 underline">Try again</button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-8">

          {/* Contact Enquiries */}
          <div className="surface-strong p-6">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#7C3AED] font-semibold">Contact Enquiries</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {contacts.length} submission{contacts.length !== 1 ? "s" : ""}
              </h2>
            </div>

            {contacts.length === 0 ? (
              <div className="surface p-6 text-center text-sm text-slate-400">No contact submissions yet.</div>
            ) : (
              <div className="grid gap-4">
                {contacts.map((c: any) => (
                  <div key={c._id} className="surface p-5 grid gap-2">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-semibold text-slate-900">{c.name || "—"}</p>
                        <p className="text-sm text-slate-500">
                          {c.email}
                          {c.phone ? ` · ${c.phone}` : ""}
                          {c.company ? ` · ${c.company}` : ""}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-0.5 text-xs font-semibold text-[#7C3AED]">
                          {c.serviceInterest || "General"}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(c.createdAt)}</p>
                      </div>
                    </div>
                    {c.message && (
                      <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-1">{c.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Applications */}
          <div className="surface-strong p-6">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#7C3AED] font-semibold">Job Applications</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {applications.length} application{applications.length !== 1 ? "s" : ""}
              </h2>
            </div>

            {applications.length === 0 ? (
              <div className="surface p-6 text-center text-sm text-slate-400">No job applications yet.</div>
            ) : (
              <div className="grid gap-4">
                {applications.map((a: any) => (
                  <div key={a._id} className="surface p-5 grid gap-2">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-semibold text-slate-900">{a.name}</p>
                        <p className="text-sm text-slate-500">{a.email}{a.phone ? ` · ${a.phone}` : ""}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-0.5 text-xs font-semibold text-[#7C3AED]">
                          {a.jobTitle}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(a.createdAt)}</p>
                      </div>
                    </div>
                    {a.coverLetter && (
                      <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-1">{a.coverLetter}</p>
                    )}
                    {a.resumeUrl && (
                      <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#7C3AED] hover:underline w-fit">
                        View Resume / CV →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
