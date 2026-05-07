"use client";

/**
 * Compare Bazaar — CRM Free Quote Landing Page
 * Design system matched to compare-bazaar.com:
 *   Font:       Inter (Google Fonts — consistent with the site's Next.js/Tailwind build)
 *   Blue:       #1D4ED8  (primary — nav, headings, progress, links)
 *   Orange:     #EA580C  (CTA buttons — action-driving accent)
 *   White bg:   #FFFFFF  (page body)
 *   Alt bg:     #F9FAFB  (alternating sections, cards)
 *   Text dark:  #111827  (headings)
 *   Text mid:   #374151  (body)
 *   Muted:      #6B7280  (subtext, labels)
 *   Border:     #E5E7EB  (cards, inputs)
 *   Green:      #16A34A  (success, trust, checkmarks)
 *   Layout:     max-width 1200px, 24px gutters, sticky form card on desktop
 *   Content:    100% original — no copy from the original page
 */

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
const CRM_STATUS   = ["No CRM yet — evaluating for the first time","Using a CRM — want to switch","Using a CRM — want to add another tool"];
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
    body:"We had spent weeks evaluating tools on our own and were going in circles. The matching process here was fast and relevant — we signed with Pipedrive within a week of receiving our quotes.",
    initials:"PM", avatarBg:"#DBEAFE", avatarText:"#1D4ED8",
  },
  {
    name:"James Okafor", role:"CEO", company:"BrightLeaf Retail",
    result:"Pipeline visibility up 35% in 60 days",
    body:"I was sceptical — these quote forms usually generate spam. Instead, I received four properly tailored vendor quotes within 24 hours. The side-by-side comparison made the final decision straightforward.",
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
  {icon:Target, title:"Matched, not just listed",       body:"We compare your profile against 50+ CRM vendors and filter down to the 3–5 that genuinely suit your team size, industry, and budget — not whoever paid to appear first."},
  {icon:ShieldCheck, title:"Editorially independent",   body:"Every vendor ranking is built on hands-on expert testing and a published scoring methodology. No CRM provider can buy a better position."},
  {icon:Zap, title:"Quotes within 24 hours",            body:"Submit once. Our specialists do the legwork. Expect 3–5 personalised quotes in your inbox the same business day — no sales calls needed upfront."},
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
        <title>Get Free CRM Software Quotes — Compare 50+ Providers | Compare Bazaar</title>
        <meta name="description" content="Describe your CRM requirements once. Receive 3–5 matched, free quotes from Salesforce, HubSpot, Zoho, Pipedrive and more — within 24 hours. Independent, no-obligation." />
        <meta name="keywords"    content="CRM software comparison, free CRM quotes, best CRM 2026, HubSpot vs Salesforce, Zoho CRM, small business CRM, compare CRM pricing" />
        <meta property="og:title"       content="Free CRM Quotes — Compare Bazaar" />
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
        dangerouslySetInnerHTML={{ __html: `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --blue:#F58220; --blue-dk:#EC7416; --blue-md:#F48930;
          --blue-lt:#FFFAF5; --blue-bd:#F6A057;
          --orange:#F58220; --orange-dk:#EC7416; --orange-lt:#FFFAF5;
          --green:#16A34A; --green-lt:#F0FDF4; --green-bd:#BBF7D0;
          --amber:#D97706; --amber-lt:#FFFBEB;
          --white:#FFFFFF; --gray-50:#F9FAFB; --gray-100:#F3F4F6;
          --gray-200:#E5E7EB; --gray-300:#D1D5DB; --gray-400:#9CA3AF;
          --gray-500:#6B7280; --gray-600:#4B5563; --gray-700:#374151;
          --gray-900:#111827;
          --font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          --r:10px; --rl:16px;
          --sh-sm:0 1px 2px rgba(0,0,0,.06);
          --sh:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06);
          --sh-md:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06);
          --sh-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05);
          --sh-xl:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
        }
        html{scroll-behavior:smooth}
        body{font-family:var(--font);background:var(--white);color:var(--gray-900);line-height:1.6;-webkit-font-smoothing:antialiased}
        a{color:var(--blue);text-decoration:none}
        a:hover{text-decoration:underline}
        /* Keep main site navbar styling untouched on this page */
        nav a{text-decoration:none !important}
        nav a:hover{text-decoration:none !important}
        nav a:not(.bg-brand){color:inherit !important}
        nav a.bg-brand, nav a.bg-brand:hover{color:#fff !important}
        ::selection{background:var(--blue-lt)}

        /* breadcrumb */
        .bc{background:var(--gray-50);border-bottom:1px solid var(--gray-200);padding:10px 0}
        .bc-row{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--gray-500);flex-wrap:wrap}
        .bc-row a{color:var(--gray-500)} .bc-row a:hover{color:var(--blue);text-decoration:none}
        .bc-sep{color:var(--gray-300)} .bc-cur{color:var(--gray-700);font-weight:500}

        /* container */
        .ct{max-width:1200px;margin:0 auto;padding:0 24px}

        /* hero grid */
        .hero{padding:48px 0 56px}
        .hg{display:grid;grid-template-columns:1fr 440px;gap:56px;align-items:start}
        @media(max-width:900px){.hg{grid-template-columns:1fr;gap:36px}}

        /* hero left */
        .eyebrow{display:inline-flex;align-items:center;gap:7px;background:var(--blue-lt);border:1px solid var(--blue-bd);color:var(--blue);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding:5px 13px;border-radius:100px;margin-bottom:20px}
        .edot{width:6px;height:6px;background:var(--blue);border-radius:50%;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        h1{font-size:clamp(30px,4vw,44px);font-weight:800;color:var(--gray-900);letter-spacing:-1.5px;line-height:1.1;margin-bottom:18px}
        h1 .acc{color:var(--blue)}
        .hdesc{font-size:17px;color:var(--gray-600);line-height:1.7;margin-bottom:28px;max-width:520px}
        .trust-ul{list-style:none;display:flex;flex-wrap:wrap;gap:12px 22px;margin-bottom:32px}
        .trust-li{display:flex;align-items:center;gap:7px;font-size:14px;color:var(--gray-700);font-weight:500}
        .chk{width:18px;height:18px;background:var(--green-lt);border:1px solid var(--green-bd);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--green);font-size:11px;flex-shrink:0}

        /* stats */
        .stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--gray-200);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh-sm);margin-bottom:28px}
        @media(max-width:540px){.stats{grid-template-columns:repeat(2,1fr)}}
        .sc{padding:20px 14px;text-align:center;border-right:1px solid var(--gray-200);background:var(--white)}
        .sc:last-child{border-right:none}
        .sn{font-size:26px;font-weight:800;color:var(--blue);letter-spacing:-1px;line-height:1;margin-bottom:4px}
        .sl{font-size:12px;color:var(--gray-500);font-weight:500}

        /* vendors */
        .vrow{padding-top:20px;border-top:1px solid var(--gray-200)}
        .vlabel{font-size:12px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;color:var(--gray-400);margin-bottom:12px}
        .vpills{display:flex;flex-wrap:wrap;gap:8px}
        .vp{display:flex;align-items:center;gap:7px;padding:6px 13px;border:1px solid var(--gray-200);border-radius:100px;background:var(--white);font-size:13px;font-weight:600;color:var(--gray-700);box-shadow:var(--sh-sm);transition:border-color .15s,box-shadow .15s}
        .vp:hover{border-color:var(--blue-bd);box-shadow:var(--sh)}
        .vdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

        /* form card */
        .fc{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--rl);box-shadow:var(--sh-xl);overflow:hidden;position:sticky;top:76px}
        .fh{background:var(--blue);padding:22px 28px 20px;color:var(--white)}
        .fh-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
        .fh-top h2{font-size:18px;font-weight:700;color:var(--white);letter-spacing:-.3px}
        .fbadge{background:rgba(255,255,255,.2);color:var(--white);font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;border:1px solid rgba(255,255,255,.3)}
        .fh p{font-size:13px;color:rgba(255,255,255,.8);margin-bottom:14px}
        .pbar{display:flex;gap:4px;margin-bottom:6px}
        .pseg{height:3px;flex:1;border-radius:2px;background:rgba(255,255,255,.25);transition:background .3s}
        .pseg.done{background:rgba(255,255,255,.85)} .pseg.active{background:var(--white)}
        .plabel{font-size:11px;color:rgba(255,255,255,.7);font-weight:500}
        .plabel b{color:var(--white)}
        .fb{padding:24px 28px 28px}
        .fr{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
        .ff{margin-bottom:12px}
        label{display:block;font-size:12px;font-weight:600;color:var(--gray-700);margin-bottom:6px}
        label .req{color:var(--orange);margin-left:2px}
        input,select{width:100%;background:var(--white);border:1px solid var(--gray-300);border-radius:8px;color:var(--gray-900);font-family:var(--font);font-size:14px;padding:10px 13px;outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none}
        input::placeholder{color:var(--gray-400)}
        input:focus,select:focus{border-color:var(--blue-md);box-shadow:0 0 0 3px rgba(59,130,246,.12)}
        select{cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%239CA3AF' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
        .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:6px}
        .chip{display:flex;align-items:center;gap:7px;padding:9px 10px;border:1px solid var(--gray-200);border-radius:8px;background:var(--white);cursor:pointer;font-size:13px;font-weight:500;color:var(--gray-600);transition:all .15s;user-select:none}
        .chip:hover{border-color:var(--blue-md);color:var(--blue);background:var(--blue-lt)}
        .chip.sel{border-color:var(--blue);background:var(--blue-lt);color:var(--blue);font-weight:600}
        .fico{width:15px;height:15px;opacity:.95;flex-shrink:0}
        .cchk{width:15px;height:15px;border-radius:4px;border:1.5px solid var(--gray-300);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;transition:all .15s}
        .chip.sel .cchk{background:var(--blue);border-color:var(--blue);color:white}
        .tgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:6px}
        .tbtn{padding:10px 12px;border:1px solid var(--gray-200);border-radius:8px;background:var(--white);font-family:var(--font);font-size:13px;font-weight:500;color:var(--gray-600);cursor:pointer;text-align:left;transition:all .15s;line-height:1.4}
        .tbtn:hover{border-color:var(--blue-md);color:var(--blue);background:var(--blue-lt)}
        .tbtn.sel{border-color:var(--blue);background:var(--blue-lt);color:var(--blue);font-weight:600}
        .btnp{width:100%;padding:13px;background:var(--orange);color:var(--white);font-family:var(--font);font-size:15px;font-weight:700;border:none;border-radius:8px;cursor:pointer;transition:background .15s,transform .1s,box-shadow .2s;margin-top:18px;letter-spacing:-.2px}
        .btnp:hover:not(:disabled){background:var(--orange-dk);box-shadow:0 4px 14px rgba(234,88,12,.3)}
        .btnp:active:not(:disabled){transform:translateY(1px)}
        .btnp:disabled{opacity:.45;cursor:not-allowed}
        .btnback{background:none;border:none;font-family:var(--font);font-size:13px;color:var(--gray-500);cursor:pointer;padding:6px 0;display:flex;align-items:center;gap:4px;margin-top:8px;width:100%;justify-content:center;transition:color .15s}
        .btnback:hover{color:var(--gray-700)}
        .ftrust{display:flex;align-items:center;justify-content:center;gap:16px;padding:12px 0 0;border-top:1px solid var(--gray-100);margin-top:14px}
        .tbadge{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-400);font-weight:500}
        .tb-ico{width:13px;height:13px;flex-shrink:0}
        .cap-wrap{margin-top:14px;display:flex;justify-content:center}
        .cap-err{font-size:12px;color:#B91C1C;text-align:center;margin-top:8px}
        .consent{font-size:11px;color:var(--gray-400);line-height:1.6;text-align:center;margin-top:10px}
        .consent a{color:var(--gray-400);text-decoration:underline}

        /* success */
        .succ{padding:36px 28px 32px;text-align:center}
        .succ-icon{width:60px;height:60px;background:var(--green-lt);border:2px solid var(--green-bd);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
        .succ-icon svg{width:28px;height:28px;color:var(--green)}
        .succ h3{font-size:20px;font-weight:700;color:var(--gray-900);margin-bottom:8px;letter-spacing:-.3px}
        .succ p{font-size:14px;color:var(--gray-600);line-height:1.6;margin-bottom:22px}
        .succ-steps{list-style:none;text-align:left;display:flex;flex-direction:column;gap:12px}
        .ss{display:flex;align-items:flex-start;gap:12px}
        .ssn{width:24px;height:24px;background:var(--blue-lt);border-radius:50%;color:var(--blue);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
        .sst{font-size:13px;color:var(--gray-600);line-height:1.5}

        /* sections */
        .sec{padding:60px 0}
        .sec-alt{background:var(--gray-50);border-top:1px solid var(--gray-200);border-bottom:1px solid var(--gray-200)}
        .stag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--blue);margin-bottom:10px}
        h2.sh{font-size:clamp(25px,3.5vw,36px);font-weight:800;color:var(--gray-900);letter-spacing:-1px;line-height:1.15;margin-bottom:10px}
        .ssub{font-size:16px;color:var(--gray-500);max-width:560px;line-height:1.7;margin-bottom:44px}

        /* how */
        .howg{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--gray-200);border:1px solid var(--gray-200);border-radius:var(--rl);overflow:hidden}
        @media(max-width:640px){.howg{grid-template-columns:1fr}}
        .hc{background:var(--white);padding:32px 28px}
        .howt{display:inline-block;background:var(--blue-lt);color:var(--blue);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 10px;border-radius:100px;margin-bottom:16px}
        .hwn{font-size:44px;font-weight:800;color:var(--gray-100);letter-spacing:-3px;line-height:1;margin-bottom:12px}
        .hc h3{font-size:17px;font-weight:700;color:var(--gray-900);margin-bottom:8px;letter-spacing:-.2px}
        .hc p{font-size:14px;color:var(--gray-500);line-height:1.7}

        /* why */
        .whyg{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        @media(max-width:640px){.whyg{grid-template-columns:1fr}}
        .wc{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--r);padding:24px 22px;display:flex;gap:16px;box-shadow:var(--sh-sm);transition:box-shadow .15s,border-color .15s}
        .wc:hover{box-shadow:var(--sh-md);border-color:var(--blue-bd)}
        .wi{width:40px;height:40px;background:var(--blue-lt);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .wi svg{width:19px;height:19px;color:var(--blue)}
        .wc h4{font-size:15px;font-weight:700;color:var(--gray-900);margin-bottom:5px;letter-spacing:-.2px}
        .wc p{font-size:13px;color:var(--gray-500);line-height:1.6}

        /* testimonials */
        .tg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        @media(max-width:800px){.tg{grid-template-columns:1fr}}
        .tc{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--rl);padding:28px;display:flex;flex-direction:column;box-shadow:var(--sh-sm);transition:box-shadow .15s}
        .tc:hover{box-shadow:var(--sh-md)}
        .rtag{display:inline-flex;align-items:center;gap:6px;background:var(--green-lt);border:1px solid var(--green-bd);color:var(--green);font-size:12px;font-weight:600;padding:4px 10px;border-radius:100px;margin-bottom:14px}
        .tstars{color:#FBBF24;font-size:13px;letter-spacing:1px;margin-bottom:12px}
        .tbody{font-size:14px;color:var(--gray-600);line-height:1.7;flex:1}
        .ta{display:flex;align-items:center;gap:12px;padding-top:18px;margin-top:18px;border-top:1px solid var(--gray-100)}
        .av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
        .an{font-size:14px;font-weight:700;color:var(--gray-900)}
        .ar{font-size:12px;color:var(--gray-500)}

        /* cta banner */
        .cta-band{background:var(--blue);border-radius:var(--rl);padding:52px 48px;display:flex;align-items:center;justify-content:space-between;gap:32px;margin:64px 0;position:relative;overflow:hidden}
        .cta-band::before{content:'';position:absolute;right:-60px;top:-60px;width:240px;height:240px;background:rgba(255,255,255,.06);border-radius:50%}
        @media(max-width:700px){.cta-band{flex-direction:column;text-align:center;padding:36px 24px}}
        .cta-band h2{font-size:clamp(22px,3vw,30px);font-weight:800;color:var(--white);letter-spacing:-.8px;margin-bottom:6px}
        .cta-band p{font-size:15px;color:rgba(255,255,255,.75)}
        .btn-wh{background:var(--white);color:var(--blue);font-family:var(--font);font-size:15px;font-weight:700;padding:14px 28px;border-radius:8px;border:none;cursor:pointer;white-space:nowrap;flex-shrink:0;text-decoration:none;display:inline-block;transition:transform .1s,box-shadow .2s;box-shadow:0 4px 14px rgba(0,0,0,.15)}
        .btn-wh:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,.2);text-decoration:none;color:var(--blue)}

        /* footer */
        footer{border-top:1px solid var(--gray-200);padding:24px 0;background:var(--white)}
        .fin{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .fc-copy{font-size:13px;color:var(--gray-400)}
        .fl{display:flex;gap:16px;flex-wrap:wrap}
        .fl a{font-size:13px;color:var(--gray-400)}
        .fl a:hover{color:var(--gray-600);text-decoration:none}
      ` }}
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
                suit your team — completely free, no obligation.
              </p>
              <ul className="trust-ul">
                {["Free quotes — no credit card needed","Matched results within 24 hours","50+ vetted CRM vendors in our network","Independent recommendations — no pay-to-rank"].map(t=>(
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

            {/* Right column — form */}
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
                      <div className="plabel">
                        Step <b>{step} of 3</b> —{" "}
                        {step===1?"Your contact details":step===2?"Your business context":"Your priorities"}
                      </div>
                    </div>

                    <div className="fb">
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
                            <label>Must-Have Features<span className="req">*</span> <span style={{fontWeight:400,color:"var(--gray-400)"}}>— select all that apply</span></label>
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
                            {isSubmitting ? "Submitting..." : "Get My Free CRM Quotes"}
                          </button>
                          <button className="btnback" onClick={()=>setStep(2)}>← Back to Step 2</button>
                          <p className="consent">
                            By submitting, you agree to our <a href="/terms-of-use">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.
                            We may share your details with up to 5 matched CRM providers. You can opt out at any time.
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
                <div className="tstars">★★★★★</div>
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
          <div>
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