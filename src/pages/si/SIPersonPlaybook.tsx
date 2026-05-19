import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const MOCK_PEOPLE = [
  { id: "p-001", name: "Marcus Chen", title: "VP of Sales Engineering", company: "Gong", domain: "gong.io", location: "San Francisco, CA", seniority: "VP", intent: "Hot", signals: 3 },
  { id: "p-002", name: "Sarah Goldstein", title: "CRO", company: "Lattice", domain: "lattice.com", location: "San Francisco, CA", seniority: "C-Suite", intent: "Hot", signals: 2 },
  { id: "p-003", name: "James Whitfield", title: "Chief Revenue Officer", company: "Outreach", domain: "outreach.io", location: "Seattle, WA", seniority: "C-Suite", intent: "Warm", signals: 2 },
  { id: "p-004", name: "Anika Sharma", title: "VP of Revenue Operations", company: "Qualified", domain: "qualified.com", location: "San Francisco, CA", seniority: "VP", intent: "Hot", signals: 4 },
  { id: "p-005", name: "Kevin Torres", title: "VP of Data Engineering", company: "Clari", domain: "clari.com", location: "Sunnyvale, CA", seniority: "VP", intent: "Hot", signals: 3 },
  { id: "p-006", name: "Rachel Kim", title: "CFO", company: "6sense", domain: "6sense.com", location: "San Francisco, CA", seniority: "C-Suite", intent: "Warm", signals: 1 },
  { id: "p-007", name: "Brian Patel", title: "Head of RevOps", company: "Bombora", domain: "bombora.com", location: "New York, NY", seniority: "Director", intent: "Warm", signals: 2 },
  { id: "p-008", name: "Michelle Foster", title: "Director of IT Security", company: "Clearbit", domain: "clearbit.com", location: "San Francisco, CA", seniority: "Director", intent: "Cold", signals: 1 },
];

const PLAYBOOK_DATA: Record<string, { signals: string[]; whyNow: string[]; talkingPoints: string[]; email: { subject: string; body: string } }> = {
  default: {
    signals: [
      "Company recently expanded engineering team by 30%",
      "Published blog post about scaling data infrastructure",
      "Attended a revenue operations conference last month",
    ],
    whyNow: [
      "Their company is in a rapid growth phase, expanding headcount and investing in new tooling.",
      "Recent public content suggests they are evaluating solutions in your category.",
      "Industry peers have adopted similar platforms, creating competitive pressure to act.",
    ],
    talkingPoints: [
      "Reference their recent team expansion and how it creates operational complexity your platform solves.",
      "Highlight a case study from a peer company in their space that achieved measurable ROI.",
      "Ask about their current tech stack and where they see gaps in their revenue workflow.",
      "Position your platform as a force multiplier for their existing investments.",
    ],
    email: {
      subject: "Quick question about your growth plans",
      body: `Hi {{firstName}},

I noticed {{company}} has been growing quickly — congrats on the momentum. Companies at your stage often hit a point where existing tools start to buckle under the weight of a larger team.

We helped {{peerCompany}} cut their ramp time by 40% after a similar growth sprint. Would it make sense to compare notes?

Happy to share what we've seen work — no strings attached.

Best,
[Your Name]`,
    },
  },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

export default function SIPersonPlaybook() {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();

  const person = MOCK_PEOPLE.find((p) => p.id === personId) || MOCK_PEOPLE[0];
  const playbook = PLAYBOOK_DATA.default;

  const emailBody = playbook.email.body
    .replace("{{firstName}}", person.name.split(" ")[0])
    .replace("{{company}}", person.company)
    .replace("{{peerCompany}}", "a similar company");

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <aside className="w-72 shrink-0 border-r border-[--si-card-border] overflow-y-auto p-6" style={{ backgroundColor: "var(--si-card-bg)" }}>
        {/* Avatar */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold mb-3">
            {getInitials(person.name)}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{person.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{person.title}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <img
              src={`https://www.google.com/s2/favicons?sz=20&domain=${person.domain}`}
              alt=""
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">{person.company}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {person.location}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              {person.seniority}
            </span>
          </div>
        </div>

        <hr className="border-[--si-card-border] mb-5" />

        {/* Account Signals */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Account Signals</h3>
          <ul className="space-y-2">
            {playbook.signals.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <Icon icon="solar:bell-linear" className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Engagement */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Engagement</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Icon icon="solar:clock-circle-linear" className="h-3.5 w-3.5 text-gray-400" />
              Last active 3 days ago
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Sentiment: Positive
            </div>
          </div>
        </div>
      </aside>

      {/* Right Panel */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
              Back
            </button>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Individual Opp Playbook</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-900">{person.name}</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            <Icon icon="solar:refresh-linear" className="h-4 w-4" />
            Regenerate
          </button>
        </div>

        <div className="space-y-5 max-w-3xl">
          {/* Why reach out now */}
          <section className="rounded-xl border border-[--si-card-border] shadow-sm p-5" style={{ backgroundColor: "var(--si-card-bg)" }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon icon="solar:bolt-linear" className="h-4 w-4 text-amber-500" />
              Why reach out now
            </h3>
            <ul className="space-y-2">
              {playbook.whyNow.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-indigo-500 font-medium mt-0.5">{i + 1}.</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Personalized talking points */}
          <section className="rounded-xl border border-[--si-card-border] shadow-sm p-5" style={{ backgroundColor: "var(--si-card-bg)" }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon icon="solar:chat-round-dots-linear" className="h-4 w-4 text-indigo-500" />
              Personalized talking points
            </h3>
            <ol className="space-y-2">
              {playbook.talkingPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-indigo-500 font-semibold mt-0.5">{i + 1}.</span>
                  {point}
                </li>
              ))}
            </ol>
          </section>

          {/* Suggested outreach */}
          <section className="rounded-xl border border-[--si-card-border] shadow-sm p-5" style={{ backgroundColor: "var(--si-card-bg)" }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon icon="solar:letter-linear" className="h-4 w-4 text-green-500" />
              Suggested outreach
            </h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="space-y-1 mb-3 text-xs text-gray-500">
                <p><span className="font-medium text-gray-600">To:</span> {person.name} &lt;{person.name.toLowerCase().replace(" ", ".")}@{person.domain}&gt;</p>
                <p><span className="font-medium text-gray-600">Subject:</span> {playbook.email.subject}</p>
              </div>
              <hr className="border-gray-200 mb-3" />
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{emailBody}</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
