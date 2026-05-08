"use client";

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  BarChart3,
  BarChart,
  CheckCircle2,
  MessageCircle,
  Palette,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  employeeCount: string;
  currentEmailService: string;
  subscriberCount: string;
  monthlyCampaigns: string;
  industry: string;
  importantFeatures: string[];
  emailUpdates: boolean;
}

const EMPLOYEE_OPTIONS = ["1 - 10", "11 - 50", "51 - 200", "201 - 500", "500+"];
const CURRENT_ESP_OPTIONS = [
  "Yes - Looking to switch",
  "Yes - Looking for better features",
  "No - First time user",
];
const SUBSCRIBER_RANGES = [
  "0 - 500",
  "501 - 1,000",
  "1,001 - 5,000",
  "5,001 - 10,000",
  "10,001 - 50,000",
  "50,000+",
];
const MONTHLY_CAMPAIGNS = ["1 - 4", "5 - 10", "11 - 20", "20+"];
const INDUSTRIES = [
  "E-commerce",
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Education",
  "Real Estate",
  "Other",
];

const FEATURE_ITEMS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "automation", label: "Email Automation & Workflows", icon: Zap },
  { id: "templates", label: "Email Templates & Design Tools", icon: Palette },
  { id: "analytics", label: "Advanced Analytics & Reporting", icon: BarChart3 },
  { id: "segmentation", label: "Audience Segmentation", icon: Users },
  { id: "a-b-testing", label: "A/B Testing Tools", icon: BarChart },
  { id: "deliverability", label: "High Deliverability Rates", icon: Send },
];

const VENDORS = [
  { name: "Mailchimp", dot: "#FFE01B" },
  { name: "Klaviyo", dot: "#242429" },
  { name: "ActiveCampaign", dot: "#356AE6" },
  { name: "Constant Contact", dot: "#1856BF" },
  { name: "Brevo", dot: "#0B996E" },
  { name: "HubSpot", dot: "#FF7A59" },
];

const TESTIMONIALS = [
  {
    name: "Elena Voss",
    role: "Marketing Director",
    company: "Northwind Goods",
    result: "Cut ESP spend 28% after comparing quotes",
    body: "We outlined list size and automation needs once. Within a day we had four platforms that actually matched deliverability requirements — not random cold outreach.",
    initials: "EV",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Marcus Chen",
    role: "Founder",
    company: "Pulse SaaS",
    result: "Live on Klaviyo in under three weeks",
    body: "I expected spam. Instead the quotes were structured and comparable. The shortlist matched our ecommerce stack and compliance questions.",
    initials: "MC",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Danielle Brooks",
    role: "CRM & Lifecycle Lead",
    company: "UrbanFit Co.",
    result: "Found an ESP that scales past 50k contacts",
    body: "Subscriber growth made pricing unpredictable. The matched vendors understood segmentation and campaign frequency — saved hours of demo scheduling.",
    initials: "DB",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS = [
  {
    icon: Target,
    title: "Matched to list size & cadence",
    body: "We route your profile against platforms that fit subscriber counts, sending volume, and automation depth — not generic bulk lists.",
  },
  {
    icon: ShieldCheck,
    title: "Editorially independent",
    body: "Rankings follow our published methodology. Providers cannot pay for placement in your quote results.",
  },
  {
    icon: Zap,
    title: "Quotes within 24 hours",
    body: "Submit once. Expect several tailored ESP options in your inbox the same business day, with no obligation.",
  },
  {
    icon: MessageCircle,
    title: "Specialist support",
    body: "Unsure about deliverability or integrations? Our team helps interpret quotes at no cost.",
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
  currentEmailService: "",
  subscriberCount: "",
  monthlyCampaigns: "",
  industry: "",
  importantFeatures: [],
  emailUpdates: false,
});

export default function EmailMarketingQuotePage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
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
    const e: Record<string, string> = {};
    if (!form.employeeCount) e.employeeCount = "Please complete this required field.";
    if (!form.currentEmailService) e.currentEmailService = "Please complete this required field.";
    if (!form.subscriberCount) e.subscriberCount = "Please complete this required field.";
    if (!form.monthlyCampaigns) e.monthlyCampaigns = "Please complete this required field.";
    if (!form.industry) e.industry = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["employeeCount", "currentEmailService", "subscriberCount", "monthlyCampaigns", "industry"].forEach(
        (k) => delete next[k],
      );
      return { ...next, ...e };
    });
    return Object.keys(e).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    if (!canSubmitWithConfig) {
      setSubmitError("Form setup is incomplete. Please contact support.");
      return;
    }
    if (!captchaToken) {
      setSubmitError("Please complete reCAPTCHA before submitting.");
      setErrors((prev) => ({ ...prev, captcha: "Please verify that you're not a robot." }));
      return;
    }
    setSubmitError("");
    setErrors((prev) => {
      const next = { ...prev };
      delete next.captcha;
      return next;
    });

    setIsSubmitting(true);
    try {
      const payload = {
        access_key: web3formsAccessKey,
        subject: "Email Marketing Service Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        employee_count: form.employeeCount,
        current_email_service: form.currentEmailService,
        subscriber_count: form.subscriberCount,
        monthly_campaigns: form.monthlyCampaigns,
        important_features: form.importantFeatures.join(", "),
        industry: form.industry,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "Email Marketing - Get Quotes (Compare-Bazaar)",
        captcha_token: captchaToken,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Submission failed");
      }
      setSubmitted(true);
      setForm(emptyForm());
      setCaptchaToken("");
      captchaRef.current?.reset();
      setErrors({});
    } catch (err) {
      console.error("Email marketing quote submit failed:", err);
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

  if (!mounted) return null;

  const stepLabel =
    step === 1 ? "Your contact details" : step === 2 ? "Your email marketing context" : "Features & preferences";

  return (
    <>
      <Head>
        <title>Get Email Marketing Quotes | Compare Bazaar</title>
        <meta
          name="description"
          content="Describe list size, campaigns, and must-have ESP features once. Receive matched free quotes from leading email marketing platforms within 24 hours."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.compare-bazaar.com/marketing/best-email-marketing-services/get-free-quotes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />

      <div className="bc">
        <div className="ct">
          <div className="bc-row">
            <a href="https://www.compare-bazaar.com">Home</a>
            <span className="bc-sep">›</span>
            <a href="https://www.compare-bazaar.com/marketing">Marketing</a>
            <span className="bc-sep">›</span>
            <a href="https://www.compare-bazaar.com/marketing/best-email-marketing-services">Best Email Marketing Services</a>
            <span className="bc-sep">›</span>
            <span className="bc-cur">Get Free Quotes</span>
          </div>
        </div>
      </div>

      <div className="hero-shell">
        <div className="hero">
          <div className="ct">
            <div className="hg">
              <div>
                <div className="eyebrow">
                  <span className="edot" />
                  Email marketing quotes
                </div>
                <h1>
                  Compare Email Marketing Quotes
                  <br />
                  <span className="acc">Matched to Your Audiences</span>
                </h1>
                <p className="hdesc">
                  Share list size, sending cadence, and automation needs once. Within 24 hours we match you with platforms
                  that fit deliverability, templates, and pricing — free and no obligation.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes — no credit card",
                    "Matched options within 24 hours",
                    "30+ ESPs & suites in our network",
                    "Independent recommendations",
                  ].map((t) => (
                    <li key={t} className="trust-li">
                      <span className="chk">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="stats">
                  {[
                    { n: "2,500+", l: "Businesses Matched" },
                    { n: "24h", l: "Avg. Quote Delivery" },
                    { n: "30+", l: "ESP Vendors" },
                    { n: "4.9 / 5", l: "Avg. User Rating" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Quotes sourced from leading email platforms</div>
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
                        Our team is reviewing your profile. Expect tailored email marketing quotes in your inbox within{" "}
                        <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We're matching your list size, cadence, and feature picks to suitable ESPs",
                          "You'll receive several comparable quotes you can review side-by-side",
                          "Request demos only from vendors you like — no pressure",
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
                          <h2>Get Free Email Marketing Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>Several matched quotes delivered within 24 hours</p>
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
                          Step <b>{step} of 3</b> — {stepLabel}
                        </div>
                      </div>

                      <div className="fb">
                        {step === 1 && (
                          <>
                            <div className="fr">
                              <div>
                                <label>
                                  First Name<span className="req">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="John"
                                  value={form.firstName}
                                  className={errors.firstName ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("firstName", e.target.value);
                                    clearErr("firstName");
                                  }}
                                />
                                {errors.firstName ? <p className="field-err">{errors.firstName}</p> : null}
                              </div>
                              <div>
                                <label>
                                  Last Name<span className="req">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Doe"
                                  value={form.lastName}
                                  className={errors.lastName ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("lastName", e.target.value);
                                    clearErr("lastName");
                                  }}
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
                                placeholder="you@company.com"
                                value={form.email}
                                className={errors.email ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("email", e.target.value);
                                  clearErr("email");
                                }}
                              />
                              {errors.email ? <p className="field-err">{errors.email}</p> : null}
                              <p className="hint">
                                By entering your email, you consent to receive marketing emails from compare-bazaar.com.
                              </p>
                            </div>
                            <div className="ff">
                              <label>
                                Company Name<span className="req">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Acme Corp"
                                value={form.companyName}
                                className={errors.companyName ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("companyName", e.target.value);
                                  clearErr("companyName");
                                }}
                              />
                              {errors.companyName ? <p className="field-err">{errors.companyName}</p> : null}
                            </div>
                            <div className="fr">
                              <div>
                                <label>
                                  Phone Number<span className="req">*</span>
                                </label>
                                <input
                                  type="tel"
                                  placeholder="+1 555 000 0000"
                                  value={form.phoneNumber}
                                  className={errors.phoneNumber ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("phoneNumber", e.target.value);
                                    clearErr("phoneNumber");
                                  }}
                                />
                                {errors.phoneNumber ? <p className="field-err">{errors.phoneNumber}</p> : null}
                              </div>
                              <div>
                                <label>
                                  ZIP Code<span className="req">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="10001"
                                  value={form.zipCode}
                                  className={errors.zipCode ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("zipCode", e.target.value);
                                    clearErr("zipCode");
                                  }}
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
                                Currently using email marketing?<span className="req">*</span>
                              </label>
                              <select
                                value={form.currentEmailService}
                                className={errors.currentEmailService ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("currentEmailService", e.target.value);
                                  clearErr("currentEmailService");
                                }}
                              >
                                <option value="">Select option</option>
                                {CURRENT_ESP_OPTIONS.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.currentEmailService ? (
                                <p className="field-err">{errors.currentEmailService}</p>
                              ) : null}
                            </div>
                            <div className="fr">
                              <div>
                                <label>
                                  Subscriber Count<span className="req">*</span>
                                </label>
                                <select
                                  value={form.subscriberCount}
                                  className={errors.subscriberCount ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("subscriberCount", e.target.value);
                                    clearErr("subscriberCount");
                                  }}
                                >
                                  <option value="">Select range</option>
                                  {SUBSCRIBER_RANGES.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.subscriberCount ? <p className="field-err">{errors.subscriberCount}</p> : null}
                              </div>
                              <div>
                                <label>
                                  Monthly Campaigns<span className="req">*</span>
                                </label>
                                <select
                                  value={form.monthlyCampaigns}
                                  className={errors.monthlyCampaigns ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("monthlyCampaigns", e.target.value);
                                    clearErr("monthlyCampaigns");
                                  }}
                                >
                                  <option value="">Select frequency</option>
                                  {MONTHLY_CAMPAIGNS.map((o) => (
                                    <option key={o} value={o}>
                                      {o === "1 - 4"
                                        ? "1 - 4 campaigns/month"
                                        : o === "5 - 10"
                                          ? "5 - 10 campaigns/month"
                                          : o === "11 - 20"
                                            ? "11 - 20 campaigns/month"
                                            : "20+ campaigns/month"}
                                    </option>
                                  ))}
                                </select>
                                {errors.monthlyCampaigns ? <p className="field-err">{errors.monthlyCampaigns}</p> : null}
                              </div>
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
                                Important features{" "}
                                <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>— select all that apply</span>
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
                              <span>Send me product updates and tips from Compare Bazaar (optional).</span>
                            </label>
                            <div className="cap-wrap">
                              <ReCAPTCHA
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
                              />
                            </div>
                            {!canSubmitWithConfig ? <p className="cap-err">Form setup is incomplete. Please contact support.</p> : null}
                            {errors.captcha ? <p className="cap-err">{errors.captcha}</p> : null}
                            {submitError ? <p className="cap-err">{submitError}</p> : null}
                            <button
                              type="button"
                              className="btnp"
                              disabled={isSubmitting || !canSubmitWithConfig}
                              onClick={handleFinalSubmit}
                            >
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My Free Quotes"}
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(2)}>
                              ← Back to Step 2
                            </button>
                            <p className="consent">
                              By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and{" "}
                              <a href="/privacy-policy">Privacy Policy</a>. We may share your details with matched email
                              marketing providers. You can opt out at any time.
                            </p>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sec-alt">
        <section className="sec" style={{ paddingTop: 48, paddingBottom: 56 }}>
          <div className="ct">
            <div className="stag">How It Works</div>
            <h2 className="sh">From form to shortlist in three quick steps</h2>
            <p className="ssub">
              One structured intake. No repeated questionnaires. We route your answers to ESPs that fit your sending profile.
            </p>
            <div className="howg">
              {[
                {
                  tag: "2 minutes",
                  num: "01",
                  title: "Describe your email program",
                  body: "Share contact details, list size, monthly sends, and industries so vendors understand scale and compliance context.",
                },
                {
                  tag: "Within 24 hours",
                  num: "02",
                  title: "We match and notify you",
                  body: "Specialists map your requirements to platforms with the right automation, templates, and integrations.",
                },
                {
                  tag: "Your pace",
                  num: "03",
                  title: "Compare quotes & demos",
                  body: "Review side-by-side pricing and features. Book demos only with vendors you want to explore.",
                },
              ].map((c) => (
                <div key={c.num} className="hc">
                  <span className="howt">{c.tag}</span>
                  <div className="hwn">{c.num}</div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="sec">
        <div className="ct">
          <div className="stag">Buyer Stories</div>
          <h2 className="sh">Teams that found the right ESP through Compare Bazaar</h2>
          <p className="ssub">Real outcomes from marketing leaders who wanted clearer quotes without endless vendor spam.</p>
          <div className="tg">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="tc">
                <span className="rtag">✓ {t.result}</span>
                <div className="tstars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="#FBBF24" color="#FBBF24" strokeWidth={0} aria-hidden />
                  ))}
                </div>
                <p className="tbody">&ldquo;{t.body}&rdquo;</p>
                <div className="ta">
                  <div className="av" style={{ background: t.avatarBg, color: t.avatarText }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="an">{t.name}</div>
                    <div className="ar">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sec-alt">
        <section className="sec" style={{ paddingTop: 48, paddingBottom: 56 }}>
          <div className="ct">
            <div className="stag">Why Compare Bazaar</div>
            <h2 className="sh">Built for buyers evaluating ESPs</h2>
            <p className="ssub">Independent methodology, transparent matching, and specialists who understand lifecycle marketing.</p>
            <div className="whyg">
              {WHY_ITEMS.map((w) => {
                const Icon = w.icon;
                return (
                  <div key={w.title} className="wc">
                    <div className="wi">
                      <Icon aria-hidden />
                    </div>
                    <div>
                      <h4>{w.title}</h4>
                      <p>{w.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="ct">
        <div className="cta-band">
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2>Ready to compare email marketing platforms?</h2>
            <p>Join thousands of teams. Free matched quotes within 24 hours.</p>
          </div>
          <a
            href="#"
            className="btn-wh"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Get Free Quotes →
          </a>
        </div>
      </div>
    </>
  );
}
