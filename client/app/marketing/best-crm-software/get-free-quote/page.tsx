"use client";

/**
 * Compare Bazaar, CRM Free Quote Landing Page
 * Design system matched to compare-bazaar.com:
 *   Font:       Inter (Google Fonts, consistent with the site's Next.js/Tailwind build)
 *   Blue:       #1D4ED8  (primary, nav, headings, progress, links)
 *   Orange:     #EA580C  (CTA buttons, action-driving accent)
 *   White bg:   #FFFFFF  (page body)
 *   Alt bg:     #F9FAFB  (alternating sections, cards)
 *   Text dark:  #111827  (headings)
 *   Text mid:   #374151  (body)
 *   Muted:      #6B7280  (subtext, labels)
 *   Border:     #E5E7EB  (cards, inputs)
 *   Green:      #16A34A  (success, trust, checkmarks)
 *   Layout:     max-width 1200px, 24px gutters, sticky form card on desktop
 *   Content:    100% original, no copy from the original page
 */

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { QuoteFormScrollBody } from "@/components/quotes/QuoteFormScrollBody";
import { quoteLandingPageCss } from "@/lib/quoteLandingPageCss";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  LineChart,
  Link2,
  Mail,
  MessageCircle,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Zap,
  Star,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  firstName: string; lastName: string;
  workEmail: string; company: string;
  phone: string; zipCode: string;
  teamSize: string; industry: string;
  crmStatus: string; features: string[]; timeline: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────
const TEAM_SIZES   = ["1–10", "11–50", "51–200", "201–500", "500+"];
const INDUSTRIES   = ["Technology","Finance","Healthcare","Retail","Manufacturing","Real Estate","Education","Professional Services","Other"];
const CRM_STATUS   = ["No CRM yet, evaluating for the first time","Using a CRM, want to switch","Using a CRM, want to add another tool"];
const TIMELINES    = ["Ready to decide now","Within the next 30 days","1–3 months from now","Just gathering information"];
const FEATURES     = [
  {id:"pipeline",    label:"Sales Pipeline & Deals",       icon:BarChart3},
  {id:"contacts",    label:"Contact Management",            icon:Users},
  {id:"email",       label:"Email Integration",             icon:Mail},
  {id:"reporting",   label:"Analytics & Reporting",         icon:LineChart},
  {id:"mobile",      label:"Mobile App",                    icon:Smartphone},
  {id:"automation",  label:"Workflow Automation",           icon:Zap},
  {id:"integrations",label:"Third-Party Integrations",     icon:Link2},
  {id:"ai",          label:"AI-Assisted Insights",          icon:Bot},
];
const VENDORS = [
  {abbr:"SF", name:"Salesforce",  dot:"#00A1E0"},
  {abbr:"HS", name:"HubSpot",     dot:"#FF7A59"},
  {abbr:"ZO", name:"Zoho CRM",    dot:"#E62129"},
  {abbr:"PD", name:"Pipedrive",   dot:"#1F5C99"},
  {abbr:"CR", name:"Creatio",     dot:"#FB8C00"},
  {abbr:"HB", name:"HoneyBook",   dot:"#7E57C2"},
];
const TESTIMONIALS = [
  {
    name:"Priya Mehta", role:"VP of Sales", company:"NovaTech Solutions",
    result:"Reduced CRM spend by $1,100/month",
    body:"We had spent weeks evaluating tools on our own and were going in circles. The matching process here was fast and relevant; we signed with Pipedrive within a week of receiving our quotes.",
    initials:"PM", avatarBg:"#DBEAFE", avatarText:"#1D4ED8",
  },
  {
    name:"James Okafor", role:"CEO", company:"BrightLeaf Retail",
    result:"Pipeline visibility up 35% in 60 days",
    body:"I was sceptical because these quote forms usually generate spam. Instead, I received four properly tailored vendor quotes within 24 hours. The side-by-side comparison made the final decision straightforward.",
    initials:"JO", avatarBg:"#DCFCE7", avatarText:"#16A34A",
  },
  {
    name:"Sana Rashid", role:"Operations Director", company:"MedCore Health",
    result:"Onboarded 120 users across 3 departments",
    body:"Healthcare CRM needs are niche. I had specific compliance and integration requirements. The form captured them accurately and every vendor who responded was actually relevant to our use case.",
    initials:"SR", avatarBg:"#FEF3C7", avatarText:"#D97706",
  },
];
const WHY_ITEMS = [
  {icon:Target, title:"Matched, not just listed",       body:"We compare your profile against 50+ CRM vendors and filter down to the 3–5 that genuinely suit your team size, industry, and budget, not whoever paid to appear first."},
  {icon:ShieldCheck, title:"Editorially independent",   body:"Every vendor ranking is built on hands-on expert testing and a published scoring methodology. No CRM provider can buy a better position."},
  {icon:Zap, title:"Quotes within 24 hours",            body:"Submit once. Our specialists do the legwork. Expect 3–5 personalised quotes in your inbox the same business day, with no sales calls needed upfront."},
  {icon:MessageCircle, title:"Free specialist support", body:"Unsure which features matter for your use case? Our CRM specialists will walk through the options with you at no cost and with no obligation to proceed."},
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CRMQuotePage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captchaRef = useRef<ReCAPTCHA | null>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const web3formsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
  const [form, setForm]           = useState<FormData>({
    firstName:"", lastName:"", workEmail:"", company:"",
    phone:"", zipCode:"", teamSize:"", industry:"",
    crmStatus:"", features:[], timeline:"",
  });

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));
  const toggleFeat = (id: string) =>
    setForm(f => ({
      ...f,
      features: f.features.includes(id)
        ? f.features.filter(x => x !== id)
        : [...f.features, id],
    }));

  const s1ok = form.firstName && form.lastName && form.workEmail && form.company;
  const s2ok = form.teamSize && form.industry && form.crmStatus;
  const s3ok = form.features.length > 0 && form.timeline;
  const formReady = Boolean(s3ok);
  const canSubmitWithConfig = Boolean(recaptchaSiteKey && web3formsAccessKey);

  const handleFinalSubmit = async () => {
    if (!formReady || isSubmitting) return;

    if (!canSubmitWithConfig) {
      setSubmitError("Form config missing. Please try again in a few minutes.");
      return;
    }

    if (!captchaToken) {
      setSubmitError("Please complete reCAPTCHA before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        access_key: web3formsAccessKey,
        subject: "CRM Quote Request - Compare Bazaar",
        from_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.workEmail,
        company_name: form.company,
        phone: form.phone,
        zip_code: form.zipCode,
        team_size: form.teamSize,
        industry: form.industry,
        crm_status: form.crmStatus,
        required_features: form.features.join(", "),
        timeline: form.timeline,
        form_source: "CRM Quote Page - Compare Bazaar",
        captcha_token: captchaToken,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Submission failed");
      }

      setSubmitted(true);
      setCaptchaToken("");
      captchaRef.current?.reset();
    } catch (error) {
      console.error("CRM quote form submit failed:", error);
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

  return (
    <>
      <Head>
        <title>Get Free CRM Software Quotes, Compare 50+ Providers | Compare Bazaar</title>
        <meta name="description" content="Describe your CRM requirements once. Receive 3–5 matched, free quotes from Salesforce, HubSpot, Zoho, Pipedrive and more, within 24 hours. Independent, no-obligation." />
        <meta name="keywords"    content="CRM software comparison, free CRM quotes, best CRM 2026, HubSpot vs Salesforce, Zoho CRM, small business CRM, compare CRM pricing" />
        <meta property="og:title"       content="Free CRM Quotes, Compare Bazaar" />
        <meta property="og:description" content="3–5 personalised CRM quotes delivered in 24 hours. Free, no obligation, no spam." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.compare-bazaar.com/marketing/best-crm-software/get-free-quote" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* ─── Global styles ────────────────────────────────────────────────── */}
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }}
      />

      {/* Breadcrumb */}
      <div className="bc">
        <div className="ct">
          <div className="bc-row">
            <a href="https://www.compare-bazaar.com">Home</a>
            <span className="bc-sep">›</span>
            <a href="https://www.compare-bazaar.com/marketing">Marketing</a>
            <span className="bc-sep">›</span>
            <a href="https://www.compare-bazaar.com/marketing/best-crm-software">Best CRM Software</a>
            <span className="bc-sep">›</span>
            <span className="bc-cur">Get Free Quotes</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="hero-shell">
      <div className="hero">
        <div className="ct">
          <div className="hg">

            {/* Left column */}
            <div>
              <div className="eyebrow"><span className="edot"/>CRM Quote Comparison</div>
              <h1>
                Compare CRM Software Quotes<br/>
                <span className="acc">Matched to Your Business</span>
              </h1>
              <p className="hdesc">
                Describe your requirements once. Within 24 hours, we'll match you with
                3–5 CRM vendors whose features, pricing, and industry experience genuinely
                suit your team, completely free, no obligation.
              </p>
              <ul className="trust-ul">
                {["Free quotes, no credit card needed","Matched results within 24 hours","50+ vetted CRM vendors in our network","Independent recommendations, no pay-to-rank"].map(t=>(
                  <li key={t} className="trust-li"><span className="chk">✓</span>{t}</li>
                ))}
              </ul>

              <div className="stats">
                {[{n:"2,400+",l:"Businesses Matched"},{n:"24h",l:"Avg. Quote Delivery"},{n:"50+",l:"CRM Vendors"},{n:"4.8 / 5",l:"Avg. User Rating"}].map(s=>(
                  <div key={s.l} className="sc">
                    <div className="sn">{s.n}</div>
                    <div className="sl">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="vrow">
                <div className="vlabel">Quotes sourced from leading CRM providers</div>
                <div className="vpills">
                  {VENDORS.map(v=>(
                    <div key={v.name} className="vp">
                      <span className="vdot" style={{background:v.dot}}/>
                      {v.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column, form */}
            <div>
              <div className="fc">
                {submitted ? (
                  <div className="succ">
                    <div className="succ-icon"><CheckCircle2 aria-hidden /></div>
                    <h3>Request received, {form.firstName}!</h3>
                    <p>Our team is reviewing your profile now. Expect tailored CRM quotes in your inbox within <strong style={{color:"var(--blue)"}}>24 hours</strong>.</p>
                    <ul className="succ-steps">
                      {["Our specialists are matching your profile to suitable vendors","You'll receive 3–5 quotes from providers that fit your requirements","Review the options side-by-side and decide at your own pace"].map((s,i)=>(
                        <li key={i} className="ss">
                          <span className="ssn">{i+1}</span>
                          <span className="sst">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ):(
                  <>
                    <div className="fh">
                      <div className="fh-top">
                        <h2>Get Free CRM Quotes</h2>
                        <span className="fbadge">Free · No Obligation</span>
                      </div>
                      <p>3–5 matched quotes delivered within 24 hours</p>
                      <div className="pbar">
                        {[1,2,3].map(s=>(
                          <div key={s} className={`pseg ${s<step?"done":s===step?"active":""}`}/>
                        ))}
                      </div>
                      <div className="step-dots" aria-hidden>
                        {[1,2,3].map((s) => (
                          <span key={s} className={`sdot ${s === step ? "on" : ""} ${s < step ? "done" : ""}`} />
                        ))}
                      </div>
                      <div className="plabel">
                        Step <b>{step} of 3</b>:{" "}
                        {step===1?"Your contact details":step===2?"Your business context":"Your priorities"}
                      </div>
                    </div>

                    <QuoteFormScrollBody step={step}>
                      {/* Step 1 */}
                      {step===1&&(
                        <>
                          <div className="fr">
                            <div><label>First Name<span className="req">*</span></label><input type="text" placeholder="Sarah" value={form.firstName} onChange={e=>set("firstName",e.target.value)}/></div>
                            <div><label>Last Name<span className="req">*</span></label><input type="text" placeholder="Johnson" value={form.lastName} onChange={e=>set("lastName",e.target.value)}/></div>
                          </div>
                          <div className="ff"><label>Work Email<span className="req">*</span></label><input type="email" placeholder="you@company.com" value={form.workEmail} onChange={e=>set("workEmail",e.target.value)}/></div>
                          <div className="ff"><label>Company Name<span className="req">*</span></label><input type="text" placeholder="Acme Corp" value={form.company} onChange={e=>set("company",e.target.value)}/></div>
                          <div className="fr">
                            <div><label>Phone Number</label><input type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div>
                            <div><label>ZIP / Post Code</label><input type="text" placeholder="10001" value={form.zipCode} onChange={e=>set("zipCode",e.target.value)}/></div>
                          </div>
                          <button className="btnp" disabled={!s1ok} onClick={()=>setStep(2)}>Continue to Step 2 →</button>
                          <div className="ftrust">
                            <span className="tbadge"><Shield className="tb-ico" aria-hidden />SSL Encrypted</span>
                            <span className="tbadge"><Sparkles className="tb-ico" aria-hidden />No spam, ever</span>
                          </div>
                        </>
                      )}

                      {/* Step 2 */}
                      {step===2&&(
                        <>
                          <div className="ff"><label>Number of Employees<span className="req">*</span></label>
                            <select value={form.teamSize} onChange={e=>set("teamSize",e.target.value)}>
                              <option value="">Select team size</option>
                              {TEAM_SIZES.map(o=><option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div className="ff"><label>Industry<span className="req">*</span></label>
                            <select value={form.industry} onChange={e=>set("industry",e.target.value)}>
                              <option value="">Select your industry</option>
                              {INDUSTRIES.map(o=><option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div className="ff"><label>Current CRM Situation<span className="req">*</span></label>
                            <select value={form.crmStatus} onChange={e=>set("crmStatus",e.target.value)}>
                              <option value="">Where are you starting from?</option>
                              {CRM_STATUS.map(o=><option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <button className="btnp" disabled={!s2ok} onClick={()=>setStep(3)}>Continue to Step 3 →</button>
                          <button className="btnback" onClick={()=>setStep(1)}>← Back to Step 1</button>
                        </>
                      )}

                      {/* Step 3 */}
                      {step===3&&(
                        <>
                          <div className="ff">
                            <label>Must-Have Features<span className="req">*</span> <span style={{fontWeight:400,color:"var(--gray-400)"}}>(select all that apply)</span></label>
                            <div className="cgrid">
                              {FEATURES.map(f=>{
                                const Icon = f.icon as LucideIcon;
                                return (
                                <div key={f.id} className={`chip ${form.features.includes(f.id)?"sel":""}`} onClick={()=>toggleFeat(f.id)}>
                                  <span className="cchk">{form.features.includes(f.id)?"✓":""}</span>
                                  <Icon className="fico" aria-hidden />
                                  {f.label}
                                </div>
                              )})}
                            </div>
                          </div>
                          <div className="ff" style={{marginTop:14}}>
                            <label>Decision Timeline<span className="req">*</span></label>
                            <div className="tgrid">
                              {TIMELINES.map(t=>(
                                <button key={t} className={`tbtn ${form.timeline===t?"sel":""}`} onClick={()=>set("timeline",t)}>{t}</button>
                              ))}
                            </div>
                          </div>
                          <div className="cap-wrap">
                            <ReCAPTCHA
                              ref={captchaRef}
                              sitekey={recaptchaSiteKey}
                              onChange={(token) => {
                                setCaptchaToken(token || "");
                                if (token) setSubmitError("");
                              }}
                              onExpired={() => setCaptchaToken("")}
                            />
                          </div>
                          {!canSubmitWithConfig ? <p className="cap-err">Form setup is incomplete. Please contact support.</p> : null}
                          {submitError ? <p className="cap-err">{submitError}</p> : null}
                          <button className="btnp" disabled={!formReady || isSubmitting || !canSubmitWithConfig} onClick={handleFinalSubmit}>
                            {isSubmitting ? <span className="btn-load"><span className="btn-spin" aria-hidden /> Submitting...</span> : "Get My Free CRM Quotes"}
                          </button>
                          <button className="btnback" onClick={()=>setStep(2)}>← Back to Step 2</button>
                          <p className="consent">
                            By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.
                            We may share your details with up to 5 matched CRM providers. You can opt out at any time.
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

      {/* How It Works */}
      <div className="sec-alt">
        <section className="sec" style={{paddingTop:48,paddingBottom:56}}>
          <div className="ct">
            <div className="stag">How It Works</div>
            <h2 className="sh">From your first click to a signed contract in three steps</h2>
            <p className="ssub">No repeated intake forms. No unsolicited sales calls. Submit once and we'll handle the rest.</p>
            <div className="howg">
              {[
                {tag:"2 minutes",num:"01",title:"Describe Your Requirements",body:"Our three-step form captures your team size, industry, must-have features, and buying timeline. No irrelevant questions, no long-winded surveys."},
                {tag:"Within 24 hours",num:"02",title:"We Match and Notify You",body:"Our specialists review your profile and match it to the vendors in our network who are the strongest fit. You receive 3–5 tailored quotes by email."},
                {tag:"On your schedule",num:"03",title:"Compare, Choose, or Walk Away",body:"Review the quotes side-by-side. Request demos only from vendors you like. There is no obligation and no pressure to decide quickly."},
              ].map(c=>(
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

      {/* Testimonials */}
      <section className="sec">
        <div className="ct">
          <div className="stag">Buyer Stories</div>
          <h2 className="sh">Results from businesses that used Compare Bazaar</h2>
          <p className="ssub">Over 2,400 organisations have found their CRM through our matching process. Here are three of their experiences.</p>
          <div className="tg">
            {TESTIMONIALS.map(t=>(
              <div key={t.name} className="tc">
                <span className="rtag">✓ {t.result}</span>
                <div className="tstars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="#FBBF24" color="#FBBF24" strokeWidth={0} aria-hidden />
                  ))}
                </div>
                <p className="tbody">"{t.body}"</p>
                <div className="ta">
                  <div className="av" style={{background:t.avatarBg,color:t.avatarText}}>{t.initials}</div>
                  <div><div className="an">{t.name}</div><div className="ar">{t.role}, {t.company}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Compare Bazaar */}
      <div className="sec-alt">
        <section className="sec" style={{paddingTop:48,paddingBottom:56}}>
          <div className="ct">
            <div className="stag">Why Compare Bazaar</div>
            <h2 className="sh">Built to serve buyers, not vendors</h2>
            <p className="ssub">Our editorial rankings are independent. Our matching process is based on fit. We only benefit when you find something that works for your business.</p>
            <div className="whyg">
              {WHY_ITEMS.map(w=>{
                const Icon = w.icon as LucideIcon;
                return (
                <div key={w.title} className="wc">
                  <div className="wi"><Icon aria-hidden /></div>
                  <div><h4>{w.title}</h4><p>{w.body}</p></div>
                </div>
              )})}
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <div className="ct">
        <div className="cta-band">
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2>Ready to find the right CRM for your business?</h2>
            <p>Join 2,400+ businesses. Free matched quotes delivered within 24 hours.</p>
          </div>
          <a href="#" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})}} className="btn-wh">
            Get Free Quotes →
          </a>
        </div>
      </div>

      {/* Footer */}
     
    </>
  );
}