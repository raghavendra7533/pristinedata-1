import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MarketingLayout } from "@/components/si/MarketingLayout";
import logo from "@/assets/pristine-data-logo.svg";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

export default function SISignUp() {
  const navigate = useNavigate();
  const setProfile = useUserProfileStore((s) => s.setProfile);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !company.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setProfile({
      name: fullName.trim(),
      email: email.trim(),
      company: company.trim(),
      onboardingCompleted: false,
    });
    navigate("/si/onboarding");
  }

  return (
    <MarketingLayout>
      <div className="min-h-[calc(100vh-56px)] bg-[#F8F8FA] flex items-start justify-center">
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-8 w-full max-w-md mx-auto mt-16 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="Pristine Data" className="h-8 w-auto" />
          </div>

          <h1 className="text-xl font-bold text-[#0F0F0F] text-center mb-1">Create your account</h1>
          <p className="text-sm text-[#6B7280] text-center mb-6">
            Start your free trial — no credit card required.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#9CA3AF]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#9CA3AF]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">Company name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#9CA3AF]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#9CA3AF] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon
                    icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"}
                    width={18}
                    height={18}
                  />
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="rounded-full bg-[#6366F1] text-white w-full py-2.5 text-sm font-semibold hover:bg-[#4F46E5] transition-colors mt-2"
            >
              Create account
            </button>
          </form>

          <p className="text-sm text-[#6B7280] text-center mt-5">
            Already have an account?{" "}
            <NavLink to="/sign-in" className="text-[#6366F1] font-medium hover:underline">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
