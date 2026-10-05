import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const universities = [
  "Ambo University",
  "Addis Ababa University",
  "Jimma University",
  "Hawassa University",
  "ASTU",
];

function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: "", progress: 0, textColor: "text-slate-400" };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 8) {
    return { score, label: "Weak", progress: 25, textColor: "text-red-400" };
  }

  if (score <= 1) {
    return { score, label: "Weak", progress: 25, textColor: "text-red-400" };
  }

  if (score === 2) {
    return { score, label: "Fair", progress: 50, textColor: "text-amber-400" };
  }

  if (score === 3) {
    return { score, label: "Good", progress: 75, textColor: "text-blue-400" };
  }

  return { score, label: "Strong", progress: 100, textColor: "text-emerald-400" };
}

export default function Hero() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [formNotice, setFormNotice] = useState("");

  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
    remember: true,
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    university: universities[0],
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const passwordStrength = useMemo(
    () => getPasswordStrength(registerForm.password),
    [registerForm.password]
  );

  const passwordsMatch =
    registerForm.confirmPassword.length > 0 &&
    registerForm.confirmPassword === registerForm.password;

  const handleLoginChange = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
    setLoginErrors((current) => ({ ...current, [field]: "" }));
    setFormNotice("");
  };

  const handleRegisterChange = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
    setRegisterErrors((current) => ({ ...current, [field]: "" }));
    setFormNotice("");
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    const identifier = loginForm.identifier.trim();

    if (!identifier) errors.identifier = "Enter your email or username.";
    else if (identifier.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      errors.identifier = "Enter a valid email address or use your username.";
    }

    if (!loginForm.password) errors.password = "Enter your password.";
    else if (loginForm.password.length < 8) errors.password = "Password must be at least 8 characters.";

    setLoginErrors(errors);
    setFormNotice(Object.keys(errors).length ? "" : "Your details are valid. Connect an authentication service to sign in.");
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    const errors = {};

    if (!registerForm.fullName.trim()) errors.fullName = "Enter your full name.";
    if (!registerForm.email.trim()) errors.email = "Enter your student email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!registerForm.password) errors.password = "Create a password.";
    else if (registerForm.password.length < 8) errors.password = "Password must be at least 8 characters.";

    if (!registerForm.confirmPassword) errors.confirmPassword = "Confirm your password.";
    else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!registerForm.agreeToTerms) errors.agreeToTerms = "You must agree before creating an account.";

    setRegisterErrors(errors);
    setFormNotice(Object.keys(errors).length ? "" : "Your details are valid. Connect an authentication service to create your account.");
  };

  return (
    <main className="min-h-screen bg-[#f5f1e8] p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(14, 116, 144, 0.78)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80')",
              }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                <GraduationCap className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Freshman Portal</p>
                <p className="text-lg font-semibold">Ethiopian Student Hub</p>
              </div>
            </div>

            <div className="relative z-10 max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-100">
                <Sparkles className="h-3.5 w-3.5" />
                Academic Excellence
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
                Your next breakthrough starts here.
              </h1>

              <p className="mt-5 text-base leading-8 text-slate-200">
                Access verified exam archives, track your semester preparation, and build momentum
                with the best resources from Ethiopia’s leading universities.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Access 2,400+ verified exam papers",
                  "Prepare smarter with course-based review sets",
                  "Join a growing community of focused students",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-slate-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Student motivation</p>
              <p className="mt-4 text-xl font-medium leading-8 text-white italic">
                “Discipline is choosing your future every single day. Your archive is the first step.”
              </p>
            </div>
          </section>

          <section className="bg-slate-950 p-5 text-white sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-inner shadow-slate-950/60">
                {[
                  { id: "signin", label: "Sign In" },
                  { id: "signup", label: "Create Student Account" },
                ].map((tab) => (
                    <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFormNotice("");
                    }}
                    className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-slate-900 shadow-lg shadow-slate-950/30"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "signin" ? (
                <div className="animate-[fadeIn_0.25s_ease]">
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Welcome back</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Sign in to continue</h2>
                  </div>

                  <form className="space-y-5" onSubmit={handleLoginSubmit} noValidate>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Email or username</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={loginForm.identifier}
                          onChange={(event) => handleLoginChange("identifier", event.target.value)}
                          placeholder="name@university.edu.et"
                          aria-invalid={Boolean(loginErrors.identifier)}
                          aria-describedby={loginErrors.identifier ? "login-identifier-error" : undefined}
                          className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                      </div>
                      {loginErrors.identifier && <p id="login-identifier-error" className="text-xs text-red-300" role="alert">{loginErrors.identifier}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Password</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(event) => handleLoginChange("password", event.target.value)}
                          placeholder="Enter your password"
                          aria-invalid={Boolean(loginErrors.password)}
                          aria-describedby={loginErrors.password ? "login-password-error" : undefined}
                          className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="text-slate-400 transition hover:text-white"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {loginErrors.password && <p id="login-password-error" className="text-xs text-red-300" role="alert">{loginErrors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <label className="flex cursor-pointer items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={loginForm.remember}
                          onChange={(event) => handleLoginChange("remember", event.target.checked)}
                          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                        />
                        Remember Me
                      </label>

                      <button type="button" className="font-medium text-emerald-300 transition hover:text-emerald-200">
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    {formNotice && <p className="text-center text-xs leading-5 text-emerald-300" role="status">{formNotice}</p>}

                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700" />
                      </div>
                      <div className="relative flex justify-center text-[11px] uppercase tracking-[0.24em] text-slate-500">
                        <span className="bg-slate-950 px-3">Or continue with</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-800"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                          fill="#EA4335"
                          d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.6-2.6C16.7 3.1 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-1.8H12z"
                        />
                        <path fill="#34A853" d="M3.7 7.4l3.8 2.8c1-1.9 3.1-3.2 5.5-3.2 1.9 0 3.2.8 4 1.5l2.6-2.6C16.7 3.1 14.7 2 12 2c-4.9 0-9.1 3-10.3 7.4z" opacity=".9" />
                        <path fill="#FBBC05" d="M3.7 16.6A10 10 0 0 1 2 12c0-1.3.3-2.6.8-3.7l3.9 3c-.2.7-.3 1.4-.3 2.2 0 .8.1 1.5.3 2.2l-3.7 2.3z" opacity=".9" />
                        <path fill="#4285F4" d="M12 22c2.4 0 4.4-.8 5.9-2.2l-2.8-2.3c-.8.5-1.8.9-3.1.9-2.2 0-4.1-1.4-4.7-3.3l-3.7 2.9C2.8 19.2 6.8 22 12 22z" opacity=".9" />
                      </svg>
                      Continue with Google
                    </button>
                  </form>
                </div>
              ) : (
                <div className="animate-[fadeIn_0.25s_ease]">
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">New student</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Create your account</h2>
                  </div>

                  <form className="space-y-4" onSubmit={handleRegisterSubmit} noValidate>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Full Name</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <User className="h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={registerForm.fullName}
                          onChange={(event) => handleRegisterChange("fullName", event.target.value)}
                          placeholder="Abebe Bekele"
                          aria-invalid={Boolean(registerErrors.fullName)}
                          aria-describedby={registerErrors.fullName ? "register-name-error" : undefined}
                          className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                      </div>
                      {registerErrors.fullName && <p id="register-name-error" className="text-xs text-red-300" role="alert">{registerErrors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Student Email</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={registerForm.email}
                          onChange={(event) => handleRegisterChange("email", event.target.value)}
                          placeholder="abebe@aau.edu.et"
                          aria-invalid={Boolean(registerErrors.email)}
                          aria-describedby={registerErrors.email ? "register-email-error" : undefined}
                          className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                      </div>
                      {registerErrors.email && <p id="register-email-error" className="text-xs text-red-300" role="alert">{registerErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Target University</label>
                      <select
                        value={registerForm.university}
                        onChange={(event) => handleRegisterChange("university", event.target.value)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {universities.map((university) => (
                          <option key={university} value={university} className="bg-slate-900 text-white">
                            {university}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Password</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={(event) => handleRegisterChange("password", event.target.value)}
                          placeholder="Create a secure password"
                          aria-invalid={Boolean(registerErrors.password)}
                          aria-describedby={registerErrors.password ? "register-password-error" : undefined}
                          className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="text-slate-400 transition hover:text-white"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {registerErrors.password && <p id="register-password-error" className="text-xs text-red-300" role="alert">{registerErrors.password}</p>}

                      {registerForm.password.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
                            <span>Password strength</span>
                            <span className={passwordStrength.textColor}>{passwordStrength.label}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full transition-all ${
                                passwordStrength.progress >= 75
                                  ? "bg-emerald-400"
                                  : passwordStrength.progress >= 50
                                    ? "bg-amber-400"
                                    : passwordStrength.progress >= 25
                                      ? "bg-red-400"
                                      : "bg-slate-600"
                              }`}
                              style={{ width: `${passwordStrength.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerForm.confirmPassword}
                          onChange={(event) => handleRegisterChange("confirmPassword", event.target.value)}
                          placeholder="Repeat your password"
                          aria-invalid={Boolean(registerErrors.confirmPassword)}
                          aria-describedby={registerErrors.confirmPassword ? "register-confirm-error" : undefined}
                          className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((value) => !value)}
                          className="text-slate-400 transition hover:text-white"
                          aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {registerForm.confirmPassword.length > 0 && (
                        registerErrors.confirmPassword ? (
                          <p id="register-confirm-error" className="text-xs text-red-300" role="alert">{registerErrors.confirmPassword}</p>
                        ) : (
                          <p className={`text-xs ${passwordsMatch ? "text-emerald-300" : "text-red-300"}`}>
                            {passwordsMatch ? "Passwords match." : "Passwords do not match yet."}
                          </p>
                        )
                      )}
                      {registerErrors.confirmPassword && !registerForm.confirmPassword && <p id="register-confirm-error" className="text-xs text-red-300" role="alert">{registerErrors.confirmPassword}</p>}
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={registerForm.agreeToTerms}
                        onChange={(event) => handleRegisterChange("agreeToTerms", event.target.checked)}
                        aria-invalid={Boolean(registerErrors.agreeToTerms)}
                        aria-describedby={registerErrors.agreeToTerms ? "register-terms-error" : undefined}
                        className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>
                        I agree to the <span className="font-medium text-emerald-300">Terms & Conditions</span> and privacy policy.
                      </span>
                    </label>
                    {registerErrors.agreeToTerms && <p id="register-terms-error" className="text-xs text-red-300" role="alert">{registerErrors.agreeToTerms}</p>}

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Create Student Account
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    {formNotice && <p className="text-center text-xs leading-5 text-emerald-300" role="status">{formNotice}</p>}
                  </form>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
