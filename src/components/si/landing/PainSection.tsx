import { Icon } from "@iconify/react";

const cards = [
  {
    icon: "solar:widget-6-linear",
    text: "You're stitching together 4–6 tools to get one usable list.",
  },
  {
    icon: "solar:phone-calling-linear",
    text: "Your reps are calling accounts that haven't shown any intent.",
  },
  {
    icon: "solar:alarm-linear",
    text: "By the time your team knows to reach out, someone else already did.",
  },
];

export function PainSection() {
  return (
    <section className="bg-white py-20 px-6">
      <h2 className="text-2xl font-semibold text-[#0F0F0F] text-center">Sound familiar?</h2>
      <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
        {cards.map((card) => (
          <div key={card.icon} className="rounded-[12px] border border-[#E5E7EB] bg-white p-6">
            <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
              <Icon icon={card.icon} className="text-[#6366F1]" width={32} height={32} />
            </div>
            <p className="text-sm text-[#6B7280] mt-4 leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
