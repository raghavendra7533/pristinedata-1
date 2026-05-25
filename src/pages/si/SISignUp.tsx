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
  const [companyDomain, setCompanyDomain] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinError, setLinkedinError] = useState("");

  function handleGoogleSSO() {
    console.log("Google SSO triggered");
  }

  function handleLinkedinBlur() {
    if (linkedinUrl && !/linkedin\.com\/in\//.test(linkedinUrl)) {
      setLinkedinError("Please enter a valid LinkedIn URL (linkedin.com/in/yourhandle)");
    } else {
      setLinkedinError("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !company.trim() || !companyDomain.trim() || !roleTitle.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (linkedinUrl && !/linkedin\.com\/in\//.test(linkedinUrl)) {
      setLinkedinError("Please enter a valid LinkedIn URL (linkedin.com/in/yourhandle)");
      return;
    }

    setProfile({
      name: fullName.trim(),
      email: email.trim(),
      company: company.trim(),
      role: roleTitle.trim(),
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

          <button
            type="button"
            onClick={handleGoogleSSO}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[#9CA3AF]">or</span>
            </div>
          </div>

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
              <label className="text-sm font-medium text-[#374151] mb-1 block">Company website</label>
              <input
                type="text"
                value={companyDomain}
                onChange={(e) => setCompanyDomain(e.target.value)}
                placeholder="yourcompany.com"
                className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#9CA3AF]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">Your role / title</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Account Executive, VP of Sales"
                className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#9CA3AF]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">
                LinkedIn Profile URL{" "}
                <span className="text-[#9CA3AF] font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                onBlur={handleLinkedinBlur}
                placeholder="https://linkedin.com/in/yourhandle"
                className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors placeholder:text-[#9CA3AF]"
              />
              {linkedinError && <p className="text-xs text-red-500 mt-1">{linkedinError}</p>}
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
