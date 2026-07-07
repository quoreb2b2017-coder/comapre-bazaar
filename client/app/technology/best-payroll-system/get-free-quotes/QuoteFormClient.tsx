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
  CheckCircle2,
  MessageCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { QuoteFormScrollBody } from "@/components/quotes/QuoteFormScrollBody";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

const HOW_STEPS = [
  { tag: "2 minutes", num: "01", title: "Describe payroll operations", body: "Headcount, frequency, incumbent tooling, and preferred vendors shape accurate proposals." },
  { tag: "Within 24 hours", num: "02", title: "We align vendors", body: "Quotes emphasize compliance, contractor handling, and accounting integrations relevant to you." },
  { tag: "Your pace", num: "03", title: "Choose or walk away", body: "Book demos only with payroll stacks that fit, no obligation." },
];

/** Vendor pills aligned with `payroll-software` comparison page picks */
const VENDORS = [
  { name: "ADP", dot: "#D32F2F" },
  { name: "Zoho", dot: "#1A73E8" },
  { name: "BambooHR", dot: "#00A86B" },
  { name: "OnPay", dot: "#0066CC" },
  { name: "QuickBooks", dot: "#0077C5" },
  { name: "Gusto", dot: "#F45D48" },
];

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  employeeCount: string;
  payrollFrequency: string;
  brandName: string;
  currentSystem: string;
  emailUpdates: boolean;
}

const EMPLOYEE_OPTIONS = ["1 - 10", "11 - 50", "51 - 200", "201 - 500", "500+"];
const PAYROLL_FREQUENCY = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "semi-monthly", label: "Semi-monthly" },
  { value: "monthly", label: "Monthly" },
];
const CURRENT_SYSTEM = [
  { value: "manual", label: "Manual/Spreadsheet" },
  { value: "existing-software", label: "Existing Payroll Software" },
  { value: "accountant", label: "Outsourced to Accountant" },
  { value: "none", label: "No current system" },
];
/** Submission values unchanged from legacy form */
const BRAND_OPTIONS = [
  { value: "ADP", label: "ADP" },
  { value: "Zoho", label: "Zoho" },
  { value: "BambooHR", label: "BambooHR" },
  { value: "OnPay", label: "OnPay" },
  { value: "QuickBooks", label: "QuickBooks" },
  { value: "Any other", label: "Any other" },
];

const TESTIMONIALS = [
  {
    name: "Jordan Walsh",
    role: "Finance Manager",
    company: "Brightline Logistics",
    result: "Switched payroll vendors in one cycle",
    body: "We outlined frequency and contractor mix once. The quotes lined up with our compliance needs instead of generic outbound pitches.",
    initials: "JW",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Priya Nanduri",
    role: "Founder",
    company: "Cypress Labs",
    result: "OnPay shortlisted alongside QuickBooks options",
    body: "As a QuickBooks shop we wanted apples-to-apples pricing. The process surfaced full-service filing choices without weeks of discovery calls.",
    initials: "PN",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Chris Meyer",
    role: "HR Ops Lead",
    company: "Union Crafts Co.",
    result: "Multi-state payroll quotes same week",
    body: "ADP-level complexity vs SMB tools was confusing until we compared structured proposals side-by-side.",
    initials: "CM",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Matched to headcount & frequency",
    body: "We route SMB and growing teams to payroll stacks that fit run cadence, contractor mix, and compliance depth.",
  },
  {
    icon: ShieldCheck,
    title: "Editorially independent",
    body: "Rankings follow Compare Bazaar methodology, vendors cannot buy placement in your matched quotes.",
  },
  {
    icon: Zap,
    title: "Fast turnaround",
    body: "Submit once and compare tailored payroll proposals within about one business day.",
  },
  {
    icon: MessageCircle,
    title: "Specialist context",
    body: "Unsure between full-service filing vs software-led workflows? We help interpret trade-offs at no cost.",
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
  payrollFrequency: "",
  brandName: "",
  currentSystem: "",
  emailUpdates: false,
});

type QuoteFormClientProps = { heading: string }

export default function PayrollGetQuotesForm({ heading }: QuoteFormClientProps) {
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

  const setField = (k: keyof FormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v as never }));

  const clearErr = (key: string) =>
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });

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
    if (!form.payrollFrequency) e.payrollFrequency = "Please complete this required field.";
    if (!form.brandName) e.brandName = "Please complete this required field.";
    if (!form.currentSystem) e.currentSystem = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["employeeCount", "payrollFrequency", "brandName", "currentSystem"].forEach((k) => delete next[k]);
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
      const n = { ...prev };
      delete n.captcha;
      return n;
    });

    setIsSubmitting(true);
    try {
      const payload = {
        access_key: web3formsAccessKey,
        subject: "Payroll System Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        employee_count: form.employeeCount,
        payroll_frequency: form.payrollFrequency,
        brand_name: form.brandName,
        current_system: form.currentSystem,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "Payroll System - Get Quotes (Compare-Bazaar)",
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
      console.error("Payroll quote submit failed:", err);
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
    step === 1 ? "Your contact details" : step === 2 ? "Payroll context" : "Submit & preferences";

  return (
    <>

      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />

      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Human Resources", href: "/human-resources" },
          { label: "Best Payroll Software", href: "/human-resources/best-payroll-software" },
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
                  Payroll quotes
                </div>
                <h1>{heading}</h1>
                <p className="hdesc">
                  Share headcount, pay frequency, and preferred platforms once. Get aligned quotes from providers like ADP,
                  OnPay, QuickBooks Payroll, and Gusto, free and no obligation.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes, no credit card",
                    "SMB through multi-state complexity",
                    "Independent methodology",
                    "Responses within ~24 hours",
                  ].map((t) => (
                    <li key={t} className="trust-li">
                      <span className="chk">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="stats">
                  {[
                    { n: "8+", l: "Platforms Compared" },
                    { n: "24h", l: "Quote turnaround" },
                    { n: "Tax filing", l: "Full-service options" },
                    { n: "4.5★", l: "Top SMB pick (OnPay)" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Platforms from our payroll comparison</div>
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
                        We&apos;re routing your payroll profile to matched vendors. Expect tailored quotes in your inbox
                        within <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "Specialists map frequency, headcount, and filing needs",
                          "You receive comparable proposals side-by-side",
                          "Choose demos only with vendors you want to explore",
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
                          <h2>Get Free Payroll Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>Matched payroll proposals within 24 hours</p>
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
                                  placeholder="Sarah"
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
                                  placeholder="Johnson"
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
                                  Phone<span className="req">*</span>
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
                                Payroll Frequency<span className="req">*</span>
                              </label>
                              <select
                                value={form.payrollFrequency}
                                className={errors.payrollFrequency ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("payrollFrequency", e.target.value);
                                  clearErr("payrollFrequency");
                                }}
                              >
                                <option value="">Select payroll frequency</option>
                                {PAYROLL_FREQUENCY.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                              {errors.payrollFrequency ? <p className="field-err">{errors.payrollFrequency}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Preferred Provider<span className="req">*</span>
                              </label>
                              <select
                                value={form.brandName}
                                className={errors.brandName ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("brandName", e.target.value);
                                  clearErr("brandName");
                                }}
                              >
                                <option value="">Preferred service provider</option>
                                {BRAND_OPTIONS.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                              {errors.brandName ? <p className="field-err">{errors.brandName}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Current System<span className="req">*</span>
                              </label>
                              <select
                                value={form.currentSystem}
                                className={errors.currentSystem ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("currentSystem", e.target.value);
                                  clearErr("currentSystem");
                                }}
                              >
                                <option value="">Select current system</option>
                                {CURRENT_SYSTEM.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                              {errors.currentSystem ? <p className="field-err">{errors.currentSystem}</p> : null}
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
                            <label className="chk-row">
                              <input
                                type="checkbox"
                                checked={form.emailUpdates}
                                onChange={(e) => setField("emailUpdates", e.target.checked)}
                              />
                              <span>Send me payroll tips and Compare Bazaar updates (optional).</span>
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
                            {!canSubmitWithConfig ? <p className="cap-err">Form setup is incomplete. Please contact support.</p> : null}
                            {errors.captcha ? <p className="cap-err">{errors.captcha}</p> : null}
                            {submitError ? <p className="cap-err">{submitError}</p> : null}
                            <button
                              type="button"
                              className="btnp"
                              disabled={isSubmitting || !canSubmitWithConfig}
                              onClick={handleFinalSubmit}
                            >
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My Payroll Quotes"}
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(2)}>
                              ← Back to Step 2
                            </button>
                            <p className="consent">
                              By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and{" "}
                              <a href="/privacy-policy">Privacy Policy</a>. We may share your details with matched payroll
                              providers. You can opt out at any time.
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
        title="Payroll shortlisting in three steps"
        subtitle="One intake → matched vendors → you compare filing depth and pricing on your timeline."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams that clarified payroll options faster"
        subtitle="Finance and HR leads comparing SMB payroll vs enterprise filing paths."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Buyer-first payroll matching"
        subtitle="Independent rankings plus structured quote routing, not pay-to-rank placements."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Ready to compare payroll platforms?"
        subtitle="Jump back to the form, quotes tailored to your headcount and pay cycle."
      />
    </>
  );
}
