import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const MOCK_COMPANIES = [
  { id: "acc-gong", name: "Gong", domain: "gong.io", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 92, intentDelta: 6, signals: 2 },
  { id: "acc-lattice", name: "Lattice", domain: "lattice.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 87, intentDelta: 11, signals: 2 },
  { id: "acc-outreach", name: "Outreach", domain: "outreach.io", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "Seattle, WA", intentScore: 81, intentDelta: 4, signals: 2 },
  { id: "acc-qualified", name: "Qualified", domain: "qualified.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 91, intentDelta: 8, signals: 2 },
  { id: "acc-clari", name: "Clari", domain: "clari.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "501–1,000", location: "Sunnyvale, CA", intentScore: 83, intentDelta: 9, signals: 2 },
  { id: "acc-6sense", name: "6sense", domain: "6sense.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 78, intentDelta: -2, signals: 2 },
];

export default function SISearchCompanyResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/si/search")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-3"
        >
          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
          Company Results
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {MOCK_COMPANIES.length} companies found
        </p>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {MOCK_COMPANIES.map((company) => (
          <div
            key={company.id}
            className="rounded-xl border border-[--si-card-border] shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4"
            style={{ backgroundColor: "var(--si-card-bg)" }}
          >
            {/* Favicon + Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <img
                  src={`https://www.google.com/s2/favicons?sz=20&domain=${company.domain}`}
                  alt=""
                  className="w-5 h-5 shrink-0"
                />
                <span className="text-sm font-semibold text-gray-900">{company.name}</span>
                <span className="text-xs text-gray-400">{company.domain}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {[company.industry, company.revenue, company.employees, company.location].map((chip) => (
                  <span key={chip} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Intent Score */}
            <div className="text-center shrink-0">
              <p className="text-2xl font-bold text-gray-900">{company.intentScore}</p>
              <p className={`text-xs font-medium ${company.intentDelta >= 0 ? "text-green-600" : "text-red-500"}`}>
                {company.intentDelta >= 0 ? "▲" : "▼"} {Math.abs(company.intentDelta)}
              </p>
            </div>

            {/* Action */}
            <button
              onClick={() => navigate(`/si/playbook/${company.id}`)}
              className="shrink-0 flex items-center gap-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors"
            >
              View Playbook
              <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
