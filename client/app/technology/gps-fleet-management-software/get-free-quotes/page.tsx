"use client";

import Head from "next/head";
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
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

/** Platforms from `gps-fleet-management` comparison page */
const VENDORS = [
  { name: "Motive", dot: "#00C853" },
  { name: "Teletrac Navman", dot: "#003366" },
  { name: "Verizon Connect", dot: "#E62129" },
  { name: "Samsara", dot: "#111827" },
  { name: "Surecam", dot: "#2563EB" },
  { name: "Fleetio", dot: "#10B981" },
];

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  /** Fleet size — submitted as employee_count for Web3Forms compatibility */
  employeeCount: string;
  vehicleTypes: string;
  emailUpdates: boolean;
}

const FLEET_SIZES = ["1 - 4", "5 - 9", "10 - 19", "20 - 49", "50 - 99", "100 or more"];
const VEHICLE_TYPES = [
  "Vans or trucks",
  "Heavy duty or semi trucks",
  "Cars",
  "Trailers",
  "Construction Equipment",
  "Buses",
  "Other",
];

const TESTIMONIALS = [
  {
    name: "Greg Dalton",
    role: "Fleet Director",
    company: "Summit Freight Co.",
    result: "ELD + GPS quotes aligned to lane mix",
    body: "We described rigs versus vans once — responders quoted hardware bundles that matched duty cycles instead of generic per-seat SaaS.",
    initials: "GD",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Renee Wallace",
    role: "Ops Lead",
    company: "Urban Plumbing Collective",
    result: "Cut idle miles ~11% post rollout",
    body: "Shortlisted vendors understood municipal routing constraints from the intake fields.",
    initials: "RW",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Omar Haddad",
    role: "VP Ops",
    company: "Desert Bulk Transport",
    result: "Safety scoring surfaced comparable dashboards",
    body: "We needed coaching visibility across two terminals — proposals referenced tools like Samsara and Motive without guesswork.",
    initials: "OH",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Matched fleet archetype",
    body: "Fleet size and vehicle types steer quotes toward telematics depth that fits mixed-duty or maintenance-led fleets.",
  },
  {
    icon: ShieldCheck,
    title: "Independent Compare Bazaar picks",
    body: "Vendor rankings follow editorial testing — placements here mirror Motive, Verizon Connect, Samsara, Fleetio, and peers from our guide.",
  },
  {
    icon: Zap,
    title: "Quotes within ~24 hours",
    body: "Single intake replaces repetitive vendor screening calls early in procurement.",
  },
  {
    icon: MessageCircle,
    title: "Guidance on modules",
    body: "Unclear if you need AI dashcam bundles vs maintenance-first stacks? Specialists clarify trade-offs.",
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
  vehicleTypes: "",
  emailUpdates: false,
});

export default function GPSFleetGetQuotesForm() {
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
    if (!form.vehicleTypes) e.vehicleTypes = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["employeeCount", "vehicleTypes"].forEach((k) => delete next[k]);
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
        subject: "GPS Fleet Management Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        employee_count: form.employeeCount,
        vehicle_types: form.vehicleTypes,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "GPS Fleet Management - Get Quotes (Compare-Bazaar)",
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
      console.error("GPS fleet quote submit failed:", err);
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
    step === 1 ? "Your contact details" : step === 2 ? "Fleet profile" : "Submit & preferences";

  return (
    <>
      <Head>
        <title>Get GPS Fleet Management Quotes | Compare Bazaar</title>
        <meta
          name="description"
          content="Get free, no-obligation quotes from top GPS fleet management providers. Compare solutions and find the best fit for your business."
        />
        <link rel="canonical" href="https://www.compare-bazaar.com/technology/gps-fleet-management-software/get-free-quotes" />
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
            <a href="https://www.compare-bazaar.com/technology">Technology</a>
            <span className="bc-sep">›</span>
            <a href="https://www.compare-bazaar.com/technology/gps-fleet-management-software">GPS Fleet Management</a>
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
                  Fleet telematics quotes
                </div>
                <h1>
                  Compare GPS Fleet Quotes
                  <br />
                  <span className="acc">From Platforms We Review</span>
                </h1>
                <p className="hdesc">
                  Capture fleet size and dominant vehicle types once. We route requests toward Motive, Teletrac Navman,
                  Verizon Connect, Samsara, Surecam, Fleetio, and aligned alternatives from our 2026 GPS fleet guide.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes — no obligation",
                    "Real-time GPS + safety stacks",
                    "Editorially independent methodology",
                    "~24 hour vendor alignment",
                  ].map((t) => (
                    <li key={t} className="trust-li">
                      <span className="chk">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="stats">
                  {[
                    { n: "7+", l: "Platforms Compared" },
                    { n: "ELD", l: "Compliance paths" },
                    { n: "AI safety", l: "Dashcam leaders" },
                    { n: "4.6★", l: "Top overall (Samsara)" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Featured fleet platforms on Compare Bazaar</div>
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
                        Matched telematics vendors are reviewing your fleet profile. Expect proposals within{" "}
                        <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We factor fleet scale + asset mix into routing",
                          "You receive comparable GPS / safety bundles",
                          "Pilot hardware only with finalists you choose",
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
                          <h2>Get Free Fleet Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>GPS, compliance, and safety bundles matched quickly</p>
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
                                  placeholder="Jordan"
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
                                  placeholder="Lee"
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
                                placeholder="you@fleetco.com"
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
                                placeholder="Summit Freight Co."
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
                                Fleet Size<span className="req">*</span>
                              </label>
                              <select
                                value={form.employeeCount}
                                className={errors.employeeCount ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("employeeCount", e.target.value);
                                  clearErr("employeeCount");
                                }}
                              >
                                <option value="">Select fleet size</option>
                                {FLEET_SIZES.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.employeeCount ? <p className="field-err">{errors.employeeCount}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Dominant Vehicle Types<span className="req">*</span>
                              </label>
                              <select
                                value={form.vehicleTypes}
                                className={errors.vehicleTypes ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("vehicleTypes", e.target.value);
                                  clearErr("vehicleTypes");
                                }}
                              >
                                <option value="">Select vehicle type</option>
                                {VEHICLE_TYPES.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.vehicleTypes ? <p className="field-err">{errors.vehicleTypes}</p> : null}
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
                              <span>Email me fleet tech guides & Compare Bazaar updates (optional).</span>
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
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My Fleet Quotes"}
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(2)}>
                              ← Back to Step 2
                            </button>
                            <p className="consent">
                              By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and{" "}
                              <a href="/privacy-policy">Privacy Policy</a>. We may share your details with matched fleet
                              telematics vendors. You can opt out anytime.
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
            <h2 className="sh">From fleet intake to vendor pilots</h2>
            <p className={"s" + "sub"}>
              Operational truth → aligned GPS proposals → hardware/software pilots only where ROI is clear.
            </p>
            <div className="howg">
              {[
                {
                  tag: "3 minutes",
                  num: "01",
                  title: "Define fleet reality",
                  body: "Asset counts, dominant vehicle classes, and ZIP anchoring help vendors quote hardware + SaaS accurately.",
                },
                {
                  tag: "Same-day routing",
                  num: "02",
                  title: "Matched telematics stacks",
                  body: "Responses emphasize platforms from our comparison matrix — Samsara, Motive, Verizon Connect, Fleetio, etc.",
                },
                {
                  tag: "Ops-led",
                  num: "03",
                  title: "Deploy at your cadence",
                  body: "Compare bundled dashcam + GPS vs maintenance-first stacks before signing contracts.",
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
          <div className="stag">Fleet Buyer Stories</div>
          <h2 className="sh">Operations teams that de-risked telematics buys</h2>
          <p className={"s" + "sub"}>Mixed-duty fleets translating GPS quotes into measurable idle & safety gains.</p>
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
            <h2 className="sh">Fleet-grade independence</h2>
            <p className={"s" + "sub"}>Hands-on telematics scoring informs who enters your quote pool — not sponsorship slots.</p>
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
            <h2>Ready for GPS fleet quotes?</h2>
            <p>Scroll up, finish three quick steps, and compare aligned vendors.</p>
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
