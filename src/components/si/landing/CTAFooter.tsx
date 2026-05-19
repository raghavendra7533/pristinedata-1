import { NavLink } from "react-router-dom";

export function CTAFooter() {
  return (
    <section className="bg-[#6366F1] py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-white">
        Your reps shouldn't be guessing which accounts to call.
      </h2>
      <NavLink
        to="/sign-up"
        className="rounded-full bg-white text-[#6366F1] px-8 py-3 text-sm font-semibold mt-8 inline-block hover:bg-gray-100 transition-colors"
      >
        Get started free
      </NavLink>
    </section>
  );
}
