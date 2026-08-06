/**
 * Scoped landing CSS for all Get Free Quotes pages.
 * Brand: navy #0B2A6F + orange #F58220
 */
export const quoteLandingPageCss = `
.quote-landing-page{
  --navy:#0B2A6F;--navy-dk:#071d4d;--navy-md:#123d92;
  --navy-lt:#EEF3FB;--navy-bd:#C5D4EE;
  --orange:#F58220;--orange-dk:#EC7416;--orange-lt:#FFFAF5;--orange-bd:#F6A057;
  --brand:#1d4ed8;--brand-light:#eff6ff;
  --green:#16A34A;--green-lt:#F0FDF4;--green-bd:#BBF7D0;
  --white:#FFFFFF;--gray-50:#F9FAFB;--gray-100:#F3F4F6;
  --gray-200:#E5E7EB;--gray-300:#D1D5DB;--gray-400:#9CA3AF;
  --gray-500:#6B7280;--gray-600:#4B5563;--gray-700:#374151;--gray-900:#111827;
  --font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --serif:Georgia,'Times New Roman',Times,serif;
  --r:12px;--rl:20px;
  --focus-ring:rgba(11,42,111,.14);
  --sh-sm:0 1px 2px rgba(11,42,111,.05);
  --sh:0 1px 3px rgba(11,42,111,.08),0 1px 2px rgba(11,42,111,.04);
  --sh-md:0 8px 24px -8px rgba(11,42,111,.12),0 4px 8px -4px rgba(11,42,111,.06);
  --sh-lg:0 20px 40px -16px rgba(11,42,111,.18),0 8px 16px -8px rgba(11,42,111,.08);
  --sh-xl:0 28px 56px -20px rgba(11,42,111,.22);
  --ease:cubic-bezier(.2,.8,.2,1);
  color:var(--gray-900);line-height:1.6;-webkit-font-smoothing:antialiased;
}
.quote-landing-page *,.quote-landing-page *::before,.quote-landing-page *::after{box-sizing:border-box}
.quote-landing-page ::selection{background:var(--navy-lt)}

/* Breadcrumb */
.quote-landing-page .bc{
  background:linear-gradient(180deg,var(--navy-lt) 0%,var(--white) 100%);
  border-bottom:1px solid var(--navy-bd);padding:11px 0;
}
.quote-landing-page .bc-row{display:flex;align-items:center;gap:0;font-size:13px;color:var(--gray-500);flex-wrap:wrap}
.quote-landing-page .bc-item{display:inline-flex;align-items:center;gap:6px}
.quote-landing-page .bc-row a{color:var(--gray-600);font-weight:500;transition:color .15s;text-decoration:none}
.quote-landing-page .bc-row a:hover{color:var(--navy)}
.quote-landing-page .bc-sep{color:var(--gray-300);margin:0 2px}
.quote-landing-page .bc-cur{color:var(--navy);font-weight:600}

.quote-landing-page .ct{max-width:1180px;margin:0 auto;padding:0 24px}
@media(max-width:640px){.quote-landing-page .ct{padding:0 16px}}

/* Hero shell */
.quote-landing-page .hero-shell{
  background:
    radial-gradient(ellipse 80% 60% at 0% 0%,rgba(11,42,111,.07),transparent 55%),
    radial-gradient(ellipse 50% 45% at 100% 10%,rgba(245,130,32,.1),transparent 60%),
    linear-gradient(165deg,#eef3fb 0%,#ffffff 42%,#fffaf5 100%);
  position:relative;overflow:hidden;border-bottom:1px solid rgba(11,42,111,.07);
}
.quote-landing-page .hero-shell::before{
  content:'';pointer-events:none;position:absolute;inset:0;
  background-image:linear-gradient(rgba(11,42,111,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(11,42,111,.025) 1px,transparent 1px);
  background-size:32px 32px;mask-image:linear-gradient(180deg,rgba(0,0,0,.35),transparent 70%);
}
.quote-landing-page .hero{padding:52px 0 64px;position:relative;z-index:1}
@media(max-width:640px){.quote-landing-page .hero{padding:32px 0 44px}}
.quote-landing-page .hg{
  display:grid;grid-template-columns:minmax(0,1fr) minmax(0,min(520px,100%));
  gap:40px 52px;align-items:start;
}
.quote-landing-page .hg>*{min-width:0}
@media(max-width:960px){.quote-landing-page .hg{grid-template-columns:1fr;gap:24px}}

.quote-landing-page .quote-hero-copy{display:flex;flex-direction:column;max-width:560px}
.quote-landing-page .quote-hero-form-col{width:100%;align-self:start;position:sticky;top:88px}
.quote-landing-page .quote-hero-form-col .fc{position:relative;top:auto}
@media(max-width:960px){.quote-landing-page .quote-hero-form-col{position:relative;top:auto}}

.quote-landing-page .eyebrow{
  display:inline-flex;align-items:center;gap:8px;width:fit-content;
  background:rgba(255,255,255,.92);border:1px solid var(--navy-bd);
  color:var(--navy);font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.15px;
  padding:7px 14px 7px 12px;border-radius:100px;margin-bottom:16px;box-shadow:var(--sh-sm);
  border-left:3px solid var(--orange);
}
.quote-landing-page .edot{
  width:7px;height:7px;background:var(--orange);border-radius:50%;
  animation:qlPulse 2s infinite;box-shadow:0 0 0 3px rgba(245,130,32,.22);
}
@keyframes qlPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.9)}}

.quote-landing-page h1{
  font-family:var(--serif);font-size:clamp(32px,4.2vw,46px);
  font-weight:700;color:var(--navy);letter-spacing:-.02em;line-height:1.12;margin-bottom:16px;
}
.quote-landing-page h1.quote-hero-title{
  display:flex;flex-direction:column;gap:5px;
  font-size:clamp(27px,3.4vw,40px);line-height:1.08;margin-bottom:16px;
}
.quote-landing-page .quote-hero-title-line{display:block;text-wrap:balance}
.quote-landing-page .quote-hero-title-line .acc,.quote-landing-page h1 .acc{color:var(--orange);font-weight:800}

.quote-landing-page .hdesc{
  font-size:16.5px;color:var(--gray-600);line-height:1.68;margin-bottom:22px;max-width:520px;
}
.quote-landing-page .trust-ul{
  list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:24px;
}
@media(max-width:520px){.quote-landing-page .trust-ul{grid-template-columns:1fr}}
.quote-landing-page .trust-li{
  display:flex;align-items:center;gap:8px;font-size:13px;color:var(--gray-700);font-weight:500;
  padding:8px 12px 8px 10px;background:rgba(255,255,255,.88);
  border:1px solid var(--gray-200);border-radius:10px;box-shadow:var(--sh-sm);
  transition:border-color .15s,transform .15s var(--ease);
}
.quote-landing-page .trust-li:hover{border-color:var(--navy-bd);transform:translateY(-1px)}
.quote-landing-page .chk{
  width:18px;height:18px;background:var(--green-lt);border:1px solid var(--green-bd);
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  color:var(--green);font-size:10px;flex-shrink:0;font-weight:700;
}

.quote-landing-page .stats{
  display:grid;grid-template-columns:repeat(4,1fr);
  border:1px solid var(--navy-bd);border-radius:var(--rl);overflow:hidden;
  box-shadow:var(--sh-md);margin-bottom:22px;background:var(--white);
}
@media(max-width:540px){.quote-landing-page .stats{grid-template-columns:repeat(2,1fr)}}
.quote-landing-page .sc{
  padding:18px 10px;text-align:center;border-right:1px solid var(--navy-bd);
  background:linear-gradient(180deg,#fff 0%,var(--navy-lt) 100%);position:relative;
  transition:background .2s;
}
.quote-landing-page .sc:hover{background:linear-gradient(180deg,#fff 0%,#e4edf9 100%)}
.quote-landing-page .sc:last-child{border-right:none}
.quote-landing-page .sc::before{
  content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:32px;height:3px;border-radius:0 0 100px 100px;background:var(--orange);opacity:.9;
}
.quote-landing-page .sn{
  font-size:23px;font-weight:800;color:var(--navy);letter-spacing:-.03em;line-height:1;margin:8px 0 4px;
}
.quote-landing-page .sl{
  font-size:10px;color:var(--gray-500);font-weight:600;text-transform:uppercase;letter-spacing:.05em;line-height:1.35;
}

.quote-landing-page .vrow{padding-top:16px;border-top:1px solid var(--gray-200);margin-top:2px}
.quote-landing-page .vlabel{
  font-size:10px;text-transform:uppercase;letter-spacing:.95px;font-weight:700;color:var(--gray-400);margin-bottom:10px;
}
.quote-landing-page .vpills{display:flex;flex-wrap:wrap;gap:7px}
.quote-landing-page .vp{
  display:flex;align-items:center;gap:7px;padding:6px 12px;
  border:1px solid var(--gray-200);border-radius:100px;background:rgba(255,255,255,.95);
  font-size:12.5px;font-weight:600;color:var(--gray-700);box-shadow:var(--sh-sm);
  transition:border-color .15s,box-shadow .15s,transform .15s var(--ease);
}
.quote-landing-page .vp:hover{border-color:var(--navy-bd);box-shadow:var(--sh);transform:translateY(-1px)}
.quote-landing-page .vdot{width:7px;height:7px;border-radius:50%;flex-shrink:0}

/* Form card */
.quote-landing-page .fc{
  display:flex;flex-direction:column;width:100%;max-width:100%;
  background:var(--white);border:1px solid rgba(11,42,111,.1);border-radius:var(--rl);
  box-shadow:var(--sh-xl),0 0 0 1px rgba(245,130,32,.06);
  overflow:hidden;transition:box-shadow .28s var(--ease),transform .28s var(--ease);
}
.quote-landing-page .fc:hover{box-shadow:0 32px 64px -24px rgba(11,42,111,.26),0 0 0 1px rgba(245,130,32,.1)}

.quote-landing-page .ql-form-head{
  background:linear-gradient(135deg,var(--navy) 0%,var(--navy-md) 58%,#1549a8 100%);
  padding:18px 20px 16px;color:var(--white);position:relative;border-bottom:3px solid var(--orange);
}
.quote-landing-page .ql-form-head::after{
  content:'';pointer-events:none;position:absolute;inset:0;
  background:linear-gradient(140deg,rgba(255,255,255,.1),transparent 50%);
}
.quote-landing-page .ql-form-head-inner{
  position:relative;z-index:1;display:flex;align-items:center;gap:12px;
}
.quote-landing-page .ql-form-head-icon{
  width:40px;height:40px;border-radius:12px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.06));
  border:1px solid rgba(255,255,255,.22);box-shadow:0 4px 14px -6px rgba(0,0,0,.25);
}
.quote-landing-page .ql-form-head-icon svg{width:19px;height:19px;color:#fff}
.quote-landing-page .ql-form-kicker{
  font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;
  color:rgba(255,255,255,.78);margin-bottom:2px;
}
.quote-landing-page .ql-form-title{
  font-family:var(--serif);font-size:1.05rem;font-weight:700;line-height:1.25;
  color:var(--white);letter-spacing:-.01em;
}

.quote-landing-page .quote-landing-form-card{padding:0!important;width:100%}
.quote-landing-page .quote-landing-form-body{
  overflow:visible;padding:14px 16px 12px;
  background:linear-gradient(180deg,#fff 0%,#f8fafc 100%);
}
@media(min-width:640px){.quote-landing-page .quote-landing-form-body{padding:16px 18px 14px}}
.quote-landing-page .quote-landing-form-card .quote-form-embedded{width:100%;max-width:none;margin:0}

.quote-landing-page .ql-form-foot{
  display:flex;align-items:center;justify-content:center;gap:6px;
  padding:10px 14px;border-top:1px solid var(--gray-100);
  background:var(--gray-50);font-size:11px;font-weight:600;color:var(--gray-500);
}
.quote-landing-page .ql-form-foot-ico{width:13px;height:13px;color:var(--navy);flex-shrink:0}

/* Embedded form polish */
.quote-landing-page .quote-form-embedded .grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
@media(max-width:480px){.quote-landing-page .quote-form-embedded .grid-cols-3{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* Sections */
.quote-landing-page .sec{padding:68px 0}
.quote-landing-page .sec-compact{padding:52px 0}
.quote-landing-page .sec-alt{
  background:linear-gradient(180deg,var(--gray-50) 0%,var(--white) 100%);
  border-top:1px solid var(--gray-200);border-bottom:1px solid var(--gray-200);
}
.quote-landing-page .sec-head{margin-bottom:36px}
.quote-landing-page .stag{
  display:inline-flex;align-items:center;gap:8px;
  font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.15px;
  color:var(--navy);margin-bottom:10px;
}
.quote-landing-page .stag::before{
  content:'';width:20px;height:2px;border-radius:100px;background:var(--orange);
}
.quote-landing-page h2.sh{
  font-family:var(--serif);font-size:clamp(25px,3.2vw,36px);
  font-weight:700;color:var(--navy);letter-spacing:-.02em;line-height:1.16;margin-bottom:10px;
}
.quote-landing-page .ssub{font-size:15.5px;color:var(--gray-500);max-width:560px;line-height:1.68;margin-bottom:0}

.quote-landing-page .howg{
  display:grid;grid-template-columns:repeat(3,1fr);gap:0;
  border:1px solid var(--navy-bd);border-radius:var(--rl);overflow:hidden;
  box-shadow:var(--sh-md);background:var(--white);
}
@media(max-width:720px){.quote-landing-page .howg{grid-template-columns:1fr}}
.quote-landing-page .hc{
  background:var(--white);padding:28px 24px;border-right:1px solid var(--navy-bd);
  transition:background .2s ease,transform .2s var(--ease);position:relative;
}
.quote-landing-page .hc:last-child{border-right:none}
@media(max-width:720px){
  .quote-landing-page .hc{border-right:none;border-bottom:1px solid var(--navy-bd)}
  .quote-landing-page .hc:last-child{border-bottom:none}
}
.quote-landing-page .hc:hover{background:linear-gradient(180deg,#fff,var(--navy-lt))}
.quote-landing-page .howt{
  display:inline-block;background:var(--orange-lt);color:var(--orange-dk);
  font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.85px;
  padding:4px 10px;border-radius:100px;margin-bottom:12px;border:1px solid var(--orange-bd);
}
.quote-landing-page .hwn{
  font-size:38px;font-weight:800;color:rgba(245,130,32,.18);
  letter-spacing:-2px;line-height:1;margin-bottom:8px;font-family:var(--serif);
}
.quote-landing-page .hc h3{font-size:16.5px;font-weight:700;color:var(--navy);margin-bottom:7px;letter-spacing:-.02em}
.quote-landing-page .hc p{font-size:14px;color:var(--gray-500);line-height:1.65}

.quote-landing-page .whyg{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media(max-width:640px){.quote-landing-page .whyg{grid-template-columns:1fr}}
.quote-landing-page .wc{
  background:var(--white);border:1px solid var(--gray-200);border-radius:var(--r);
  padding:22px 20px;display:flex;gap:14px;box-shadow:var(--sh-sm);
  transition:box-shadow .2s var(--ease),border-color .2s var(--ease),transform .2s var(--ease);
}
.quote-landing-page .wc:hover{
  box-shadow:var(--sh-md);border-color:var(--navy-bd);transform:translateY(-2px);
  background:linear-gradient(135deg,#fff 0%,var(--navy-lt) 100%);
}
.quote-landing-page .wi{
  width:40px;height:40px;background:var(--orange-lt);border-radius:11px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  border:1px solid var(--orange-bd);transition:background .2s;
}
.quote-landing-page .wc:hover .wi{background:var(--white)}
.quote-landing-page .wi svg{width:18px;height:18px;color:var(--orange-dk)}
.quote-landing-page .wc h4{font-size:14.5px;font-weight:700;color:var(--navy);margin-bottom:4px}
.quote-landing-page .wc p{font-size:13px;color:var(--gray-500);line-height:1.58}

.quote-landing-page .tg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:800px){.quote-landing-page .tg{grid-template-columns:1fr}}
.quote-landing-page .tc{
  background:var(--white);border:1px solid var(--gray-200);border-radius:var(--rl);
  padding:24px;display:flex;flex-direction:column;box-shadow:var(--sh-sm);position:relative;overflow:hidden;
  transition:box-shadow .2s var(--ease),transform .2s var(--ease),border-color .2s var(--ease);
}
.quote-landing-page .tc::before{
  content:'"';position:absolute;top:8px;right:16px;font-family:var(--serif);
  font-size:64px;line-height:1;color:rgba(11,42,111,.05);pointer-events:none;
}
.quote-landing-page .tc:hover{box-shadow:var(--sh-md);transform:translateY(-3px);border-color:var(--navy-bd)}
.quote-landing-page .rtag{
  display:inline-flex;align-items:center;gap:6px;width:fit-content;
  background:var(--green-lt);border:1px solid var(--green-bd);color:var(--green);
  font-size:10.5px;font-weight:700;padding:4px 10px;border-radius:100px;margin-bottom:12px;
}
.quote-landing-page .tstars{display:flex;gap:2px;margin-bottom:10px}
.quote-landing-page .tbody{font-size:14px;color:var(--gray-600);line-height:1.68;flex:1;position:relative;z-index:1}
.quote-landing-page .ta{
  display:flex;align-items:center;gap:12px;padding-top:16px;margin-top:16px;border-top:1px solid var(--gray-100);
}
.quote-landing-page .av{
  width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;flex-shrink:0;
}
.quote-landing-page .an{font-size:14px;font-weight:700;color:var(--navy)}
.quote-landing-page .ar{font-size:12px;color:var(--gray-500)}

/* Bottom CTA */
.quote-landing-page .cta-band{
  background:linear-gradient(135deg,var(--navy) 0%,var(--navy-md) 50%,#1549a8 100%);
  border-radius:var(--rl);padding:44px 40px;display:flex;align-items:center;justify-content:space-between;gap:28px;
  margin:48px 0 64px;position:relative;overflow:hidden;
  border:1px solid rgba(11,42,111,.2);box-shadow:var(--sh-lg);
}
.quote-landing-page .cta-band::before{
  content:'';position:absolute;right:-40px;top:-40px;width:200px;height:200px;
  background:rgba(245,130,32,.16);border-radius:50%;
}
.quote-landing-page .cta-band::after{
  content:'';position:absolute;left:0;bottom:0;width:100%;height:4px;
  background:linear-gradient(90deg,var(--orange),#ffb366);pointer-events:none;
}
@media(max-width:700px){
  .quote-landing-page .cta-band{flex-direction:column;text-align:center;padding:32px 22px;margin:36px 0 48px}
}
.quote-landing-page .cta-band-copy{position:relative;z-index:1}
.quote-landing-page .cta-kicker{
  font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;
  color:rgba(255,255,255,.72);margin-bottom:6px;
}
.quote-landing-page .cta-band h2{
  font-family:var(--serif);font-size:clamp(21px,2.8vw,30px);
  font-weight:700;color:var(--white);letter-spacing:-.02em;margin-bottom:8px;
}
.quote-landing-page .cta-band p{font-size:14.5px;color:rgba(255,255,255,.84);line-height:1.6;max-width:500px}
.quote-landing-page .btn-wh{
  background:var(--white);color:var(--navy);font-family:var(--font);
  font-size:14.5px;font-weight:800;padding:13px 26px;border-radius:var(--r);
  border:1px solid rgba(255,255,255,.45);cursor:pointer;white-space:nowrap;
  flex-shrink:0;text-decoration:none;display:inline-block;
  transition:transform .15s var(--ease),box-shadow .2s var(--ease),filter .15s;
  box-shadow:0 10px 28px -12px rgba(0,0,0,.3);position:relative;z-index:1;
}
.quote-landing-page .btn-wh:hover{
  transform:translateY(-2px);box-shadow:0 16px 36px -12px rgba(0,0,0,.35);
  text-decoration:none;color:var(--navy-dk);filter:brightness(1.02);
}

@media(max-width:640px){
  .quote-landing-page .sec{padding:48px 0}
  .quote-landing-page .sec-compact{padding:40px 0}
  .quote-landing-page .ql-form-head{padding:16px 16px 14px}
  .quote-landing-page .ql-form-title{font-size:1rem}
}
@media(prefers-reduced-motion:reduce){
  .quote-landing-page *,.quote-landing-page *::before,.quote-landing-page *::after{
    animation:none!important;transition:none!important;
  }
}
`;
