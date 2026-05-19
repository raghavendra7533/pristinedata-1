import { Icon } from "@iconify/react";

const tiles = [
  {
    icon: "solar:target-bold",
    name: "ICP Discovery",
    desc: "Define your ideal customer profile and surface matching accounts instantly.",
  },
  {
    icon: "solar:bell-bold",
    name: "Signal Watchlist",
    desc: "Monitor target accounts and get alerted the moment something changes.",
  },
  {
    icon: "solar:notebook-bold",
    name: "Opportunity Playbook",
    desc: "AI-generated briefs with talking points and discovery questions before every call.",
  },
  {
    icon: "solar:settings-bold",
    name: "MCP Integration",
    desc: "Plug Pristine's intelligence directly into Claude Code via MCP.",
  },
];

export function FeatureTiles() {
  return (
    <section className="bg-white py-20 px-6">
      <h2 className="text-2xl font-semibold text-[#0F0F0F] text-center max-w-2xl mx-auto leading-snug">
        Everything your team needs to act on the right accounts at the right time
      </h2>
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto mt-12">
        {tiles.map((tile) => (
          <div key={tile.name} className="rounded-[12px] border border-[#E5E7EB] bg-white p-6">
            <Icon icon={tile.icon} className="text-[#6366F1]" width={28} height={28} />
            <p className="text-sm font-semibold text-[#0F0F0F] mt-3">{tile.name}</p>
            <p className="text-sm text-[#6B7280] mt-1">{tile.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
