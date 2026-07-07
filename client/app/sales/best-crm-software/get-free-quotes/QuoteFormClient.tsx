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
  BarChart3,
  CheckCircle2,
  Database,
  Globe,
  MessageCircle,
  MessageSquare,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { QuoteFormScrollBody } from "@/components/quotes/QuoteFormScrollBody";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

const HOW_STEPS = [
  { tag: "2 min", num: "01", title: "Capture team + stack", body: "Headcount, CRM posture, and industry anchor fit-based routing." },
  { tag: "24h", num: "02", title: "Align vendors", body: "Responses reference tools from our comparison, Pipedrive, HubSpot, Zoho, Salesforce, etc." },
  { tag: "You choose", num: "03", title: "Compare & pilot", body: "Review proposals in parallel; engage only winners you shortlist." },
];

const VENDORS = [
  { name: "Zoho CRM", dot: "#E62129" },
  { name: "Creatio", dot: "#FB8C00" },
  { name: "HubSpot", dot: "#FF7A59" },
  { name: "HoneyBook", dot: "#7E57C2" },
  { name: "Pipedrive", dot: "#1F5C99" },
  { name: "Salesforce", dot: "#00A1E0" },
];

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  employeeCount: string;
  usingCRM: string;
  industry: string;
  importantFeatures: string[];
  emailUpdates: boolean;
}

const EMPLOYEE_OPTIONS = ["1 - 10", "11 - 50", "51 - 200", "201 - 500", "500+"];
const USING_CRM = [
  "Yes - Looking to switch",
  "Yes - Looking to add features",
  "No - First time user",
];
const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Education",
  "Other",
];

const FEATURE_ITEMS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "sales-automation", label: "Sales Automation & Pipeline", icon: Target },
  { id: "contact-management", label: "Contact & Lead Management", icon: Users },
  { id: "email-integration", label: "Email Integration & Tracking", icon: MessageSquare },
  { id: "reporting", label: "Analytics & Reporting", icon: BarChart3 },
  { id: "mobile-access", label: "Mobile Access & CRM App", icon: Globe },
  { id: "integrations", label: "Third-party Integrations", icon: Database },
];

const TESTIMONIALS = [
  {
    name: "Jordan Blake",
    role: "Sales Director",
    company: "Nimbus SaaS",
    result: "Pipedrive + HubSpot shortlisted same week",
    body: "We stated pipeline maturity and integrations once. Responses referenced the same stacks we saw on Compare Bazaar, fewer junk vendors.",
    initials: "JB",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Anita Deshmukh",
    role: "RevOps Lead",
    company: "Vertex Industrial",
    result: "Cut evaluation cycle ~40%",
    body: "Enterprise Salesforce vs nimble SMB tools was polarizing until quotes framed admin cost honestly.",
    initials: "AD",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Marcus Lowell",
    role: "Founder",
    company: "Coastline Creatives",
    result: "HoneyBook-aligned proposal for creative ops",
    body: "Proposal-to-pay workflows mattered, matched vendors respected that nuance versus generic CRM blasts.",
    initials: "ML",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Sales-motion aware",
    body: "Headcount and CRM familiarity route quotes toward pipeline-heavy, lifecycle, or service-sales stacks.",
  },
  {
    icon: ShieldCheck,
    title: "Editorial roster",
    body: "Pills mirror our sales CRM methodology, Zoho, Creatio, HubSpot, Pipedrive, Salesforce, HoneyBook.",
  },
  {
    icon: Zap,
    title: "~24 hour alignment",
    body: "One structured intake replaces slow cold outreach loops early in procurement.",
  },
  {
    icon: MessageCircle,
    title: "Specialist framing",
    body: "Unclear forecasting vs sequencing needs? Quotes emphasize the right CRM depth.",
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
  usingCRM: "",
  industry: "",
  importantFeatures: [],
  emailUpdates: false,
});

type QuoteFormClientProps = { heading: string }

export default function SalesCRMGetQuotesPage({ heading }: QuoteFormClientProps) {
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
    if (!form.usingCRM) er.usingCRM = "Please complete this required field.";
    if (!form.industry) er.industry = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["employeeCount", "usingCRM", "industry"].forEach((k) => delete next[k]);
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
        subject: "CRM Software Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        employee_count: form.employeeCount,
        using_crm: form.usingCRM,
        important_features: form.importantFeatures.join(", "),
        industry: form.industry,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "CRM Software - Get Quotes (Compare-Bazaar)",
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
      console.error("Sales CRM quote submit failed:", err);
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

  const stepLabel =
    step === 1 ? "Your contact details" : step === 2 ? "Sales context" : "Features & submit";

  return (
    <>

      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />

      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sales", href: "/sales" },
          { label: "Best CRM Software", href: "/sales/best-crm-software" },
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
                  Sales CRM quotes
                </div>
                <h1>{heading}</h1>
                <p className="hdesc">
                  Share headcount, current CRM stance, and must-have capability chips once. Quotes align with the same vendors
                  we review for sales teams, Zoho CRM, HubSpot Sales Hub, Pipedrive, Creatio, Salesforce, HoneyBook, and peers.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes, no obligation",
                    "Pipeline-first vendor routing",
                    "Independent rankings",
                    "Fast turnaround",
                  ].map((t) => (
                    <li key={t} className="trust-li">
                      <span className="chk">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="stats">
                  {[
                    { n: "9+", l: "CRMs Compared" },
                    { n: "24h", l: "Avg. routing" },
                    { n: "Forecasting", l: "SMB → enterprise" },
                    { n: "4.5★", l: "Pipeline pick (Pipedrive)" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Platforms from our sales CRM comparison</div>
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
                        CRM specialists are matching your profile. Expect tailored proposals within{" "}
                        <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We're mapping reps, integrations, and feature picks to shortlisted vendors",
                          "You'll receive comparable quotes to review side-by-side",
                          "Demo only with platforms you elevate",
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
                          <h2>Get Free CRM Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>Three quick steps · Matched CRM vendors</p>
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
                                  placeholder="Sarah"
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
                                  placeholder="Kim"
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
                              <p className="hint">
                                By entering your email, you consent to marketing emails from compare-bazaar.com.
                              </p>
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
                                placeholder="Acme Corp"
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
                                  ZIP Code<span className="req">*</span>
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
                            <div className="ff">
                              <label>
                                Number of Employees<span className="req">*</span>
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
                            <div className="ff">
                              <label>
                                Current CRM situation<span className="req">*</span>
                              </label>
                              <select
                                value={form.usingCRM}
                                className={errors.usingCRM ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("usingCRM", e.target.value);
                                  clearErr("usingCRM");
                                }}
                              >
                                <option value="">Select option</option>
                                {USING_CRM.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.usingCRM ? <p className="field-err">{errors.usingCRM}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Industry<span className="req">*</span>
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
                                Important Features{" "}
                                <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(optional, select any)</span>
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
                              <span>Tips & product updates from Compare Bazaar (optional).</span>
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
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My CRM Quotes"}
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(2)}>
                              ← Back to Step 2
                            </button>
                            <p className="consent">
                              By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and{" "}
                              <a href="/privacy-policy">Privacy Policy</a>. We may share your details with matched CRM vendors.
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
        title="Sales CRM shortlist in three steps"
        subtitle="Context → matched vendors → compare quotes without endless discovery calls."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Rev teams that moved faster"
        subtitle="Pipeline-led orgs comparing forecasting depth vs speed-to-value CRMs."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Buyer-first sales tech"
        subtitle="Editorial testing, not pay-to-rank vendor blasts."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Ready to compare sales CRMs?"
        subtitle="Jump to the form, three steps to aligned vendor quotes."
      />
    </>
  );
}
