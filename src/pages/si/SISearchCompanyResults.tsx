import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const MOCK_COMPANIES = [
  { id: "acc-gong", name: "Gong", domain: "gong.io", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 92, intentDelta: 6 },
  { id: "acc-lattice", name: "Lattice", domain: "lattice.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 87, intentDelta: 11 },
  { id: "acc-outreach", name: "Outreach", domain: "outreach.io", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "Seattle, WA", intentScore: 81, intentDelta: 4 },
  { id: "acc-qualified", name: "Qualified", domain: "qualified.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 91, intentDelta: 8 },
  { id: "acc-clari", name: "Clari", domain: "clari.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "501–1,000", location: "Sunnyvale, CA", intentScore: 83, intentDelta: 9 },
  { id: "acc-6sense", name: "6sense", domain: "6sense.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 78, intentDelta: -2 },
  { id: "acc-salesloft", name: "Salesloft", domain: "salesloft.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Atlanta, GA", intentScore: 85, intentDelta: 7 },
  { id: "acc-apollo", name: "Apollo.io", domain: "apollo.io", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Phoenix, AZ", intentScore: 89, intentDelta: 13 },
  { id: "acc-zoominfo", name: "ZoomInfo", domain: "zoominfo.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "Vancouver, WA", intentScore: 76, intentDelta: -5 },
  { id: "acc-hubspot", name: "HubSpot", domain: "hubspot.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "Boston, MA", intentScore: 74, intentDelta: 2 },
  { id: "acc-drift", name: "Drift", domain: "drift.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Boston, MA", intentScore: 88, intentDelta: 10 },
  { id: "acc-demandbase", name: "Demandbase", domain: "demandbase.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 82, intentDelta: 6 },
  { id: "acc-chorus", name: "Chorus.ai", domain: "chorus.ai", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "Salt Lake City, UT", intentScore: 79, intentDelta: 3 },
  { id: "acc-seismic", name: "Seismic", domain: "seismic.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Diego, CA", intentScore: 90, intentDelta: 14 },
  { id: "acc-highspot", name: "Highspot", domain: "highspot.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Seattle, WA", intentScore: 84, intentDelta: 5 },
  { id: "acc-mindtickle", name: "Mindtickle", domain: "mindtickle.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 71, intentDelta: -3 },
  { id: "acc-intercom", name: "Intercom", domain: "intercom.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "Chicago, IL", intentScore: 86, intentDelta: 8 },
  { id: "acc-segment", name: "Segment", domain: "segment.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 77, intentDelta: 1 },
  { id: "acc-twilio", name: "Twilio", domain: "twilio.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "San Francisco, CA", intentScore: 93, intentDelta: 15 },
  { id: "acc-snowflake", name: "Snowflake", domain: "snowflake.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "Bozeman, MT", intentScore: 80, intentDelta: -1 },
  { id: "acc-brex", name: "Brex", domain: "brex.com", industry: "FinTech", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 88, intentDelta: 9 },
  { id: "acc-rippling", name: "Rippling", domain: "rippling.com", industry: "HR Tech", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 94, intentDelta: 17 },
  { id: "acc-figma", name: "Figma", domain: "figma.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 73, intentDelta: -4 },
  { id: "acc-notion", name: "Notion", domain: "notion.so", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 69, intentDelta: -6 },
  { id: "acc-marketo", name: "Marketo", domain: "marketo.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Mateo, CA", intentScore: 75, intentDelta: 3 },
  { id: "acc-zendesk", name: "Zendesk", domain: "zendesk.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "San Francisco, CA", intentScore: 82, intentDelta: 7 },
  { id: "acc-gainsight", name: "Gainsight", domain: "gainsight.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 79, intentDelta: 4 },
  { id: "acc-bombora", name: "Bombora", domain: "bombora.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "New York, NY", intentScore: 85, intentDelta: 11 },
  { id: "acc-clearbit", name: "Clearbit", domain: "clearbit.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 70, intentDelta: -2 },
  { id: "acc-mixpanel", name: "Mixpanel", domain: "mixpanel.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "201–500", location: "San Francisco, CA", intentScore: 76, intentDelta: 5 },
];

const PAGE_SIZE = 10;

export default function SISearchCompanyResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(MOCK_COMPANIES.length / PAGE_SIZE);
  const paginated = MOCK_COMPANIES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--si-card-bg)" }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <button
          onClick={() => navigate("/si/search")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
          Company Results
        </button>
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-bold text-gray-900">Results for &ldquo;{query}&rdquo;</h1>
          <span className="text-sm text-gray-400">{MOCK_COMPANIES.length} companies</span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1fr_1.2fr_1fr_1.2fr_100px_140px] border-b border-gray-200 bg-gray-50 px-6 py-2">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Company</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Industry</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Revenue</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Employees</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Intent</span>
        <span />
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {paginated.map((company, idx) => (
          <button
            key={company.id}
            onClick={() => navigate(`/si/playbook/${company.id}`)}
            className={`w-full text-left grid grid-cols-[2fr_1fr_1.2fr_1fr_1.2fr_100px_140px] items-center px-6 py-3.5 hover:bg-indigo-50/40 transition-colors group ${idx !== paginated.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            {/* Company name + domain */}
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={`https://www.google.com/s2/favicons?sz=20&domain=${company.domain}`} alt="" className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <span className="text-sm font-semibold text-gray-900">{company.name}</span>
                <span className="text-xs text-gray-400 ml-2">{company.domain}</span>
              </div>
            </div>

            <span className="text-sm text-gray-600">{company.industry}</span>
            <span className="text-sm text-gray-600">{company.revenue}</span>
            <span className="text-sm text-gray-600">{company.employees}</span>
            <span className="text-sm text-gray-500 truncate">{company.location}</span>

            {/* Intent score + delta */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-gray-900">{company.intentScore}</span>
              <span className={`text-[11px] font-semibold ${company.intentDelta >= 0 ? "text-green-600" : "text-red-500"}`}>
                {company.intentDelta >= 0 ? "▲" : "▼"}{Math.abs(company.intentDelta)}
              </span>
            </div>

            {/* CTA */}
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6366F1] text-white group-hover:bg-[#4F46E5] transition-colors whitespace-nowrap">
                View Playbook
                <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-xs text-gray-400">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, MOCK_COMPANIES.length)} of {MOCK_COMPANIES.length}
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
                p === page ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-200"
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
