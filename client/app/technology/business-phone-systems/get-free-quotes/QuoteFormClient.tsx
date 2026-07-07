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
  { tag: "2 minutes", num: "01", title: "Frame your rollout", body: "Install vs swap vs expansion sets vendor expectations for hardware leases and managed cutovers." },
  { tag: "Within 24 hours", num: "02", title: "Tailored UC quotes", body: "Responses emphasize Compare Bazaar editorial picks, Ooma, Nextiva, Zoom Phone, Vonage, RingCentral." },
  { tag: "Ops-led", num: "03", title: "Pick winners quickly", body: "Compare unlimited domestic tiers, fax survivability, and CRM integrations side-by-side." },
];

/** VoIP platforms from `business-phone-systems` comparison page */
const VENDORS = [
  { name: "Ooma Office", dot: "#003087" },
  { name: "800.com", dot: "#FF6B35" },
  { name: "Zoom", dot: "#2D8CFF" },
  { name: "Nextiva", dot: "#FF6900" },
  { name: "Vonage", dot: "#00AEEF" },
  { name: "RingCentral", dot: "#FF8800" },
];

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  phoneSystemNeeds: string;
  phonesNeeded: string;
  emailUpdates: boolean;
}

const PHONE_SYSTEM_NEEDS = [
  "Installing new phone system",
  "Replacing existing phone system",
  "Expanding existing phone system",
];
const PHONES_NEEDED = [
  { value: "1-10", label: "1-10 phones" },
  { value: "11-25", label: "11-25 phones" },
  { value: "26-50", label: "26-50 phones" },
  { value: "50+", label: "50+ phones" },
];

const TESTIMONIALS = [
  {
    name: "Lin Zhao",
    role: "IT Manager",
    company: "Atlas Dental Group",
    result: "Cut Telco bill 22% after VoIP bake-off",
    body: "We flagged replacing legacy PBX plus hybrid Zoom usage, and proposals referenced Nextiva and Ooma tiers that matched desk + softphone split.",
    initials: "LZ",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Marcus Webb",
    role: "COO",
    company: "BrightLine Legal",
    result: "Ported numbers inside SLA",
    body: "Teams feared downtime; matched RingCentral + Vonage quotes spelled cutover windows explicitly.",
    initials: "MW",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Valeria Ortiz",
    role: "Rev Ops",
    company: "Pulse CX Studio",
    result: "Unified UCaaS trial in 10 days",
    body: "Quote grid compared unlimited domestic calling vs bolt-on international, which matched how we actually operate.",
    initials: "VO",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Scenario-aware routing",
    body: "Whether you are installing, replacing, or expanding, vendors tailor UCaaS bundles instead of generic seat counts.",
  },
  {
    icon: ShieldCheck,
    title: "Same brands we review",
    body: "Quick picks on Compare Bazaar (Ooma Office, 800.com, Zoom Phone, Nextiva, Vonage) anchor matched outreach.",
  },
  {
    icon: Zap,
    title: "Quotes within ~24 hours",
    body: "Single intake replaces repetitive screening calls when procurement windows are tight.",
  },
  {
    icon: MessageCircle,
    title: "Guidance on integrations",
    body: "Need Teams handoff or CRM click-to-dial depth? Specialists decode proposal differences.",
  },
];

const emptyForm = (): FormData => ({
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phoneNumber: "",
  zipCode: "",
  phoneSystemNeeds: "",
  phonesNeeded: "",
  emailUpdates: false,
});

type QuoteFormClientProps = { heading: string }

export default function BusinessPhoneSystemGetQuotesForm({ heading }: QuoteFormClientProps) {
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
    if (!form.phoneSystemNeeds) e.phoneSystemNeeds = "Please complete this required field.";
    if (!form.phonesNeeded) e.phonesNeeded = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["phoneSystemNeeds", "phonesNeeded"].forEach((k) => delete next[k]);
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
        subject: "Business Phone System Quote Request - Compare-Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        company_name: form.companyName,
        phone: form.phoneNumber,
        zip_code: form.zipCode,
        phone_system_needs: form.phoneSystemNeeds,
        phones_needed: form.phonesNeeded,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "Business Phone System - Get Quotes (Compare-Bazaar)",
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
      console.error("Business phone quote submit failed:", err);
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

  const stepLabel = step === 1 ? "Your contact details" : "Phone project scope & submit";

  return (
    <>

      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />

      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Technology", href: "/technology" },
          { label: "Business Phone Systems", href: "/technology/business-phone-systems" },
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
                  VoIP & UCaaS quotes
                </div>
                <h1>{heading}</h1>
                <p className="hdesc">
                  Describe installs vs replacements, handset counts, and collaboration habits once. Matched quotes align with
                  our editorial shortlist (Ooma Office, 800.com, Zoom Phone, Nextiva, Vonage, RingCentral), plus comparable
                  alternatives when helpful.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes, no obligation",
                    "SMB-friendly & mid-market UCaaS",
                    "Independent methodology",
                    "~24 hour vendor routing",
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
                    { n: "99.999%", l: "SLA leaders" },
                    { n: "UCaaS", l: "Voice + meetings" },
                    { n: "4.3★", l: "Top SMB ease (Ooma)" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Featured VoIP platforms on Compare Bazaar</div>
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
                        UCaaS specialists are pairing vendors to your rollout scenario. Expect comparable quotes within{" "}
                        <strong style={{ color: "var(--blue)" }}>24 hours</strong>.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We translate install vs expansion context into bundle tiers",
                          "You receive proposals referencing desk phones + soft clients",
                          "Schedule pilots only with finalists you choose",
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
                          <h2>Get Free VoIP Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>Business phone system proposals matched within a day</p>
                        <div className="pbar">
                          {[1, 2].map((s) => (
                            <div key={s} className={`pseg ${s < step ? "done" : s === step ? "active" : ""}`} />
                          ))}
                        </div>
                        <div className="step-dots" aria-hidden>
                          {[1, 2].map((s) => (
                            <span key={s} className={`sdot ${s === step ? "on" : ""} ${s < step ? "done" : ""}`} />
                          ))}
                        </div>
                        <div className="plabel">
                          Step <b>{step} of 2</b>: {stepLabel}
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
                                  placeholder="Lin"
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
                                  placeholder="Zhao"
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
                                placeholder="Atlas Dental Group"
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
                                Phone System Scenario<span className="req">*</span>
                              </label>
                              <select
                                value={form.phoneSystemNeeds}
                                className={errors.phoneSystemNeeds ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("phoneSystemNeeds", e.target.value);
                                  clearErr("phoneSystemNeeds");
                                }}
                              >
                                <option value="">Select an option</option>
                                {PHONE_SYSTEM_NEEDS.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                              {errors.phoneSystemNeeds ? <p className="field-err">{errors.phoneSystemNeeds}</p> : null}
                            </div>
                            <div className="ff">
                              <label>
                                Phones Needed<span className="req">*</span>
                              </label>
                              <select
                                value={form.phonesNeeded}
                                className={errors.phonesNeeded ? "input-err" : undefined}
                                onChange={(e) => {
                                  setField("phonesNeeded", e.target.value);
                                  clearErr("phonesNeeded");
                                }}
                              >
                                <option value="">Select an option</option>
                                {PHONES_NEEDED.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                              {errors.phonesNeeded ? <p className="field-err">{errors.phonesNeeded}</p> : null}
                            </div>
                            <label className="chk-row">
                              <input
                                type="checkbox"
                                checked={form.emailUpdates}
                                onChange={(e) => setField("emailUpdates", e.target.checked)}
                              />
                              <span>Send UCaaS tips & Compare Bazaar updates (optional).</span>
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
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My Phone Quotes"}
                            </button>
                            <button type="button" className="btnback" onClick={() => setStep(1)}>
                              ← Back to Step 1
                            </button>
                            <p className="consent">
                              By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and{" "}
                              <a href="/privacy-policy">Privacy Policy</a>. We may share your details with matched VoIP / UCaaS
                              vendors. You can opt out anytime.
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
        title="Modern calling procurement in three beats"
        subtitle="Scenario clarity → aligned UC bundles → pilots without redundant vendor theater."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams that accelerated VoIP decisions"
        subtitle="Hybrid workforce operators pairing Zoom ecosystems with PSTN reliability."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Independent VoIP guidance"
        subtitle="Hands-on testing drives shortlists, not vendor sponsorship lanes."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Ready for VoIP quotes?"
        subtitle="Jump back up, three steps connect you with UC vendors matching our editorial roster."
      />
    </>
  );
}
