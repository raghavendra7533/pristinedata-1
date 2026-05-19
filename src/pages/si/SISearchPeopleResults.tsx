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
];

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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/si/search")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-3"
        >
          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
          People Results
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {MOCK_PEOPLE.length} people found
        </p>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {MOCK_PEOPLE.map((person) => (
          <button
            key={person.id}
            onClick={() => navigate(`/si/playbook/person/${person.id}`)}
            className="w-full text-left rounded-xl border border-[--si-card-border] shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4"
            style={{ backgroundColor: "var(--si-card-bg)" }}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {getInitials(person.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{person.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{person.title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <img
                  src={`https://www.google.com/s2/favicons?sz=20&domain=${person.domain}`}
                  alt=""
                  className="w-4 h-4"
                />
                <span className="text-xs text-gray-700">{person.company}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-400">{person.location}</span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${INTENT_STYLES[person.intent]}`}>
                {person.intent}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                {person.signals} signals
              </span>
              {isSdr ? (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6366F1] text-white hover:bg-[#4F46E5]">
                  View Outreach Playbook
                  <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  View Opp Playbook
                  <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
