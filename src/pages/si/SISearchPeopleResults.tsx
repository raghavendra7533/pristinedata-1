import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

const MOCK_PEOPLE = [
  { id: "p-001", name: "Marcus Chen", title: "VP of Sales Engineering", company: "Gong", domain: "gong.io", location: "San Francisco, CA", seniority: "VP", intent: "Hot" as const, signals: 3 },
  { id: "p-002", name: "Sarah Goldstein", title: "CRO", company: "Lattice", domain: "lattice.com", location: "San Francisco, CA", seniority: "C-Suite", intent: "Hot" as const, signals: 2 },
  { id: "p-003", name: "James Whitfield", title: "Chief Revenue Officer", company: "Outreach", domain: "outreach.io", location: "Seattle, WA", seniority: "C-Suite", intent: "Warm" as const, signals: 2 },
  { id: "p-004", name: "Anika Sharma", title: "VP of Revenue Operations", company: "Qualified", domain: "qualified.com", location: "San Francisco, CA", seniority: "VP", intent: "Hot" as const, signals: 4 },
  { id: "p-005", name: "Kevin Torres", title: "VP of Data Engineering", company: "Clari", domain: "clari.com", location: "Sunnyvale, CA", seniority: "VP", intent: "Hot" as const, signals: 3 },
  { id: "p-006", name: "Rachel Kim", title: "CFO", company: "6sense", domain: "6sense.com", location: "San Francisco, CA", seniority: "C-Suite", intent: "Warm" as const, signals: 1 },
  { id: "p-007", name: "Brian Patel", title: "Head of RevOps", company: "Bombora", domain: "bombora.com", location: "New York, NY", seniority: "Director", intent: "Warm" as const, signals: 2 },
  { id: "p-008", name: "Michelle Foster", title: "Director of IT Security", company: "Clearbit", domain: "clearbit.com", location: "San Francisco, CA", seniority: "Director", intent: "Cold" as const, signals: 1 },
  { id: "p-009", name: "Daniel Park", title: "VP of Sales", company: "Apollo.io", domain: "apollo.io", location: "Phoenix, AZ", seniority: "VP", intent: "Hot" as const, signals: 5 },
  { id: "p-010", name: "Priya Nair", title: "Head of Growth", company: "Salesloft", domain: "salesloft.com", location: "Atlanta, GA", seniority: "Director", intent: "Warm" as const, signals: 3 },
  { id: "p-011", name: "Tom Erikson", title: "SVP of Revenue", company: "ZoomInfo", domain: "zoominfo.com", location: "Vancouver, WA", seniority: "SVP", intent: "Hot" as const, signals: 4 },
  { id: "p-012", name: "Lisa Huang", title: "Director of Sales Ops", company: "HubSpot", domain: "hubspot.com", location: "Boston, MA", seniority: "Director", intent: "Warm" as const, signals: 2 },
  { id: "p-013", name: "Carlos Mendez", title: "Enterprise AE", company: "Salesforce", domain: "salesforce.com", location: "Chicago, IL", seniority: "IC", intent: "Cold" as const, signals: 1 },
  { id: "p-014", name: "Natalie Brooks", title: "VP of Customer Success", company: "Gainsight", domain: "gainsight.com", location: "San Francisco, CA", seniority: "VP", intent: "Warm" as const, signals: 2 },
  { id: "p-015", name: "Raj Pillai", title: "Chief Sales Officer", company: "Drift", domain: "drift.com", location: "Boston, MA", seniority: "C-Suite", intent: "Hot" as const, signals: 6 },
  { id: "p-016", name: "Emily Zhang", title: "VP of Marketing", company: "Demandbase", domain: "demandbase.com", location: "San Francisco, CA", seniority: "VP", intent: "Hot" as const, signals: 3 },
  { id: "p-017", name: "Michael O'Brien", title: "Director of RevOps", company: "Chorus.ai", domain: "chorus.ai", location: "Salt Lake City, UT", seniority: "Director", intent: "Warm" as const, signals: 2 },
  { id: "p-018", name: "Sofia Andersen", title: "CRO", company: "Seismic", domain: "seismic.com", location: "San Diego, CA", seniority: "C-Suite", intent: "Hot" as const, signals: 4 },
  { id: "p-019", name: "David Lim", title: "Head of Enterprise Sales", company: "Highspot", domain: "highspot.com", location: "Seattle, WA", seniority: "Director", intent: "Warm" as const, signals: 3 },
  { id: "p-020", name: "Amanda Wu", title: "VP of Business Development", company: "Mindtickle", domain: "mindtickle.com", location: "San Francisco, CA", seniority: "VP", intent: "Cold" as const, signals: 1 },
  { id: "p-021", name: "Jordan Hall", title: "Sales Director", company: "Intercom", domain: "intercom.com", location: "Chicago, IL", seniority: "Director", intent: "Hot" as const, signals: 4 },
  { id: "p-022", name: "Mia Johansson", title: "VP of GTM", company: "Segment", domain: "segment.com", location: "San Francisco, CA", seniority: "VP", intent: "Warm" as const, signals: 2 },
  { id: "p-023", name: "Chris Delgado", title: "Chief Revenue Officer", company: "Twilio", domain: "twilio.com", location: "San Francisco, CA", seniority: "C-Suite", intent: "Hot" as const, signals: 5 },
  { id: "p-024", name: "Yuki Tanaka", title: "Director of Sales Engineering", company: "Snowflake", domain: "snowflake.com", location: "Bozeman, MT", seniority: "Director", intent: "Warm" as const, signals: 2 },
  { id: "p-025", name: "Olivia Grant", title: "VP of Revenue Operations", company: "Brex", domain: "brex.com", location: "San Francisco, CA", seniority: "VP", intent: "Hot" as const, signals: 3 },
  { id: "p-026", name: "Sam Okonkwo", title: "Head of Sales", company: "Rippling", domain: "rippling.com", location: "San Francisco, CA", seniority: "Director", intent: "Hot" as const, signals: 4 },
  { id: "p-027", name: "Grace Li", title: "Enterprise Sales Manager", company: "Figma", domain: "figma.com", location: "San Francisco, CA", seniority: "IC", intent: "Warm" as const, signals: 2 },
  { id: "p-028", name: "Ethan Moore", title: "VP of Partnerships", company: "Notion", domain: "notion.so", location: "San Francisco, CA", seniority: "VP", intent: "Cold" as const, signals: 1 },
  { id: "p-029", name: "Isabel Ferreira", title: "Director of Demand Gen", company: "Marketo", domain: "marketo.com", location: "San Mateo, CA", seniority: "Director", intent: "Warm" as const, signals: 3 },
  { id: "p-030", name: "Nathan Pierce", title: "SVP of Sales", company: "Zendesk", domain: "zendesk.com", location: "San Francisco, CA", seniority: "SVP", intent: "Hot" as const, signals: 5 },
];

const PAGE_SIZE = 10;

const INTENT_STYLES: Record<string, string> = {
  Hot: "bg-green-100 text-green-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-gray-100 text-gray-500",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

export default function SISearchPeopleResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const profile = useUserProfileStore((s) => s.profile);
  const isSdr = /sdr|bdr|business.?development|outbound/i.test(profile?.role ?? "");

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(MOCK_PEOPLE.length / PAGE_SIZE);
  const paginated = MOCK_PEOPLE.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--si-card-bg)" }}>
      {/* Header bar */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <button
          onClick={() => navigate("/si/search")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
          People Results
        </button>
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-bold text-gray-900">Results for &ldquo;{query}&rdquo;</h1>
          <span className="text-sm text-gray-400">{MOCK_PEOPLE.length} people</span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2.5fr_2fr_1.5fr_120px_120px_180px] border-b border-gray-200 bg-gray-50 px-6 py-2">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Company</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Intent</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Signals</span>
        <span />
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {paginated.map((person, idx) => (
          <button
            key={person.id}
            onClick={() => navigate(`/si/playbook/person/${person.id}`)}
            className={`w-full text-left grid grid-cols-[2.5fr_2fr_1.5fr_120px_120px_180px] items-center px-6 py-3.5 hover:bg-indigo-50/40 transition-colors group ${idx !== paginated.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {getInitials(person.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{person.name}</p>
                <p className="text-xs text-gray-400 truncate">{person.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <img src={`https://www.google.com/s2/favicons?sz=20&domain=${person.domain}`} alt="" className="w-4 h-4 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{person.company}</span>
            </div>

            <span className="text-sm text-gray-500 truncate">{person.location}</span>

            <div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${INTENT_STYLES[person.intent]}`}>
                {person.intent}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                {person.signals} signals
              </span>
            </div>

            <div className="flex justify-end">
              {isSdr ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6366F1] text-white group-hover:bg-[#4F46E5] transition-colors whitespace-nowrap">
                  View Outreach Playbook
                  <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 group-hover:text-indigo-700 whitespace-nowrap">
                  View Opp Playbook
                  <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-xs text-gray-400">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, MOCK_PEOPLE.length)} of {MOCK_PEOPLE.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="h-4 w-4 text-gray-600" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`min-w-[28px] h-7 rounded text-xs font-medium transition-colors ${
                p === page
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon icon="solar:arrow-right-linear" className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
