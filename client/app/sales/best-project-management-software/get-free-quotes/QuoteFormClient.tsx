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
  KanbanSquare,
  Layers,
  MessageCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { QuoteFormScrollBody } from "@/components/quotes/QuoteFormScrollBody";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";

const HOW_STEPS = [
  { tag: "Fast", num: "01", title: "Quantify teamwork", body: "Sizing, workflows, timelines, budgets, distilled once for vendor alignment." },
  { tag: "Matched", num: "02", title: "PM vendors respond", body: "Proposals cite stacks from Compare Bazaar testing, Monday, ClickUp, Asana, Jira, etc." },
  { tag: "Decide", num: "03", title: "Pilot with confidence", body: "Skip shelfware demos; negotiate with finalists that fit automation + visibility needs." },
];

const VENDORS = [
  { name: "Monday.com", dot: "#FF3D57" },
  { name: "ClickUp", dot: "#7B68EE" },
  { name: "Asana", dot: "#F06A6A" },
  { name: "Notion", dot: "#111827" },
  { name: "Jira", dot: "#0052CC" },
  { name: "Trello", dot: "#0079BF" },
];

const FEATURE_OPTS = [
  "Task dependencies",
  "Gantt charts",
  "Automation rules",
  "Team workload view",
  "Client collaboration",
  "Time tracking",
];

const TEAM_SIZES = ["1-10", "11-50", "51-200", "200+"];
const PROJECT_TYPES = ["Marketing", "Product", "Software Development", "Operations", "Mixed"];
const BUDGET_RANGES = ["Under $100/mo", "$100-$500/mo", "$500-$1500/mo", "$1500+/mo"];
const TIMELINES = ["Immediately", "Within 30 days", "1-3 months", "Exploring options"];

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  teamSize: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  currentTool: string;
  features: string[];
  notes: string;
  emailUpdates: boolean;
}

const TESTIMONIALS = [
  {
    name: "Sophie Brennan",
    role: "PMO Lead",
    company: "Helio Renewables",
    result: "Monday vs ClickUp decision in two sprints",
    body: "Automation + workload truth captured once, demos stopped rehashing basic Kanban fluff.",
    initials: "SB",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Ravi Kapoor",
    role: "Engineering Manager",
    company: "Tidal Payments",
    result: "Jira stack validated against hybrid ClickUp pilots",
    body: "Quotes respected agile reporting depth instead of forcing generic PM fluff on dev teams.",
    initials: "RK",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Maya Owens",
    role: "Marketing Ops",
    company: "Northwind Content",
    result: "Notion + Asana hybrids priced fairly",
    body: "Cross-functional approvals needed transparency, responders mapped doc + task workflows clearly.",
    initials: "MO",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: KanbanSquare,
    title: "Workflow-aware routing",
    body: "Team size, workload views, automation appetite, and doc habits steer PM stack recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Same roster we publish",
    body: "Monday.com, ClickUp, Asana, Notion, Jira, Smartsheet, Trello anchor buyer expectations.",
  },
  {
    icon: Zap,
    title: "Fast benchmarking",
    body: "One intake beats vendor-by-vendor datasheet scavenger hunts.",
  },
  {
    icon: MessageCircle,
    title: "Clarity before trials",
    body: "Gantt, automation tiers, integrations, surfaced before you sink weeks into POCs.",
  },
];

const emptyForm = (): FormData => ({
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phoneNumber: "",
  teamSize: "",
  projectType: "",
  budgetRange: "",
  timeline: "",
  currentTool: "",
  features: [],
  notes: "",
  emailUpdates: false,
});

type QuoteFormClientProps = { heading: string }

export default function ProjectManagementGetQuotesPage({ heading }: QuoteFormClientProps) {
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

  const setField = (k: keyof FormData, v: string | string[] | boolean) =>
    setForm((f) => ({ ...f, [k]: v as never }));

  const toggleFeature = (f: string) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));

  const clearErr = (key: string) =>
    setErrors((e) => {
      if (!e[key]) return e;
      const n = { ...e };
      delete n[key];
      return n;
    });

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Please complete this required field.";
    if (!form.lastName.trim()) e.lastName = "Please complete this required field.";
    if (!form.companyName.trim()) e.companyName = "Please complete this required field.";
    if (!form.email.trim()) e.email = "Please complete this required field.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["firstName", "lastName", "companyName", "email", "phoneNumber"].forEach((k) => delete next[k]);
      return { ...next, ...e };
    });
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const er: Record<string, string> = {};
    if (!form.teamSize) er.teamSize = "Please complete this required field.";
    if (!form.projectType) er.projectType = "Please complete this required field.";
    if (!form.budgetRange) er.budgetRange = "Please complete this required field.";
    if (!form.timeline) er.timeline = "Please complete this required field.";
    setErrors((prev) => {
      const next = { ...prev };
      ["teamSize", "projectType", "budgetRange", "timeline"].forEach((k) => delete next[k]);
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
        subject: "Project Management Software Quote Request - Compare Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phoneNumber,
        company_name: form.companyName,
        team_size: form.teamSize,
        project_type: form.projectType,
        budget_range: form.budgetRange,
        timeline: form.timeline,
        current_tool: form.currentTool,
        must_have_features: form.features.join(", "),
        notes: form.notes,
        email_updates: form.emailUpdates ? "Yes" : "No",
        form_source: "Sales > Best Project Management Software > Get Free Quotes",
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
      console.error("PM quote submit failed:", err);
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

  const stepLabel = step === 1 ? "Contact" : step === 2 ? "Team & workflow" : "Features & notes";

  return (
    <>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />

      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sales", href: "/sales" },
          { label: "Best Project Management Software", href: "/sales/best-project-management-software" },
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
                  PM software quotes
                </div>
                <h1>{heading}</h1>
                <p className="hdesc">
                  Tell us team size, work style, timeline, and must-have automation once, then receive vendor matches anchored
                  to Monday.com, ClickUp, Asana, Notion, Jira, and the platforms in our comparison guide.
                </p>
                <ul className="trust-ul">
                  {[
                    "Free quotes · no obligation",
                    "SMB through scaling programs",
                    "Independent methodology",
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
                    { n: "9+", l: "PM apps tested" },
                    { n: "Gantt+", l: "Multi-view stacks" },
                    { n: "Auto", l: "Rules-heavy paths" },
                    { n: "4.5★", l: "Flexible pick (Monday)" },
                  ].map((s) => (
                    <div key={s.l} className="sc">
                      <div className="sn">{s.n}</div>
                      <div className="sl">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="vrow">
                  <div className="vlabel">Top platforms from Compare Bazaar reviews</div>
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
                      <h3>Submitted!</h3>
                      <p>
                        We&apos;re lining up PM vendors to your workload pattern. Expect follow-up shortly with matched
                        options.
                      </p>
                      <ul className="succ-steps">
                        {[
                          "We translate team size & workflow style into credible shortlists",
                          "Quotes reflect automation + reporting depth you signalled",
                          "Trials kick off only with winners you elevate",
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
                          <h2>Get Free PM Quotes</h2>
                          <span className="fbadge">Free · No Obligation</span>
                        </div>
                        <p>Three-step intake · Matched vendors</p>
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
                                  placeholder="Sophie"
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
                                  placeholder="Brennan"
                                />
                                {errors.lastName ? <p className="field-err">{errors.lastName}</p> : null}
                              </div>
                            </div>
                            <div className="ff">
                              <label>
                                Work Email<span className="req">*</span>
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
                              <p className="hint">We may email matched vendor options here.</p>
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
                                placeholder="Helio Renewables"
                              />
                              {errors.companyName ? <p className="field-err">{errors.companyName}</p> : null}
                            </div>
                            <div className="ff">
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
                                Independent match
                              </span>
                            </div>
                          </>
                        )}

                        {step === 2 && (
                          <>
                            <div className="fr">
                              <div>
                                <label>
                                  Team Size<span className="req">*</span>
                                </label>
                                <select
                                  value={form.teamSize}
                                  className={errors.teamSize ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("teamSize", e.target.value);
                                    clearErr("teamSize");
                                  }}
                                >
                                  <option value="">Team size</option>
                                  {TEAM_SIZES.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.teamSize ? <p className="field-err">{errors.teamSize}</p> : null}
                              </div>
                              <div>
                                <label>
                                  Primary workflow<span className="req">*</span>
                                </label>
                                <select
                                  value={form.projectType}
                                  className={errors.projectType ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("projectType", e.target.value);
                                    clearErr("projectType");
                                  }}
                                >
                                  <option value="">Primary project type</option>
                                  {PROJECT_TYPES.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.projectType ? <p className="field-err">{errors.projectType}</p> : null}
                              </div>
                            </div>
                            <div className="fr">
                              <div>
                                <label>
                                  Budget range<span className="req">*</span>
                                </label>
                                <select
                                  value={form.budgetRange}
                                  className={errors.budgetRange ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("budgetRange", e.target.value);
                                    clearErr("budgetRange");
                                  }}
                                >
                                  <option value="">Budget range</option>
                                  {BUDGET_RANGES.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.budgetRange ? <p className="field-err">{errors.budgetRange}</p> : null}
                              </div>
                              <div>
                                <label>
                                  Timeline<span className="req">*</span>
                                </label>
                                <select
                                  value={form.timeline}
                                  className={errors.timeline ? "input-err" : undefined}
                                  onChange={(e) => {
                                    setField("timeline", e.target.value);
                                    clearErr("timeline");
                                  }}
                                >
                                  <option value="">Implementation timeline</option>
                                  {TIMELINES.map((o) => (
                                    <option key={o} value={o}>
                                      {o}
                                    </option>
                                  ))}
                                </select>
                                {errors.timeline ? <p className="field-err">{errors.timeline}</p> : null}
                              </div>
                            </div>
                            <div className="ff">
                              <label>Current tool (optional)</label>
                              <input
                                value={form.currentTool}
                                onChange={(e) => setField("currentTool", e.target.value)}
                                placeholder="e.g. spreadsheets, legacy PM"
                              />
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
                                Must-have features <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(optional)</span>
                              </label>
                              <div className="cgrid">
                                {FEATURE_OPTS.map((f) => {
                                  const sel = form.features.includes(f);
                                  return (
                                    <button
                                      type="button"
                                      key={f}
                                      className={`chip ${sel ? "sel" : ""}`}
                                      onClick={() => toggleFeature(f)}
                                    >
                                      <span className="cchk">{sel ? "✓" : ""}</span>
                                      <Layers className="fico" aria-hidden />
                                      {f}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="ff">
                              <label>Workflow notes (optional)</label>
                              <textarea
                                value={form.notes}
                                onChange={(e) => setField("notes", e.target.value)}
                                placeholder="Anything specific to approvals, tooling, integrations…"
                              />
                            </div>
                            <label className="chk-row">
                              <input
                                type="checkbox"
                                checked={form.emailUpdates}
                                onChange={(e) => setField("emailUpdates", e.target.checked)}
                              />
                              <span>Send me PM tips and Compare Bazaar updates (optional).</span>
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
                              {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get Free Quotes"}
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
        title="Project tooling without spreadsheet chaos"
        subtitle="Facts → credible shortlists → trials with vendors that mirror your workloads."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams shipping PM decisions faster"
        subtitle="Ops & eng leaders balancing Gantt fidelity with doc-light collaboration."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Editorially grounded PM picks"
        subtitle="Hands-on scoring keeps vendor routing honest."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Need PM vendor quotes?"
        subtitle="Jump up and finish three quick steps, we mirror the stacks we benchmark."
      />
    </>
  );
}
