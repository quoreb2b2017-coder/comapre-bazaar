/**
 * Shared landing CSS for CRM-style quote pages (hero + sticky form card).
 * Keep in sync when tweaking layout tokens shared across marketing quote flows.
 */
export const quoteLandingPageCss = `
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
          --r:12px; --rl:20px;
          --focus-ring:rgba(245,130,32,.22);
          --sh-sm:0 1px 2px rgba(0,0,0,.06);
          --sh:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06);
          --sh-md:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06);
          --sh-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05);
          --sh-xl:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
          --ease:cubic-bezier(.2,.8,.2,1);
        }
        html{scroll-behavior:smooth}
        body{font-family:var(--font);background:var(--white);color:var(--gray-900);line-height:1.6;-webkit-font-smoothing:antialiased}
        a{color:var(--blue);text-decoration:none}
        a:hover{text-decoration:underline}
        nav a{text-decoration:none !important}
        nav a:hover{text-decoration:none !important}
        nav a:not(.bg-brand){color:inherit !important}
        nav a.bg-brand, nav a.bg-brand:hover{color:#fff !important}
        ::selection{background:var(--blue-lt)}

        .bc{background:var(--gray-50);border-bottom:1px solid var(--gray-200);padding:10px 0}
        .bc-row{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--gray-500);flex-wrap:wrap}
        .bc-row a{color:var(--gray-500)} .bc-row a:hover{color:var(--blue);text-decoration:none}
        .bc-sep{color:var(--gray-300)} .bc-cur{color:var(--gray-700);font-weight:500}

        .ct{max-width:1200px;margin:0 auto;padding:0 24px}
        @media(max-width:640px){.ct{padding:0 16px}}

        .hero-shell{background:linear-gradient(180deg,#FFFAF5 0%,#FFFFFF 42%,#F9FAFB 100%);position:relative;overflow:hidden}
        .hero-shell::before{content:'';pointer-events:none;position:absolute;inset:-40% -20% auto -20%;height:85%;background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(245,130,32,.14),transparent 62%)}
        .hero-shell::after{content:'';pointer-events:none;position:absolute;right:-8%;top:12%;width:min(420px,55vw);height:min(420px,55vw);border-radius:50%;background:radial-gradient(circle,rgba(246,160,87,.18),transparent 68%)}

        .hero{padding:58px 0 72px;position:relative;z-index:1}
        @media(max-width:640px){.hero{padding:40px 0 52px}}
        /* minmax(0,…) prevents grid blowout / horizontal scroll beside the form card */
        .hg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,min(440px,100%));gap:56px;align-items:start}
        .hg > *{min-width:0}
        @media(max-width:900px){.hg{grid-template-columns:1fr;gap:36px}}

        .eyebrow{display:inline-flex;align-items:center;gap:7px;background:var(--blue-lt);border:1px solid var(--blue-bd);color:var(--blue);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding:5px 13px;border-radius:100px;margin-bottom:20px}
        .edot{width:6px;height:6px;background:var(--blue);border-radius:50%;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        h1{font-size:clamp(30px,4vw,44px);font-weight:800;color:var(--gray-900);letter-spacing:-1.5px;line-height:1.1;margin-bottom:18px}
        h1 .acc{color:var(--blue)}
        .hdesc{font-size:17px;color:var(--gray-600);line-height:1.7;margin-bottom:28px;max-width:520px}
        .trust-ul{list-style:none;display:flex;flex-wrap:wrap;gap:12px 22px;margin-bottom:32px}
        .trust-li{display:flex;align-items:center;gap:7px;font-size:14px;color:var(--gray-700);font-weight:500}
        .chk{width:18px;height:18px;background:var(--green-lt);border:1px solid var(--green-bd);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--green);font-size:11px;flex-shrink:0}

        .stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--gray-200);border-radius:var(--rl);overflow:hidden;box-shadow:0 12px 36px -28px rgba(110,45,0,.18);margin-bottom:28px;background:var(--white)}
        @media(max-width:540px){.stats{grid-template-columns:repeat(2,1fr)}}
        .sc{padding:22px 14px;text-align:center;border-right:1px solid var(--gray-200);background:linear-gradient(180deg,#FFFFFF 0%,#FFFCF9 100%)}
        .sc:last-child{border-right:none}
        .sn{font-size:26px;font-weight:800;background:linear-gradient(135deg,#F58220,#EC7416);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-1px;line-height:1;margin-bottom:4px}
        .sl{font-size:12px;color:var(--gray-500);font-weight:500}

        .vrow{padding-top:20px;border-top:1px solid var(--gray-200)}
        .vlabel{font-size:12px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;color:var(--gray-400);margin-bottom:12px}
        .vpills{display:flex;flex-wrap:wrap;gap:8px}
        .vp{display:flex;align-items:center;gap:7px;padding:6px 13px;border:1px solid var(--gray-200);border-radius:100px;background:var(--white);font-size:13px;font-weight:600;color:var(--gray-700);box-shadow:var(--sh-sm);transition:border-color .15s,box-shadow .15s}
        .vp:hover{border-color:var(--blue-bd);box-shadow:var(--sh)}
        .vdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

        .fc{display:flex;flex-direction:column;width:100%;max-width:100%;background:linear-gradient(180deg,#FFFFFF 0%,#FFFDFC 100%);border:1px solid rgba(246,160,87,.35);border-radius:var(--rl);box-shadow:0 28px 56px -32px rgba(110,45,0,.35),0 0 0 1px rgba(255,255,255,.6) inset;overflow:hidden;position:sticky;top:76px;backdrop-filter:saturate(120%) blur(4px);transition:box-shadow .28s var(--ease),transform .28s var(--ease)}
        .fc:hover{box-shadow:0 36px 66px -36px rgba(110,45,0,.42),0 0 0 1px rgba(255,255,255,.6) inset}
        .fh{background:linear-gradient(135deg,#F58220 0%,#f48930 48%,#EC7416 100%);padding:24px 28px 22px;color:var(--white);position:relative}
        .fh::after{content:'';pointer-events:none;position:absolute;inset:0;background:linear-gradient(140deg,rgba(255,255,255,.2),transparent 45%);opacity:.85}
        .fh-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px;position:relative;z-index:1}
        .fh-top h2{font-size:19px;font-weight:800;color:var(--white);letter-spacing:-.4px;text-shadow:0 1px 2px rgba(0,0,0,.08)}
        .fbadge{background:rgba(255,255,255,.22);color:var(--white);font-size:11px;font-weight:700;padding:4px 11px;border-radius:100px;border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(6px)}
        .fh p{font-size:13px;color:rgba(255,255,255,.92);margin-bottom:12px;position:relative;z-index:1}
        /* Horizontal segment + dot stepper hidden — step shown in .plabel only */
        .pbar,.step-dots{display:none!important}
        .plabel{font-size:12px;color:rgba(255,255,255,.9);font-weight:600;position:relative;z-index:1;line-height:1.45}
        .plabel b{color:var(--white)}
        /* Full-height form body: no inner scroll trap; page scrolls vertically */
        .fb{
          flex:0 1 auto;
          min-height:0;
          padding:28px 28px 38px;
          background:linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%);
          scroll-behavior:smooth;
          overflow-x:hidden;
          overflow-y:visible;
        }
        .step-pane{animation:qlStepIn .42s var(--ease) both}
        @keyframes qlStepIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        /* Stack name / phone+ZIP rows earlier—tablet widths were too cramped at 2 cols */
        .fr{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        @media(max-width:768px){.fr{grid-template-columns:1fr;gap:12px}}
        .ff{margin-bottom:16px}
        label{display:block;font-size:12px;font-weight:600;color:var(--gray-700);margin-bottom:6px}
        label .req{color:var(--orange);margin-left:2px}
        input,select,textarea{width:100%;background:#FAFAFA;border:1px solid var(--gray-200);border-radius:var(--r);color:var(--gray-900);font-family:var(--font);font-size:15px;padding:12px 14px;outline:none;transition:border-color .22s var(--ease),box-shadow .22s var(--ease),background .22s var(--ease);-webkit-appearance:none}
        textarea{min-height:104px;line-height:1.5;resize:vertical}
        input:hover,select:hover,textarea:hover{border-color:var(--gray-300);background:var(--white)}
        input::placeholder,textarea::placeholder{color:var(--gray-400)}
        input:focus-visible,select:focus-visible,textarea:focus-visible{border-color:var(--blue-md);background:var(--white);box-shadow:0 0 0 3px var(--focus-ring)}
        select{cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%239CA3AF' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
        input.input-err,select.input-err,textarea.input-err{border-color:#DC2626!important;background:#FEF2F2!important}
        .field-err{font-size:11px;color:#B91C1C;margin-top:6px}
        .hint{font-size:11px;color:var(--gray-400);margin-top:6px;line-height:1.5}
        .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:6px}
        @media(max-width:560px){.cgrid{grid-template-columns:1fr}}
        .chip{display:flex;align-items:center;gap:8px;padding:10px 11px;border:1px solid var(--gray-200);border-radius:var(--r);background:var(--white);cursor:pointer;font-size:13px;font-weight:500;color:var(--gray-600);transition:border-color .18s,background .18s,color .18s,box-shadow .18s,transform .15s var(--ease);user-select:none}
        .chip:hover{border-color:var(--blue-bd);color:var(--blue-dk);background:var(--blue-lt);box-shadow:0 8px 18px -12px rgba(245,130,32,.45);transform:translateY(-1px)}
        .chip.sel{border-color:var(--blue-md);background:linear-gradient(135deg,#FFF7ED,#FFFAF5);color:var(--blue-dk);font-weight:600;box-shadow:0 0 0 1px rgba(245,130,32,.25)}
        .fico{width:15px;height:15px;opacity:.95;flex-shrink:0}
        .cchk{width:15px;height:15px;border-radius:4px;border:1.5px solid var(--gray-300);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;transition:all .15s}
        .chip.sel .cchk{background:var(--blue);border-color:var(--blue);color:white}
        .tgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:6px}
        @media(max-width:560px){.tgrid{grid-template-columns:1fr}}
        .tbtn{padding:11px 13px;border:1px solid var(--gray-200);border-radius:var(--r);background:var(--white);font-family:var(--font);font-size:13px;font-weight:500;color:var(--gray-600);cursor:pointer;text-align:left;transition:all .18s var(--ease);line-height:1.45}
        .tbtn:hover{border-color:var(--blue-bd);color:var(--blue-dk);background:var(--blue-lt);transform:translateY(-1px)}
        .tbtn.sel{border-color:var(--blue-md);background:linear-gradient(135deg,#FFF7ED,#FFFAF5);color:var(--blue-dk);font-weight:600;box-shadow:0 0 0 1px rgba(245,130,32,.22)}
        .chk-row{display:flex;align-items:flex-start;gap:10px;margin-top:14px;font-size:12px;color:var(--gray-600);line-height:1.45}
        .chk-row input[type="checkbox"]{margin-top:3px;width:auto;accent-color:var(--orange)}
        .btnp{width:100%;padding:15px 18px;background:linear-gradient(135deg,#F58220 0%,#f48930 50%,#EC7416 100%);color:var(--white);font-family:var(--font);font-size:15px;font-weight:800;border:none;border-radius:var(--r);cursor:pointer;transition:filter .22s var(--ease),transform .2s var(--ease),box-shadow .26s var(--ease);margin-top:20px;letter-spacing:-.02em;border:1px solid rgba(246,160,87,.65);box-shadow:0 10px 28px -14px rgba(180,70,0,.55)}
        .btnp:hover:not(:disabled){filter:brightness(1.05);box-shadow:0 16px 36px -14px rgba(180,70,0,.62);transform:translateY(-2px)}
        .btnp:active:not(:disabled){transform:translateY(0);transition-duration:.1s}
        .btnp:disabled{opacity:.45;cursor:not-allowed}
        .btn-load{display:inline-flex;align-items:center;justify-content:center;gap:8px}
        .btn-spin{
          width:14px;height:14px;border-radius:50%;
          border:2px solid rgba(255,255,255,.5);border-top-color:#fff;
          animation:btnSpin .8s linear infinite;flex-shrink:0
        }
        @keyframes btnSpin{to{transform:rotate(360deg)}}
        .btnback{background:none;border:none;font-family:var(--font);font-size:13px;color:var(--gray-500);cursor:pointer;padding:10px 12px;display:flex;align-items:center;gap:6px;margin-top:10px;width:100%;justify-content:center;border-radius:var(--r);transition:color .2s var(--ease),background .2s var(--ease)}
        .btnback:hover{color:var(--gray-800);background:var(--gray-100)}
        .ftrust{display:flex;align-items:center;justify-content:center;gap:16px;padding:12px 0 0;border-top:1px solid var(--gray-100);margin-top:14px}
        .tbadge{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-400);font-weight:500}
        .tb-ico{width:13px;height:13px;flex-shrink:0}
        .cap-wrap{margin-top:18px;display:flex;justify-content:center;padding:14px;background:var(--gray-50);border-radius:var(--r);border:1px dashed var(--gray-200);max-width:100%;overflow-x:hidden;overflow-y:visible}
        .cap-wrap > *{max-width:100%}
        .cap-err{font-size:12px;color:#B91C1C;text-align:center;margin-top:8px}
        .consent{font-size:11px;color:var(--gray-400);line-height:1.6;text-align:center;margin-top:10px}
        .consent a{color:var(--gray-400);text-decoration:underline}

        .succ{padding:36px 28px 32px;text-align:center}
        .succ-icon{width:60px;height:60px;background:var(--green-lt);border:2px solid var(--green-bd);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
        .succ-icon svg{width:28px;height:28px;color:var(--green)}
        .succ h3{font-size:20px;font-weight:700;color:var(--gray-900);margin-bottom:8px;letter-spacing:-.3px}
        .succ p{font-size:14px;color:var(--gray-600);line-height:1.6;margin-bottom:22px}
        .succ-steps{list-style:none;text-align:left;display:flex;flex-direction:column;gap:12px}
        .ss{display:flex;align-items:flex-start;gap:12px}
        .ssn{width:24px;height:24px;background:var(--blue-lt);border-radius:50%;color:var(--blue);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
        .sst{font-size:13px;color:var(--gray-600);line-height:1.5}

        .sec{padding:64px 0}
        .sec-alt{background:var(--gray-50);border-top:1px solid var(--gray-200);border-bottom:1px solid var(--gray-200)}
        .stag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--blue);margin-bottom:10px}
        h2.sh{font-size:clamp(25px,3.5vw,36px);font-weight:800;color:var(--gray-900);letter-spacing:-1px;line-height:1.15;margin-bottom:10px}
        .ssub{font-size:16px;color:var(--gray-500);max-width:560px;line-height:1.7;margin-bottom:44px}

        .howg{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--gray-200);border:1px solid var(--gray-200);border-radius:var(--rl);overflow:hidden}
        @media(max-width:640px){.howg{grid-template-columns:1fr}}
        .hc{background:var(--white);padding:32px 28px;transition:background .2s ease}
        .hc:hover{background:linear-gradient(180deg,#FFFFFF,#FFFCF9)}
        .howt{display:inline-block;background:var(--blue-lt);color:var(--blue);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 10px;border-radius:100px;margin-bottom:16px}
        .hwn{font-size:44px;font-weight:800;color:var(--gray-100);letter-spacing:-3px;line-height:1;margin-bottom:12px}
        .hc h3{font-size:17px;font-weight:700;color:var(--gray-900);margin-bottom:8px;letter-spacing:-.2px}
        .hc p{font-size:14px;color:var(--gray-500);line-height:1.7}

        .whyg{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        @media(max-width:640px){.whyg{grid-template-columns:1fr}}
        .wc{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--r);padding:24px 22px;display:flex;gap:16px;box-shadow:var(--sh-sm);transition:box-shadow .2s var(--ease),border-color .2s var(--ease),transform .2s var(--ease)}
        .wc:hover{box-shadow:var(--sh-md);border-color:var(--blue-bd);transform:translateY(-2px)}
        .wi{width:40px;height:40px;background:var(--blue-lt);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .wi svg{width:19px;height:19px;color:var(--blue)}
        .wc h4{font-size:15px;font-weight:700;color:var(--gray-900);margin-bottom:5px;letter-spacing:-.2px}
        .wc p{font-size:13px;color:var(--gray-500);line-height:1.6}

        .tg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        @media(max-width:800px){.tg{grid-template-columns:1fr}}
        .tc{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--rl);padding:28px;display:flex;flex-direction:column;box-shadow:var(--sh-sm);transition:box-shadow .2s var(--ease),transform .2s var(--ease),border-color .2s var(--ease)}
        .tc:hover{box-shadow:var(--sh-md);transform:translateY(-2px);border-color:#F6D1AF}
        .rtag{display:inline-flex;align-items:center;gap:6px;background:var(--green-lt);border:1px solid var(--green-bd);color:var(--green);font-size:12px;font-weight:600;padding:4px 10px;border-radius:100px;margin-bottom:14px}
        .tstars{display:flex;gap:3px;margin-bottom:12px}
        .tstars svg{width:15px;height:15px;color:#FBBF24;fill:#FBBF24;stroke:none}
        .tbody{font-size:14px;color:var(--gray-600);line-height:1.7;flex:1}
        .ta{display:flex;align-items:center;gap:12px;padding-top:18px;margin-top:18px;border-top:1px solid var(--gray-100)}
        .av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
        .an{font-size:14px;font-weight:700;color:var(--gray-900)}
        .ar{font-size:12px;color:var(--gray-500)}

        .cta-band{background:linear-gradient(135deg,#F58220 0%,#f48930 45%,#EC7416 100%);border-radius:var(--rl);padding:52px 48px;display:flex;align-items:center;justify-content:space-between;gap:32px;margin:64px 0;position:relative;overflow:hidden;border:1px solid rgba(246,160,87,.5);box-shadow:0 24px 48px -28px rgba(110,45,0,.35)}
        .cta-band::before{content:'';position:absolute;right:-60px;top:-60px;width:240px;height:240px;background:rgba(255,255,255,.12);border-radius:50%}
        .cta-band::after{content:'';position:absolute;inset:0;background:linear-gradient(140deg,rgba(255,255,255,.14),transparent 40%);pointer-events:none}
        @media(max-width:700px){.cta-band{flex-direction:column;text-align:center;padding:36px 24px}}
        .cta-band h2{font-size:clamp(22px,3vw,30px);font-weight:800;color:var(--white);letter-spacing:-.8px;margin-bottom:6px}
        .cta-band p{font-size:15px;color:rgba(255,255,255,.75)}
        .btn-wh{background:var(--white);color:#C2410C;font-family:var(--font);font-size:15px;font-weight:800;padding:14px 28px;border-radius:var(--r);border:1px solid rgba(246,160,87,.6);cursor:pointer;white-space:nowrap;flex-shrink:0;text-decoration:none;display:inline-block;transition:transform .15s var(--ease),box-shadow .2s var(--ease),filter .15s;box-shadow:0 8px 24px -10px rgba(0,0,0,.25);position:relative;z-index:1}
        .btn-wh:hover{transform:translateY(-2px);box-shadow:0 14px 32px -12px rgba(0,0,0,.28);text-decoration:none;color:#9C4302;filter:brightness(1.02)}

        @media(max-width:900px){
          .fc{position:relative;top:auto}
        }
        @media(max-width:640px){
          .fh{padding:18px 18px 16px}
          .fb{padding:20px 18px 26px}
          .fh-top h2{font-size:17px;line-height:1.25}
          .fbadge{align-self:flex-start}
          .btnp{margin-top:16px;padding:14px 16px;font-size:15px}
          .consent{font-size:12px;padding:0 2px}
        }
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          .step-pane{animation:none!important}
        }
        @media(max-width:640px){
          input,select,textarea{min-height:46px;font-size:16px}
        }

        footer{border-top:1px solid var(--gray-200);padding:24px 0;background:var(--white)}
        .fin{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .fc-copy{font-size:13px;color:var(--gray-400)}
        .fl{display:flex;gap:16px;flex-wrap:wrap}
        .fl a{font-size:13px;color:var(--gray-400)}
        .fl a:hover{color:var(--gray-600);text-decoration:none}
      `;
