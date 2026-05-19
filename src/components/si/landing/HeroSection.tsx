import { NavLink } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="bg-[#F8F8FA] py-24 px-6 text-center">
      <h1 className="text-4xl font-bold text-[#0F0F0F] max-w-3xl mx-auto leading-tight">
        Your reps shouldn't be guessing which accounts to call.
      </h1>
      <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mt-4">
        Pristine watches your target accounts, fires signals when the moment is right, and hands your AEs a playbook before the first call.
      </p>
      <NavLink
        to="/sign-up"
        className="rounded-full bg-[#6366F1] text-white px-8 py-3 text-sm font-semibold mt-8 inline-block hover:bg-[#4F46E5] transition-colors"
      >
        Get started free
      </NavLink>
    </section>
  );
}
