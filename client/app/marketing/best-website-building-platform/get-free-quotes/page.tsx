"use client";

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  BarChart3,
  CheckCircle2,
  Layout,
  MessageCircle,
  Palette,
  Search,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { QuoteFormScrollBody } from "@/components/quotes/QuoteFormScrollBody";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  employeeCount: string;
  websiteType: string;
  currentWebsite: string;
  pagesNeeded: string;
  ecommerceNeeded: string;
  industry: string;
  importantFeatures: string[];
  emailUpdates: boolean;
}

const EMPLOYEE_OPTIONS = ["1 - 10", "11 - 50", "51 - 200", "201 - 500", "500+"];
const WEBSITE_TYPES = [
  "Business Website",
  "E-commerce Store",
  "Blog",
  "Portfolio",
  "Landing Page",
  "Other",
];
const CURRENT_WEBSITE_OPTIONS = [
  "No website yet",
  "Have a website but want to rebuild",
  "Looking to add features to existing site",
];
const PAGE_RANGES = ["1 - 5 pages", "6 - 10 pages", "11 - 20 pages", "20+ pages"];
const ECOMMERCE_OPTIONS = ["Yes, need online store", "No, just a website", "Maybe in the future"];
const INDUSTRIES = [
  "E-commerce",
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Real Estate",
  "Education",
  "Other",
];

const FEATURE_ITEMS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "drag-drop", label: "Drag-and-Drop Editor", icon: Layout },
  { id: "templates", label: "Professional Templates", icon: Palette },
  { id: "mobile-responsive", label: "Mobile Responsive Design", icon: Smartphone },
  { id: "seo-tools", label: "Built-in SEO Tools", icon: Search },
  { id: "ecommerce", label: "E-commerce Functionality", icon: ShoppingCart },
  { id: "analytics", label: "Analytics & Reporting", icon: BarChart3 },
];

const VENDORS = [
  { name: "Wix", dot: "#0C6EFC" },
  { name: "Squarespace", dot: "#111827" },
  { name: "Webflow", dot: "#4353FF" },
  { name: "Shopify", dot: "#95BF47" },
  { name: "WordPress", dot: "#21759B" },
  { name: "GoDaddy", dot: "#00A4A6" },
];

const TESTIMONIALS = [
  {
    name: "Rachel Kim",
    role: "Creative Director",
    company: "Harbor Studio",
    result: "Launched portfolio site in 10 days",
    body: "We described pages, branding needs, and SEO must-haves once. The quotes pointed us to builders that actually supported our template workflow.",
    initials: "RK",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Tom Alvarez",
    role: "Owner",
    company: "Alvarez Electric",
    result: "Booked 40% more calls after rebuild",
    body: "I needed mobile speed and local SEO without hiring an agency. Matched platforms gave clear pricing, chose one and shipped fast.",
    initials: "TA",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Amelia Frost",
    role: "E-commerce Lead",
    company: "Lumen Goods",
    result: "Found a builder that scales checkout",
    body: "Cart requirements were specific. Every quoted vendor understood inventory sync, avoided weeks of irrelevant demos.",
    initials: "AF",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS = [
  {
    icon: Target,
    title: "Matched to site scope",
    body: "We factor website type, page counts, and commerce needs so you hear from builders that fit, not one-size templates.",
  },
  {
    icon: ShieldCheck,
    title: "Editorially independent",
    body: "Our rankings follow hands-on testing. Providers cannot buy better placement in your quote matches.",
  },
  {
    icon: Zap,
    title: "Fast turnaround",
    body: "Submit once and receive comparable quotes quickly, compare features and onboarding timelines side-by-side.",
  },
  {
    icon: MessageCircle,
    title: "Guidance when you need it",
    body: "Unclear about SEO or storefront apps? Specialists help interpret proposals at no cost.",
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
  websiteType: "",
  currentWebsite: "",
  pagesNeeded: "",
  ecommerceNeeded: "",
  industry: "",
  importantFeatures: [],
  emailUpdates: false,
});

export default function WebsiteBuildingQuotePage() {
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
    if (!form.websiteType) e.websiteType = "Please complete this required field.";
    if (!form.currentWebsite) e.currentWebsite = "Please complete this required field.";
    if (!form.pagesNeeded) e.pagesNeeded = "Please complete this required field.";
    if (!form.ecommerceNeeded) e.ecommerceNeeded = "Please complete this required field.";
    if (!form.industry) e.industry = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["employeeCount", "websiteType", "currentWebsite", "pagesNeeded", "ecommerceNeeded", "industry"].forEach(
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
        subject: "Website Building Platform Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        employee_count: form.employeeCount,
        website_type: form.websiteType,
        current_website: form.currentWebsite,
        pages_needed: form.pagesNeeded,
        ecommerce_needed: form.ecommerceNeeded,
        important_features: form.importantFeatures.join(", "),
        industry: form.industry,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "Website Building Platform - Get Quotes (Compare-Bazaar)",
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
      console.error("Website builder quote submit failed:", err);
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
    step === 1 ? "Your contact details" : step === 2 ? "Your website project" : "Features & preferences";

  return (
    <>
      <Head>
        <title>Get Website Builder Quotes | Compare Bazaar</title>
        <meta
          name="description"
          content="Describe your site type, pages, and commerce needs once. Receive matched free quotes from leading website building platforms within 24 hours."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.compare-bazaar.com/marketing/best-website-building-platform/get-free-quotes" />
        <meta property="og:url" content="https://www.compare-bazaar.com/marketing/best-website-building-platform/get-free-quotes" />
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
            <a href="https://www.compare-bazaar.com/marketing/best-website-building-platform">
              Best Website Building Platform
            </a>
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
                  Website builder quotes
                </div>
                <h1>
                  Compare Website Builder Quotes
                  <br />
                  <span className="acc">Matched to Your Project</span>
                </h1>
                <p className="hdesc">
                  Outline site type, page scope, and e‑commerce needs once. Within 24 hours we match you with platforms
                  that fit templates, SEO, and budget, free and no obligation.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes, no credit card",
                    "Matched builders within 24 hours",
                    "Broad coverage of leading platforms",
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
                    { n: "3,100+", l: "Sites Planned" },
                    { n: "24h", l: "Avg. Quote Delivery" },
                    { n: "25+", l: "Builder Brands" },
                    { n: "4.8 / 5", l: "Avg. User Rating" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Quotes sourced from popular builders</div>
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
                        We're aligning builders to your scope. Expect tailored website platform quotes in your inbox within{" "}
                        <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We're mapping your pages, commerce needs, and feature picks to suitable builders",
                          "You'll receive comparable proposals to review at your pace",
                          "Book demos only with vendors you shortlist",
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
                          <h2>Get Free Website Builder Quotes</h2>
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
                                Website Type<span className="req">*</span>
                              </label>
                              <select
                                value={form.websiteType}
                                className={errors.websiteType ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("websiteType", e.target.value);
                                  clearErr("websiteType");
                                }}
                              >
                                <option value="">Select website type</option>
                                {WEBSITE_TYPES.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.websiteType ? <p className="field-err">{errors.websiteType}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Current website status<span className="req">*</span>
                              </label>
                              <select
                                value={form.currentWebsite}
                                className={errors.currentWebsite ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("currentWebsite", e.target.value);
                                  clearErr("currentWebsite");
                                }}
                              >
                                <option value="">Select option</option>
                                {CURRENT_WEBSITE_OPTIONS.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.currentWebsite ? <p className="field-err">{errors.currentWebsite}</p> : null}
                            </div>
                            <div className="fr">
                              <div>
                                <label>
                                  Pages Needed<span className="req">*</span>
                                </label>
                                <select
                                  value={form.pagesNeeded}
                                  className={errors.pagesNeeded ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("pagesNeeded", e.target.value);
                                    clearErr("pagesNeeded");
                                  }}
                                >
                                  <option value="">Select range</option>
                                  {PAGE_RANGES.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.pagesNeeded ? <p className="field-err">{errors.pagesNeeded}</p> : null}
                              </div>
                              <div>
                                <label>
                                  E‑commerce<span className="req">*</span>
                                </label>
                                <select
                                  value={form.ecommerceNeeded}
                                  className={errors.ecommerceNeeded ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("ecommerceNeeded", e.target.value);
                                    clearErr("ecommerceNeeded");
                                  }}
                                >
                                  <option value="">Select option</option>
                                  {ECOMMERCE_OPTIONS.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.ecommerceNeeded ? <p className="field-err">{errors.ecommerceNeeded}</p> : null}
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
                                <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(select all that apply)</span>
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
                              <a href="/privacy-policy">Privacy Policy</a>. We may share your details with matched website
                              building providers. You can opt out at any time.
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

      <div className="sec-alt">
        <section className="sec" style={{ paddingTop: 48, paddingBottom: 56 }}>
          <div className="ct">
            <div className="stag">How It Works</div>
            <h2 className="sh">Launch-ready comparisons without agency overhead</h2>
            <p className="ssub">
              Capture scope once. We route builders that align with templates, commerce, and SEO expectations.
            </p>
            <div className="howg">
              {[
                {
                  tag: "2 minutes",
                  num: "01",
                  title: "Outline your build",
                  body: "Tell us about pages, storefront needs, and team size so proposals reflect real workload.",
                },
                {
                  tag: "Within 24 hours",
                  num: "02",
                  title: "Receive tailored quotes",
                  body: "Matched vendors respond with pricing ranges, onboarding timelines, and feature highlights.",
                },
                {
                  tag: "You decide",
                  num: "03",
                  title: "Pick your builder",
                  body: "Compare side-by-side. Proceed only with platforms that meet design and growth goals.",
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
          <h2 className="sh">Teams that shipped faster with clearer builder quotes</h2>
          <p className="ssub">
            Owners and marketers who wanted credible comparisons, not endless cold outreach.
          </p>
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
            <h2 className="sh">Guidance for teams picking a website platform</h2>
            <p className="ssub">
              Independent reviews, structured matching, and transparent next steps, built for operators and creatives alike.
            </p>
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
            <h2>Ready to pick your website builder?</h2>
            <p>Share scope once, receive comparable quotes within a day.</p>
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
