"use client";

import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { QuoteBreadcrumb } from "@/components/quotes/QuoteBreadcrumb";
import {
  QuoteBottomCta,
  QuoteHowItWorksSection,
  QuoteTestimonialsSection,
  QuoteWhyCompareSection,
} from "@/components/quotes/QuoteLandingSections";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Headphones,
  MessageCircle,
  MessageSquare,
  Monitor,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { QuoteFormScrollBody } from "@/components/quotes/QuoteFormScrollBody";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

const HOW_STEPS = [
  { tag: "3 min", num: "01", title: "Quantify workloads", body: "Agents, incumbent telephony, and monthly volume anchors realistic seat + consumption pricing." },
  { tag: "~24h", num: "02", title: "Matched vendors respond", body: "Proposals cite platforms from Compare Bazaar testing, SMB through AI-heavy enterprise suites." },
  { tag: "Pilot", num: "03", title: "Compare & negotiate", body: "IVR depth, QA, integrations, omnichannel parity, weighed side-by-side." },
];

const VENDORS = [
  { name: "GoTo", dot: "#6D4AFF" },
  { name: "RingCentral", dot: "#FF8800" },
  { name: "GoAnswer", dot: "#0EA5E9" },
  { name: "Twilio", dot: "#F22F46" },
  { name: "Salesforce", dot: "#00A1E0" },
  { name: "Talkdesk", dot: "#4F46E5" },
];

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  employeeCount: string;
  agentCount: string;
  currentSystem: string;
  monthlyCallVolume: string;
  industry: string;
  importantFeatures: string[];
  emailUpdates: boolean;
}

const EMPLOYEE_OPTIONS = ["1 - 10", "11 - 50", "51 - 200", "201 - 500", "500+"];
const AGENT_COUNTS = [
  { value: "1 - 5", label: "1 - 5 agents" },
  { value: "6 - 10", label: "6 - 10 agents" },
  { value: "11 - 25", label: "11 - 25 agents" },
  { value: "26 - 50", label: "26 - 50 agents" },
  { value: "50+", label: "50+ agents" },
];
const CURRENT_SYSTEM = [
  "No system currently",
  "Using basic phone system",
  "Have call center software but want to switch",
  "Looking to upgrade current system",
];
const MONTHLY_VOLUME = [
  { value: "0 - 500 calls", label: "0 - 500 calls/month" },
  { value: "501 - 1,000 calls", label: "501 - 1,000 calls/month" },
  { value: "1,001 - 5,000 calls", label: "1,001 - 5,000 calls/month" },
  { value: "5,001 - 10,000 calls", label: "5,001 - 10,000 calls/month" },
  { value: "10,000+ calls", label: "10,000+ calls/month" },
];
const INDUSTRIES = [
  "Customer Service",
  "Sales",
  "Healthcare",
  "Finance",
  "Technology",
  "Retail",
  "Other",
];

const FEATURE_ITEMS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "ivr", label: "IVR & Call Routing", icon: Phone },
  { id: "recording", label: "Call Recording & Monitoring", icon: Monitor },
  { id: "analytics", label: "Real-time Analytics", icon: BarChart3 },
  { id: "omnichannel", label: "Omnichannel Support", icon: MessageSquare },
  { id: "workforce", label: "Workforce Management", icon: Users },
  { id: "integrations", label: "CRM & Integrations", icon: Activity },
];

const TESTIMONIALS = [
  {
    name: "Priya Shah",
    role: "CX Director",
    company: "LumenCare Health",
    result: "RingCentral vs Genesys clarity in days",
    body: "Agent counts plus monthly volume narrowed AI QA stacks vs budget SMB tiers without vendor noise.",
    initials: "PS",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Devon Reyes",
    role: "Operations",
    company: "CopperPeak Retail",
    result: "Omnichannel pilot scoped correctly",
    body: "We flagged upgrade path from basic phones, and responders quoted Talkdesk-esque depth only where warranted.",
    initials: "DR",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Kate Liang",
    role: "IT Lead",
    company: "Horizon SaaS Support",
    result: "API-first Twilio option alongside turnkey CC",
    body: "Engineering-led roadmap needed programmable voice, comparisons surfaced both build and buy bundles.",
    initials: "KL",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Headphones,
    title: "Channel-aware routing",
    body: "Agent totals + volume tiers steer proposals toward SMB ease, inbound-heavy CC, or API-first builds.",
  },
  {
    icon: ShieldCheck,
    title: "Same brands we test",
    body: "Editorial roster includes GoTo, RingCentral, GoAnswer, Twilio, Salesforce Service Cloud, Talkdesk, Genesys, Freshdesk.",
  },
  {
    icon: Zap,
    title: "Faster procurement",
    body: "One structured brief replaces duplicated vendor screening calls.",
  },
  {
    icon: MessageCircle,
    title: "Guidance when unclear",
    body: "Inbound vs outsourced vs omnichannel expansions decoded before you demo.",
  },
];

const emptyForm = (): FormData => ({
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phoneNumber: "",
  zipCode: "",
  employeeCount: "",
  agentCount: "",
  currentSystem: "",
  monthlyCallVolume: "",
  industry: "",
  importantFeatures: [],
  emailUpdates: false,
});

type QuoteFormClientProps = { heading: string }

export default function CallCenterGetQuotesPage({ heading }: QuoteFormClientProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captchaRef = useRef<ReCAPTCHA | null>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const web3formsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
  const canSubmitWithConfig = Boolean(recaptchaSiteKey && web3formsAccessKey);

  const setField = (k: keyof FormData, v: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [k]: v as never }));

  const clearErr = (key: string) =>
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });

  const toggleFeat = (id: string) =>
    setForm((f) => ({
      ...f,
      importantFeatures: f.importantFeatures.includes(id)
        ? f.importantFeatures.filter((x) => x !== id)
        : [...f.importantFeatures, id],
    }));

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Please complete this required field.";
    if (!form.lastName.trim()) e.lastName = "Please complete this required field.";
    if (!form.companyName.trim()) e.companyName = "Please complete this required field.";
    if (!form.email.trim()) e.email = "Please complete this required field.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Please complete this required field.";
    if (!form.zipCode.trim()) e.zipCode = "Please complete this required field.";
    else if (!/^\d{5}$/.test(form.zipCode)) e.zipCode = "Please enter a valid 5-digit zip code.";
    setErrors((prev) => {
      const next = { ...prev };
      ["firstName", "lastName", "companyName", "email", "phoneNumber", "zipCode"].forEach((k) => delete next[k]);
      return { ...next, ...e };
    });
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const er: Record<string, string> = {};
    if (!form.employeeCount) er.employeeCount = "Please complete this required field.";
    if (!form.agentCount) er.agentCount = "Please complete this required field.";
    if (!form.currentSystem) er.currentSystem = "Please complete this required field.";
    if (!form.monthlyCallVolume) er.monthlyCallVolume = "Please complete this required field.";
    if (!form.industry) er.industry = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["employeeCount", "agentCount", "currentSystem", "monthlyCallVolume", "industry"].forEach((k) => delete next[k]);
      return { ...next, ...er };
    });
    return Object.keys(er).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting || !canSubmitWithConfig) {
      if (!canSubmitWithConfig) setSubmitError("Form setup is incomplete. Please contact support.");
      return;
    }
    if (!captchaToken) {
      setSubmitError("Please complete reCAPTCHA before submitting.");
      setErrors((prev) => ({ ...prev, captcha: "Please verify that you're not a robot." }));
      return;
    }
    setSubmitError("");
    setErrors((prev) => {
      const n = { ...prev };
      delete n.captcha;
      return n;
    });

    setIsSubmitting(true);
    try {
      const payload = {
        access_key: web3formsAccessKey,
        subject: "Call Center Management Software Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        employee_count: form.employeeCount,
        agent_count: form.agentCount,
        current_system: form.currentSystem,
        monthly_call_volume: form.monthlyCallVolume,
        important_features: form.importantFeatures.join(", "),
        industry: form.industry,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "Call Center Management Software - Get Quotes (Compare-Bazaar)",
        captcha_token: captchaToken,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) throw new Error(result?.message || "Submission failed");
      setSubmitted(true);
      setForm(emptyForm());
      setCaptchaToken("");
      captchaRef.current?.reset();
      setErrors({});
    } catch (err) {
      console.error("Call center quote submit failed:", err);
      setSubmitError("Could not submit right now. Please try again.");
      setCaptchaToken("");
      captchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const stepLabel = step === 1 ? "Your contact details" : step === 2 ? "Contact center profile" : "Features & submit";

  return (
    <>

      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />

      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sales", href: "/sales" },
          { label: "Best Call Center Software", href: "/sales/best-call-center-management-software" },
          { label: "Get Free Quotes" },
        ]}
      />

      <div className="hero-shell">
        <div className="hero">
          <div className="ct">
            <div className="hg">
              <div>
                <div className="eyebrow">
                  <span className="edot" />
                  Contact center quotes
                </div>
                <h1>{heading}</h1>
                <p className="hdesc">
                  Capture org size, live agent counts, incumbent stack, and call volume bands once, then receive proposals
                  aligned with GoTo, RingCentral, Twilio, Salesforce, Talkdesk, Freshdesk CC, and the rest of our tested
                  roster.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes · no obligation",
                    "SMB through enterprise CX",
                    "Independent methodology",
                    "Fast routing",
                  ].map((t) => (
                    <li key={t} className="trust-li">
                      <span className="chk">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="stats">
                  {[
                    { n: "9+", l: "Platforms Tested" },
                    { n: "IVR+", l: "Omnichannel mixes" },
                    { n: "AI QA", l: "Enterprise depth" },
                    { n: "4.4★", l: "Inbound pick (RingCentral)" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Featured vendors from our call center comparison</div>
                  <div className="vpills">
                    {VENDORS.map((v) => (
                      <div key={v.name} className="vp">
                        <span className="vdot" style={{ background: v.dot }} />
                        {v.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="fc">
                  {submitted ? (
                    <div className="succ">
                      <div className="succ-icon">
                        <CheckCircle2 aria-hidden />
                      </div>
                      <h3>Request received!</h3>
                      <p>
                        CC specialists are aligning vendors to your queues. Expect comparative quotes within{" "}
                        <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We ingest agent totals, incumbent stack, and channel goals",
                          "You receive bundles sized to realistic seat + usage models",
                          "Pilot only finalists you nominate",
                        ].map((s, i) => (
                          <li key={i} className="ss">
                            <span className="ssn">{i + 1}</span>
                            <span className="sst">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <>
                      <div className="fh">
                        <div className="fh-top">
                          <h2>Get Free CC Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>Contact center stacks matched quickly</p>
                        <div className="pbar">
                          {[1, 2, 3].map((s) => (
                            <div key={s} className={`pseg ${s < step ? "done" : s === step ? "active" : ""}`} />
                          ))}
                        </div>
                        <div className="step-dots" aria-hidden>
                          {[1, 2, 3].map((s) => (
                            <span key={s} className={`sdot ${s === step ? "on" : ""} ${s < step ? "done" : ""}`} />
                          ))}
                        </div>
                        <div className="plabel">
                          Step <b>{step} of 3</b>: {stepLabel}
                        </div>
                      </div>

                      <QuoteFormScrollBody step={step}>
                        {step === 1 && (
                          <>
                            <div className="fr">
                              <div>
                                <label>
                                  First Name<span className="req">*</span>
                                </label>
                                <input
                                  value={form.firstName}
                                  className={errors.firstName ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("firstName", e.target.value);
                                    clearErr("firstName");
                                  }}
                                  placeholder="Priya"
                                />
                                {errors.firstName ? <p className="field-err">{errors.firstName}</p> : null}
                              </div>
                              <div>
                                <label>
                                  Last Name<span className="req">*</span>
                                </label>
                                <input
                                  value={form.lastName}
                                  className={errors.lastName ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("lastName", e.target.value);
                                    clearErr("lastName");
                                  }}
                                  placeholder="Shah"
                                />
                                {errors.lastName ? <p className="field-err">{errors.lastName}</p> : null}
                              </div>
                            </div>
                            <div className="ff">
                              <label>
                                Business Email<span className="req">*</span>
                              </label>
                              <input
                                type="email"
                                value={form.email}
                                className={errors.email ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("email", e.target.value);
                                  clearErr("email");
                                }}
                                placeholder="you@company.com"
                              />
                              {errors.email ? <p className="field-err">{errors.email}</p> : null}
                              <p className="hint">Marketing emails from compare-bazaar.com may follow this address.</p>
                            </div>
                            <div className="ff">
                              <label>
                                Company<span className="req">*</span>
                              </label>
                              <input
                                value={form.companyName}
                                className={errors.companyName ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("companyName", e.target.value);
                                  clearErr("companyName");
                                }}
                                placeholder="LumenCare"
                              />
                              {errors.companyName ? <p className="field-err">{errors.companyName}</p> : null}
                            </div>
                            <div className="fr">
                              <div>
                                <label>
                                  Phone<span className="req">*</span>
                                </label>
                                <input
                                  type="tel"
                                  value={form.phoneNumber}
                                  className={errors.phoneNumber ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("phoneNumber", e.target.value);
                                    clearErr("phoneNumber");
                                  }}
                                  placeholder="+1 555 000 0000"
                                />
                                {errors.phoneNumber ? <p className="field-err">{errors.phoneNumber}</p> : null}
                              </div>
                              <div>
                                <label>
                                  ZIP<span className="req">*</span>
                                </label>
                                <input
                                  value={form.zipCode}
                                  className={errors.zipCode ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("zipCode", e.target.value);
                                    clearErr("zipCode");
                                  }}
                                  placeholder="10001"
                                />
                                {errors.zipCode ? <p className="field-err">{errors.zipCode}</p> : null}
                              </div>
                            </div>
                            <button type="button" className="btnp" onClick={() => validateStep1() && setStep(2)}>
                              Continue to Step 2 →
                            </button>
                            <div className="ftrust">
                              <span className="tbadge">
                                <Shield className="tb-ico" aria-hidden />
                                SSL Encrypted
                              </span>
                              <span className="tbadge">
                                <Sparkles className="tb-ico" aria-hidden />
                                No spam
                              </span>
                            </div>
                          </>
                        )}

                        {step === 2 && (
                          <>
                            <div className="fr">
                              <div>
                                <label>
                                  Company Employees<span className="req">*</span>
                                </label>
                                <select
                                  value={form.employeeCount}
                                  className={errors.employeeCount ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("employeeCount", e.target.value);
                                    clearErr("employeeCount");
                                  }}
                                >
                                  <option value="">Select number of employees</option>
                                  {EMPLOYEE_OPTIONS.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.employeeCount ? <p className="field-err">{errors.employeeCount}</p> : null}
                              </div>
                              <div>
                                <label>
                                  Agents<span className="req">*</span>
                                </label>
                                <select
                                  value={form.agentCount}
                                  className={errors.agentCount ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("agentCount", e.target.value);
                                    clearErr("agentCount");
                                  }}
                                >
                                  <option value="">Select number of agents</option>
                                  {AGENT_COUNTS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                                {errors.agentCount ? <p className="field-err">{errors.agentCount}</p> : null}
                              </div>
                            </div>
                            <div className="ff">
                              <label>
                                Current Stack<span className="req">*</span>
                              </label>
                              <select
                                value={form.currentSystem}
                                className={errors.currentSystem ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("currentSystem", e.target.value);
                                  clearErr("currentSystem");
                                }}
                              >
                                <option value="">Select option</option>
                                {CURRENT_SYSTEM.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.currentSystem ? <p className="field-err">{errors.currentSystem}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Monthly Call Volume<span className="req">*</span>
                              </label>
                              <select
                                value={form.monthlyCallVolume}
                                className={errors.monthlyCallVolume ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("monthlyCallVolume", e.target.value);
                                  clearErr("monthlyCallVolume");
                                }}
                              >
                                <option value="">Select range</option>
                                {MONTHLY_VOLUME.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                              {errors.monthlyCallVolume ? <p className="field-err">{errors.monthlyCallVolume}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Industry Focus<span className="req">*</span>
                              </label>
                              <select
                                value={form.industry}
                                className={errors.industry ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("industry", e.target.value);
                                  clearErr("industry");
                                }}
                              >
                                <option value="">Select your industry</option>
                                {INDUSTRIES.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.industry ? <p className="field-err">{errors.industry}</p> : null}
                            </div>
                            <button type="button" className="btnp" onClick={() => validateStep2() && setStep(3)}>
                              Continue to Step 3 →
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(1)}>
                              ← Back to Step 1
                            </button>
                          </>
                        )}

                        {step === 3 && (
                          <>
                            <div className="ff">
                              <label>
                                Feature priorities{" "}
                                <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(optional)</span>
                              </label>
                              <div className="cgrid">
                                {FEATURE_ITEMS.map((f) => {
                                  const Icon = f.icon;
                                  const sel = form.importantFeatures.includes(f.id);
                                  return (
                                    <div
                                      key={f.id}
                                      role="button"
                                      tabIndex={0}
                                      className={`chip ${sel ? "sel" : ""}`}
                                      onClick={() => toggleFeat(f.id)}
                                      onKeyDown={(ev) => {
                                        if (ev.key === "Enter" || ev.key === " ") {
                                          ev.preventDefault();
                                          toggleFeat(f.id);
                                        }
                                      }}
                                    >
                                      <span className="cchk">{sel ? "✓" : ""}</span>
                                      <Icon className="fico" aria-hidden />
                                      {f.label}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <label className="chk-row">
                              <input
                                type="checkbox"
                                checked={form.emailUpdates}
                                onChange={(e) => setField("emailUpdates", e.target.checked)}
                              />
                              <span>CX tooling updates from Compare Bazaar (optional).</span>
                            </label>
                            <div className="cap-wrap">
                              {mounted && <ReCAPTCHA
                                ref={captchaRef}
                                sitekey={recaptchaSiteKey}
                                onChange={(token) => {
                                  setCaptchaToken(token || "");
                                  if (token) {
                                    setSubmitError("");
                                    clearErr("captcha");
                                  }
                                }}
                                onExpired={() => setCaptchaToken("")}
                              />}
                            </div>
                            {!canSubmitWithConfig ? (
                              <p className="cap-err">Form setup is incomplete. Please contact support.</p>
                            ) : null}
                            {errors.captcha ? <p className="cap-err">{errors.captcha}</p> : null}
                            {submitError ? <p className="cap-err">{submitError}</p> : null}
                            <button
                              type="button"
                              className="btnp"
                              disabled={isSubmitting || !canSubmitWithConfig}
                              onClick={handleFinalSubmit}
                            >
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My Call Center Quotes"}
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(2)}>
                              ← Back to Step 2
                            </button>
                            <p className="consent">
                              By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and{" "}
                              <a href="/privacy-policy">Privacy Policy</a>.
                            </p>
                          </>
                        )}
                      </QuoteFormScrollBody>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuoteHowItWorksSection
        tag="How It Works"
        title="Contact center sourcing in three steps"
        subtitle="Operations truth → scoped vendors → demos with finalists only."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams that stabilized CX procurements"
        subtitle="Support leaders comparing turnkey CCaaS versus programmable stacks."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="CX tech without vendor bingo"
        subtitle="Editorially scored platforms, placements follow fit, not sponsorship."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Need call center vendor quotes?"
        subtitle="Jump to the sticky form, we’ll mirror the stacks we already benchmarked."
      />
    </>
  );
}