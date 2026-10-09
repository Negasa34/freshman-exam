
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import "./AuthPage.css";

const universities = [
  "Ambo University",
  "Addis Ababa University (AAU)",
  "Jimma University",
  "Hawassa University",
  "Adama Science and Technology University (ASTU)",
];

function passwordStrength(password) {
  return [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}

function FieldError({ id, children }) {
  return children ? (
    <span className="auth-field-error" id={id} role="alert">
      {children}
    </span>
  ) : null;
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete = "new-password",
}) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>

      <div className={`auth-input-wrap ${error ? "has-error" : ""}`}>
        <LockKeyhole aria-hidden="true" size={16} />

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder="At least 8 characters"
        />

        <button
          className="password-visibility"
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff aria-hidden="true" size={16} />
          ) : (
            <Eye aria-hidden="true" size={16} />
          )}
        </button>
      </div>

      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

function AuthField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}) {
  const errorId = `${id}-error`;

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>

      <div className={`auth-input-wrap ${error ? "has-error" : ""}`}>
        {Icon && <Icon aria-hidden="true" size={16} />}

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export default function AuthPage({ onBrowseArchive, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");

  const [login, setLogin] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const [registration, setRegistration] = useState({
    name: "",
    email: "",
    university: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  const updateLogin = (field) => (event) => {
    const value =
      field === "remember"
        ? event.target.checked
        : event.target.value;

    setLogin((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setNotice("");
  };

  const updateRegistration = (field) => (event) => {
    const value =
      field === "terms"
        ? event.target.checked
        : event.target.value;

    setRegistration((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setNotice("");
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setNotice("");
  };

  const submitLogin = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!login.identifier.trim()) {
      nextErrors.identifier = "Enter your email.";
    }

    if (!login.password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice("");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: login.identifier.trim(),
            password: login.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setNotice(data.message || "Login failed.");
        return;
      }

      /*
       * Remember me:
       * - checked   -> localStorage
       * - unchecked -> sessionStorage
       */
      if (login.remember) {
        localStorage.setItem("freshman_token", data.token);
        localStorage.setItem(
          "freshman_user",
          JSON.stringify(data.user)
        );

        sessionStorage.removeItem("freshman_token");
        sessionStorage.removeItem("freshman_user");
      } else {
        sessionStorage.setItem("freshman_token", data.token);
        sessionStorage.setItem(
          "freshman_user",
          JSON.stringify(data.user)
        );

        localStorage.removeItem("freshman_token");
        localStorage.removeItem("freshman_user");
      }

      setNotice(`Welcome back, ${data.user.name}!`);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);

      setNotice(
        "Cannot connect to the backend server. Make sure the backend is running."
      );
    }
  };

  const submitRegistration = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (registration.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        registration.email.trim()
      )
    ) {
      nextErrors.email = "Enter a valid student email.";
    }

    if (!registration.university) {
      nextErrors.university = "Select your target university.";
    }

    if (registration.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (
      !registration.confirmPassword ||
      registration.confirmPassword !== registration.password
    ) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    if (!registration.terms) {
      nextErrors.terms = "Agree to the terms to continue.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice("");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registration.name.trim(),
            email: registration.email.trim(),
            password: registration.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setNotice(data.message || "Registration failed.");
        return;
      }

      setNotice(
        "Account created successfully. You can now sign in."
      );

      setRegistration({
        name: "",
        email: "",
        university: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });

      setErrors({});
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);

      setNotice(
        "Cannot connect to the backend server. Make sure the backend is running."
      );
    }
  };

  const requestPasswordReset = () => {
    if (!login.identifier.trim()) {
      setErrors((current) => ({
        ...current,
        identifier:
          "Enter your email address to request a reset.",
      }));

      setNotice("");

      document
        .getElementById("login-identifier")
        ?.focus();

      return;
    }

    setNotice(
      "Password reset is not connected yet. We will add it later."
    );
  };

  const strength = passwordStrength(
    registration.password
  );

  return (
    <main className="auth-screen">
      <section
        className="auth-story"
        aria-label="Student inspiration"
      >
        <div className="story-photo" />
        <div className="story-overlay" />

        <a
          className="auth-wordmark"
          href="#auth-top"
          aria-label="Freshman Exams ET home"
        >
          <span className="auth-logo">
            <GraduationCap
              aria-hidden="true"
              size={21}
            />
          </span>

          <span>
            freshman
            <span className="auth-brand-dot">.</span>
            <small>EXAMS ET</small>
          </span>
        </a>

        <div className="story-edition">
          <span />
          THE STUDENT ARCHIVE{" "}
          <span className="story-edition-year">
            · ETHIOPIA
          </span>
        </div>

        <div className="story-quote">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>

          <p>
            Your next big idea
            <br />
            starts with <em>one more page.</em>
          </p>

          <span className="quote-credit">
            A NOTE TO THE CURIOUS
          </span>
        </div>

        <div className="story-footnote">
          <ShieldCheck
            aria-hidden="true"
            size={15}
          />
          A shared place to prepare, grow, and go further.
        </div>
      </section>

      <section className="auth-main" id="auth-top">
        <div className="auth-topbar">
          <span className="auth-topbar-note">
            <span /> YOUR FRESHMAN JOURNEY
          </span>

          <button
            className="archive-shortcut"
            type="button"
            onClick={onBrowseArchive}
          >
            <ArrowLeft
              aria-hidden="true"
              size={14}
            />
            Browse archive
          </button>
        </div>

        <div className="auth-content">
          <div className="auth-heading">
            <div className="auth-overline">
              <span /> READY WHEN YOU ARE
            </div>

            <h1>
              {activeTab === "login" ? (
                <>
                  Good to see
                  <br />
                  you <em>again.</em>
                </>
              ) : (
                <>
                  Make room for
                  <br />
                  <em>what's next.</em>
                </>
              )}
            </h1>

            <p>
              {activeTab === "login"
                ? "Sign in to pick up where your studies left off."
                : "Create your student account and find your university's past papers."}
            </p>
          </div>

          <div
            className="auth-tabs"
            role="tablist"
            aria-label="Account access"
          >
            <button
              id="login-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === "login"}
              aria-controls="auth-panel"
              className={
                activeTab === "login"
                  ? "is-active"
                  : ""
              }
              onClick={() => switchTab("login")}
            >
              Sign in
            </button>

            <button
              id="register-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === "register"}
              aria-controls="auth-panel"
              className={
                activeTab === "register"
                  ? "is-active"
                  : ""
              }
              onClick={() => switchTab("register")}
            >
              Create student account
            </button>
          </div>

          <div
            id="auth-panel"
            role="tabpanel"
            aria-labelledby={
              activeTab === "login"
                ? "login-tab"
                : "register-tab"
            }
            key={activeTab}
            className="auth-panel"
          >
            {notice && (
              <div
                className="auth-notice"
                role="status"
              >
                <ShieldCheck
                  aria-hidden="true"
                  size={16}
                />
                {notice}
              </div>
            )}

            {activeTab === "login" ? (
              <form
                className="auth-form"
                noValidate
                onSubmit={submitLogin}
              >
                <AuthField
                  id="login-identifier"
                  label="Email"
                  icon={Mail}
                  value={login.identifier}
                  onChange={updateLogin("identifier")}
                  error={errors.identifier}
                  placeholder="you@university.edu.et"
                  autoComplete="username"
                />

                <PasswordInput
                  id="login-password"
                  label="Password"
                  value={login.password}
                  onChange={updateLogin("password")}
                  error={errors.password}
                  autoComplete="current-password"
                />

                <div className="login-options">
                  <label className="auth-checkbox">
                    <input
                      type="checkbox"
                      checked={login.remember}
                      onChange={updateLogin("remember")}
                    />

                    <span className="checkbox-ui">
                      <Check
                        aria-hidden="true"
                        size={12}
                      />
                    </span>

                    Remember me
                  </label>

                  <button
                    className="text-action"
                    type="button"
                    onClick={requestPasswordReset}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  className="auth-submit"
                  type="submit"
                >
                  Sign in
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                  />
                </button>

                <div className="auth-separator">
                  <span />
                  OR CONTINUE WITH
                  <span />
                </div>

                <button
                  className="google-button"
                  type="button"
                  onClick={() =>
                    setNotice(
                      "Google sign-in requires a configured OAuth provider."
                    )
                  }
                >
                  <span className="google-g">
                    G
                  </span>
                  Continue with Google
                </button>
              </form>
            ) : (
              <form
                className="auth-form registration-form"
                noValidate
                onSubmit={submitRegistration}
              >
                <AuthField
                  id="student-name"
                  label="Full name"
                  icon={UserRound}
                  value={registration.name}
                  onChange={updateRegistration("name")}
                  error={errors.name}
                  placeholder="Your name as it appears at school"
                  autoComplete="name"
                />

                <AuthField
                  id="student-email"
                  label="Student email"
                  icon={Mail}
                  type="email"
                  value={registration.email}
                  onChange={updateRegistration("email")}
                  error={errors.email}
                  placeholder="you@university.edu.et"
                  autoComplete="email"
                />

                <div className="auth-field">
                  <label htmlFor="student-university">
                    Target university
                  </label>

                  <div
                    className={`auth-input-wrap select-wrap ${
                      errors.university
                        ? "has-error"
                        : ""
                    }`}
                  >
                    <GraduationCap
                      aria-hidden="true"
                      size={16}
                    />

                    <select
                      id="student-university"
                      value={registration.university}
                      onChange={updateRegistration(
                        "university"
                      )}
                      aria-invalid={Boolean(
                        errors.university
                      )}
                      aria-describedby={
                        errors.university
                          ? "student-university-error"
                          : undefined
                      }
                    >
                      <option value="">
                        Choose your university
                      </option>

                      {universities.map(
                        (university) => (
                          <option
                            key={university}
                            value={university}
                          >
                            {university}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <FieldError id="student-university-error">
                    {errors.university}
                  </FieldError>
                </div>

                <PasswordInput
                  id="student-password"
                  label="Create password"
                  value={registration.password}
                  onChange={updateRegistration("password")}
                  error={errors.password}
                />

                <div
                  className="password-meter"
                  aria-live="polite"
                >
                  <div
                    className="strength-bars"
                    aria-label={`Password strength: ${strength} of 4`}
                  >
                    {[1, 2, 3, 4].map(
                      (segment) => (
                        <span
                          key={segment}
                          className={
                            strength >= segment
                              ? `strength-${strength}`
                              : ""
                          }
                        />
                      )
                    )}
                  </div>

                  <span>
                    {registration.password
                      ? [
                          "Weak",
                          "Fair",
                          "Good",
                          "Strong",
                          "Strong",
                        ][strength]
                      : "Use 8+ characters"}
                  </span>
                </div>

                <PasswordInput
                  id="student-confirm-password"
                  label="Confirm password"
                  value={registration.confirmPassword}
                  onChange={updateRegistration(
                    "confirmPassword"
                  )}
                  error={errors.confirmPassword}
                />

                <label
                  className={`auth-checkbox terms-checkbox ${
                    errors.terms
                      ? "terms-error"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={registration.terms}
                    onChange={updateRegistration("terms")}
                    aria-invalid={Boolean(errors.terms)}
                    aria-describedby={
                      errors.terms
                        ? "terms-error"
                        : undefined
                    }
                  />

                  <span className="checkbox-ui">
                    <Check
                      aria-hidden="true"
                      size={12}
                    />
                  </span>

                  <span>
                    I agree to the{" "}
                    <strong>Terms of Use</strong>{" "}
                    and{" "}
                    <strong>Privacy Policy</strong>.
                  </span>
                </label>

                <FieldError id="terms-error">
                  {errors.terms}
                </FieldError>

                <button
                  className="auth-submit"
                  type="submit"
                >
                  Create account
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                  />
                </button>
              </form>
            )}

            <p className="auth-security-note">
              <ShieldCheck
                aria-hidden="true"
                size={14}
              />
              Your account is securely connected to the
              Freshman Exams backend.
            </p>
          </div>

          <p className="auth-switch-prompt">
            {activeTab === "login"
              ? "New to the archive?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                switchTab(
                  activeTab === "login"
                    ? "register"
                    : "login"
                )
              }
            >
              {activeTab === "login"
                ? "Create an account"
                : "Sign in"}
            </button>
          </p>
        </div>

        <footer className="auth-footer">
          <span>
            FRESHMAN EXAMS ET <i /> STUDENT ARCHIVE
          </span>

          <span>
            ADDIS ABABA · ETHIOPIA
          </span>
        </footer>
      </section>
    </main>
  );
}
