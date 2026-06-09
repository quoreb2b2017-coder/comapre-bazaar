"use client";

import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  CheckCircle2,
  MessageCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { QuoteFormScrollBody } from "@/components/quotes/QuoteFormScrollBody";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

/** Brands from `employee-management` comparison page */
const VENDORS = [
  { name: "Teramind", dot: "#0052CC" },
  { name: "ActivTrak", dot: "#6366F1" },
  { name: "Hubstaff", dot: "#276EE7" },
  { name: "BambooHR", dot: "#00A86B" },
  { name: "Intelogos", dot: "#7C3AED" },
  { name: "Rippling", dot: "#4F46E5" },
];

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  employeeCount: string;
  managementNeeds: string;
  emailUpdates: boolean;
}

const EMPLOYEE_OPTIONS = ["1 - 10", "11 - 50", "51 - 100", "101 - 250", "251 - 500", "500+"];
const MANAGEMENT_NEEDS = [
  "Time & Attendance Tracking",
  "Performance Management",
  "Payroll Integration",
  "HR Automation",
  "Employee Onboarding",
  "All-in-One Solution",
];

const TESTIMONIALS = [
  {
    name: "Sonia Patel",
    role: "People Ops",
    company: "Relay Analytics",
    result: "Shortlisted BambooHR vs Rippling in days",
    body: "We stated headcount and workflow gaps once. Matched vendors actually reflected onboarding and performance priorities.",
    initials: "SP",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Ethan Cole",
    role: "COO",
    company: "Northwind Field Svcs.",
    result: "Remote visibility without surveillance creep",
    body: "Hybrid scheduling plus attendance clarity mattered. Quotes differentiated analytics-heavy tools from full HRIS paths.",
    initials: "EC",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Maria Santos",
    role: "HR Director",
    company: "Evergreen Clinics",
    result: "Compliance-forward workflows surfaced faster",
    body: "Policy-heavy onboarding needed structured demos, not generic HR suites. The routing reflected that.",
    initials: "MS",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Matched to HR maturity",
    body: "Headcount + stated management needs route you toward HRIS, analytics, or monitoring-fit stacks, not one generic list.",
  },
  {
    icon: ShieldCheck,
    title: "Independent rankings",
    body: "Our employee-management methodology is editorial, placements in quotes are fit-based, not sponsored slots.",
  },
  {
    icon: Zap,
    title: "Fast comparisons",
    body: "Submit once and receive tailored vendor responses you can compare side-by-side.",
  },
  {
    icon: MessageCircle,
    title: "Guidance when unclear",
    body: "Not sure between workforce analytics vs core HRIS? Specialists help interpret options at no cost.",
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
  managementNeeds: "",
  emailUpdates: false,
});

type QuoteFormClientProps = { heading: string }

export default function EmployeeManagementGetQuotesForm({ heading }: QuoteFormClientProps) {
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
    if (!form.managementNeeds) e.managementNeeds = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["employeeCount", "managementNeeds"].forEach((k) => delete next[k]);
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
        subject: "Employee Management Software Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        employee_count: form.employeeCount,
        management_needs: form.managementNeeds,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "Employee Management Software - Get Quotes (Compare-Bazaar)",
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
      console.error("Employee management quote submit failed:", err);
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
    step === 1 ? "Your contact details" : step === 2 ? "Workforce & HR needs" : "Submit & preferences";

  return (
    <>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />

      <div className="bc">
        <div className="ct">
          <div className="bc-row">
            <a href="https://www.compare-bazaar.com">Home</a>
            <span className="bc-sep">›</span>
            <a href="https://www.compare-bazaar.com/human-resources">Human Resources</a>
            <span className="bc-sep">›</span>
            <a href="https://www.compare-bazaar.com/human-resources/best-employee-management-software">
              Best Employee Management Software
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
                  HR & workforce quotes
                </div>
                <h1>{heading}</h1>
                <p className="hdesc">
                  Outline headcount and priorities, time tracking, performance cycles, onboarding, or all-in-one HR. Get
                  matched quotes referencing the same platforms we review: Teramind, ActivTrak, Hubstaff, BambooHR,
                  Intelogos, Rippling, and more.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes, no obligation",
                    "SMB through scaling teams",
                    "Independent Compare Bazaar methodology",
                    "Fast vendor alignment",
                  ].map((t) => (
                    <li key={t} className="trust-li">
                      <span className="chk">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="stats">
                  {[
                    { n: "8+", l: "Platforms Evaluated" },
                    { n: "24h", l: "Typical response" },
                    { n: "HRIS + analytics", l: "Coverage mix" },
                    { n: "4.5★", l: "BambooHR SMB pick" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Platforms from our employee-management comparison</div>
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
                        We&apos;re aligning HR and workforce vendors to your stated needs. Expect tailored quotes within{" "}
                        <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We map headcount and workflow priorities to suitable vendors",
                          "You receive comparable proposals to review",
                          "Book demos only with tools you shortlist",
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
                          <h2>Get Free HR Software Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>Matched employee-management proposals within 24 hours</p>
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
                                Primary Management Needs<span className="req">*</span>
                              </label>
                              <select
                                value={form.managementNeeds}
                                className={errors.managementNeeds ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("managementNeeds", e.target.value);
                                  clearErr("managementNeeds");
                                }}
                              >
                                <option value="">Select management needs</option>
                                {MANAGEMENT_NEEDS.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.managementNeeds ? <p className="field-err">{errors.managementNeeds}</p> : null}
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
                              <span>Send me HR software tips and Compare Bazaar updates (optional).</span>
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
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My HR Quotes"}
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(2)}>
                              ← Back to Step 2
                            </button>
                            <p className="consent">
                              By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and{" "}
                              <a href="/privacy-policy">Privacy Policy</a>. We may share your details with matched HR and
                              workforce vendors. You can opt out at any time.
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
            <h2 className="sh">Three steps to a clearer HR shortlist</h2>
            <p className="ssub">
              Structured intake → matched vendors → you compare onboarding depth and analytics fit on your timeline.
            </p>
            <div className="howg">
              {[
                {
                  tag: "2 minutes",
                  num: "01",
                  title: "Outline workforce priorities",
                  body: "Headcount plus attendance, performance, onboarding, or all-in-one needs anchor aligned demos.",
                },
                {
                  tag: "Within 24 hours",
                  num: "02",
                  title: "We route HR-fit vendors",
                  body: "Shortlists reflect Compare Bazaar editorial picks, Teramind, ActivTrak, Hubstaff, BambooHR, and peers.",
                },
                {
                  tag: "Your pace",
                  num: "03",
                  title: "Compare & proceed",
                  body: "Review proposals side-by-side; engage vendors only when it makes sense.",
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
          <h2 className="sh">Teams that accelerated HR evaluations</h2>
          <p className="ssub">People leaders comparing workforce analytics vs HRIS-first stacks.</p>
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
            <h2 className="sh">Buyer-centric workforce matching</h2>
            <p className="ssub">Editorial testing plus transparent routing, not pay-for-placement quote spam.</p>
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
            <h2>Ready to compare employee management platforms?</h2>
            <p>Tell us headcount and priorities once, get structured vendor quotes back quickly.</p>
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
