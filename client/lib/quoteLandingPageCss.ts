/**
 * Shared landing CSS for quote pages (hero + sticky form card).
 * Brand: navy #0B2A6F + orange #F58220 — aligned with Compare Bazaar site chrome.
 */
export const quoteLandingPageCss = `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --navy:#0B2A6F; --navy-dk:#071d4d; --navy-md:#123d92;
          --navy-lt:#EEF3FB; --navy-bd:#C5D4EE;
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
          --serif:Georgia,'Times New Roman',Times,serif;
          --r:12px; --rl:20px;
          --focus-ring:rgba(11,42,111,.14);
          --focus-ring-orange:rgba(245,130,32,.22);
          --sh-sm:0 1px 2px rgba(11,42,111,.05);
          --sh:0 1px 3px rgba(11,42,111,.08),0 1px 2px rgba(11,42,111,.04);
          --sh-md:0 8px 24px -8px rgba(11,42,111,.12),0 4px 8px -4px rgba(11,42,111,.06);
          --sh-lg:0 20px 40px -16px rgba(11,42,111,.18),0 8px 16px -8px rgba(11,42,111,.08);
          --sh-xl:0 28px 56px -20px rgba(11,42,111,.22);
          --ease:cubic-bezier(.2,.8,.2,1);
        }
        html{scroll-behavior:smooth}
        body{font-family:var(--font);background:var(--white);color:var(--gray-900);line-height:1.6;-webkit-font-smoothing:antialiased}
        a{color:var(--navy);text-decoration:none}
        a:hover{text-decoration:underline}
        nav a{text-decoration:none !important}
        nav a:hover{text-decoration:none !important}
        nav a:not(.bg-brand){color:inherit !important}
        nav a.bg-brand, nav a.bg-brand:hover{color:#fff !important}
        ::selection{background:var(--navy-lt)}

        .bc{
          background:linear-gradient(180deg,var(--navy-lt) 0%,var(--white) 100%);
          border-bottom:1px solid var(--navy-bd);
          padding:12px 0;
        }
        .bc-row{display:flex;align-items:center;gap:0;font-size:13px;color:var(--gray-500);flex-wrap:wrap}
        .bc-item{display:inline-flex;align-items:center;gap:6px}
        .bc-row a{color:var(--gray-600);font-weight:500;transition:color .15s}
        .bc-row a:hover{color:var(--navy);text-decoration:none}
        .bc-sep{color:var(--gray-300);margin:0 2px}
        .bc-cur{color:var(--navy);font-weight:600}

        .ct{max-width:1200px;margin:0 auto;padding:0 24px}
        @media(max-width:640px){.ct{padding:0 16px}}

        .hero-shell{
          background:linear-gradient(165deg,#eef3fb 0%,#ffffff 38%,#fffaf5 100%);
          position:relative;overflow:hidden;
          border-bottom:1px solid rgba(11,42,111,.06);
        }
        .hero-shell::before{
          content:'';pointer-events:none;position:absolute;
          inset:-30% -15% auto -15%;height:80%;
          background:radial-gradient(ellipse 65% 55% at 18% 0%,rgba(11,42,111,.09),transparent 62%);
        }
        .hero-shell::after{
          content:'';pointer-events:none;position:absolute;
          right:-6%;top:8%;width:min(440px,58vw);height:min(440px,58vw);
          border-radius:50%;
          background:radial-gradient(circle,rgba(245,130,32,.12),transparent 68%);
        }

        .hero{padding:56px 0 68px;position:relative;z-index:1}
        @media(max-width:640px){.hero{padding:36px 0 48px}}
        .hg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,min(460px,100%));gap:52px;align-items:start}
        .hg > *{min-width:0}
        @media(max-width:900px){.hg{grid-template-columns:1fr;gap:32px}}

        .eyebrow{
          display:inline-flex;align-items:center;gap:8px;
          background:var(--white);border:1px solid var(--navy-bd);
          color:var(--navy);font-size:11px;font-weight:700;
          text-transform:uppercase;letter-spacing:1.1px;
          padding:6px 14px;border-radius:100px;margin-bottom:18px;
          box-shadow:var(--sh-sm);
        }
        .edot{width:7px;height:7px;background:var(--orange);border-radius:50%;animation:pulse 2s infinite;box-shadow:0 0 0 3px rgba(245,130,32,.2)}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.92)}}
        h1{
          font-family:var(--serif);font-size:clamp(32px,4.2vw,46px);
          font-weight:700;color:var(--navy);letter-spacing:-.02em;
          line-height:1.12;margin-bottom:16px;
        }
        h1 .acc{color:var(--orange)}
        .hdesc{font-size:17px;color:var(--gray-600);line-height:1.72;margin-bottom:26px;max-width:540px}
        .trust-ul{list-style:none;display:flex;flex-wrap:wrap;gap:10px 20px;margin-bottom:28px}
        .trust-li{
          display:flex;align-items:center;gap:8px;font-size:14px;
          color:var(--gray-700);font-weight:500;
          padding:6px 12px 6px 8px;background:var(--white);
          border:1px solid var(--gray-200);border-radius:100px;
          box-shadow:var(--sh-sm);
        }
        .chk{
          width:18px;height:18px;background:var(--green-lt);border:1px solid var(--green-bd);
          border-radius:50%;display:flex;align-items:center;justify-content:center;
          color:var(--green);font-size:11px;flex-shrink:0;font-weight:700;
        }

        .stats{
          display:grid;grid-template-columns:repeat(4,1fr);
          border:1px solid var(--navy-bd);border-radius:var(--rl);
          overflow:hidden;box-shadow:var(--sh-md);margin-bottom:26px;background:var(--white);
        }
        @media(max-width:540px){.stats{grid-template-columns:repeat(2,1fr)}}
        .sc{
          padding:20px 12px;text-align:center;border-right:1px solid var(--navy-bd);
          background:linear-gradient(180deg,#FFFFFF 0%,var(--navy-lt) 100%);
          position:relative;
        }
        .sc:last-child{border-right:none}
        .sc::after{
          content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);
          width:28px;height:3px;border-radius:100px;background:var(--orange);opacity:.85;
        }
        .sn{
          font-size:25px;font-weight:800;color:var(--navy);
          letter-spacing:-.03em;line-height:1;margin-bottom:5px;
        }
        .sl{font-size:11px;color:var(--gray-500);font-weight:600;text-transform:uppercase;letter-spacing:.04em}

        .vrow{padding-top:18px;border-top:1px solid var(--gray-200)}
        .vlabel{font-size:11px;text-transform:uppercase;letter-spacing:.9px;font-weight:700;color:var(--gray-400);margin-bottom:11px}
        .vpills{display:flex;flex-wrap:wrap;gap:8px}
        .vp{
          display:flex;align-items:center;gap:7px;padding:7px 14px;
          border:1px solid var(--gray-200);border-radius:100px;
          background:var(--white);font-size:13px;font-weight:600;color:var(--gray-700);
          box-shadow:var(--sh-sm);transition:border-color .15s,box-shadow .15s,transform .15s var(--ease);
        }
        .vp:hover{border-color:var(--navy-bd);box-shadow:var(--sh);transform:translateY(-1px)}
        .vdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

        .fc{
          display:flex;flex-direction:column;width:100%;max-width:100%;
          background:var(--white);
          border:1px solid rgba(11,42,111,.1);
          border-radius:var(--rl);
          box-shadow:var(--sh-xl);
          overflow:hidden;position:sticky;top:76px;
          transition:box-shadow .28s var(--ease),transform .28s var(--ease);
        }
        .fc:hover{box-shadow:0 32px 64px -24px rgba(11,42,111,.28)}
        .fh{
          background:linear-gradient(135deg,var(--navy) 0%,var(--navy-md) 55%,#1549a8 100%);
          padding:22px 26px 20px;color:var(--white);position:relative;
          border-bottom:3px solid var(--orange);
        }
        .fh::after{
          content:'';pointer-events:none;position:absolute;inset:0;
          background:linear-gradient(140deg,rgba(255,255,255,.12),transparent 48%);
        }
        .fh-top{
          display:flex;align-items:flex-start;justify-content:space-between;
          gap:12px;flex-wrap:wrap;margin-bottom:10px;position:relative;z-index:1;
        }
        .fh-top h2{
          font-family:var(--serif);font-size:20px;font-weight:700;
          color:var(--white);letter-spacing:-.02em;
        }
        .fbadge{
          background:rgba(245,130,32,.22);color:var(--white);
          font-size:10px;font-weight:700;padding:5px 11px;border-radius:100px;
          border:1px solid rgba(245,130,32,.45);letter-spacing:.04em;text-transform:uppercase;
        }
        .fh p{font-size:13px;color:rgba(255,255,255,.88);margin-bottom:14px;position:relative;z-index:1;line-height:1.5}
        .pbar{
          display:flex;gap:5px;margin-bottom:10px;position:relative;z-index:1;
        }
        .pseg{
          flex:1;height:4px;border-radius:100px;
          background:rgba(255,255,255,.22);transition:background .35s var(--ease),box-shadow .35s;
        }
        .pseg.done{background:rgba(255,255,255,.55)}
        .pseg.active{
          background:linear-gradient(90deg,var(--orange),#ffb366);
          box-shadow:0 0 10px rgba(245,130,32,.45);
        }
        .step-dots{
          display:flex;gap:7px;margin-bottom:8px;position:relative;z-index:1;
        }
        .sdot{
          width:7px;height:7px;border-radius:50%;
          background:rgba(255,255,255,.28);transition:all .25s var(--ease);
        }
        .sdot.on{
          background:var(--orange);transform:scale(1.2);
          box-shadow:0 0 0 3px rgba(245,130,32,.35);
        }
        .sdot.done{background:rgba(255,255,255,.75)}
        .plabel{
          font-size:12px;color:rgba(255,255,255,.92);font-weight:500;
          position:relative;z-index:1;line-height:1.45;
        }
        .plabel b{color:var(--white);font-weight:700}
        .fb{
          flex:0 1 auto;min-height:0;padding:26px 26px 34px;
          background:linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%);
          scroll-behavior:smooth;overflow-x:hidden;overflow-y:visible;
        }
        .step-pane{animation:qlStepIn .38s var(--ease) both}
        @keyframes qlStepIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fr{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        @media(max-width:768px){.fr{grid-template-columns:1fr;gap:12px}}
        .ff{margin-bottom:16px}
        label{display:block;font-size:12px;font-weight:600;color:var(--navy);margin-bottom:6px;letter-spacing:.01em}
        label .req{color:var(--orange);margin-left:2px}
        input:not([type="checkbox"]):not([type="radio"]),select,textarea{
          width:100%;background:var(--white);border:1px solid var(--gray-200);
          border-radius:var(--r);color:var(--gray-900);font-family:var(--font);
          font-size:15px;padding:12px 14px;outline:none;
          transition:border-color .22s var(--ease),box-shadow .22s var(--ease),background .22s var(--ease);
          -webkit-appearance:none;box-shadow:inset 0 1px 2px rgba(11,42,111,.03);
        }
        textarea{min-height:104px;line-height:1.5;resize:vertical}
        input:not([type="checkbox"]):not([type="radio"]):hover,select:hover,textarea:hover{border-color:var(--navy-bd);background:var(--white)}
        input:not([type="checkbox"]):not([type="radio"])::placeholder,textarea::placeholder{color:var(--gray-400)}
        input:not([type="checkbox"]):not([type="radio"]):focus-visible,select:focus-visible,textarea:focus-visible{
          border-color:var(--navy);background:var(--white);
          box-shadow:0 0 0 3px var(--focus-ring),inset 0 1px 2px rgba(11,42,111,.02);
        }
        select{
          cursor:pointer;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%230B2A6F' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;
        }
        input.input-err,select.input-err,textarea.input-err{border-color:#DC2626!important;background:#FEF2F2!important}
        .field-err{font-size:11px;color:#B91C1C;margin-top:6px;font-weight:500}
        .hint{font-size:11px;color:var(--gray-400);margin-top:6px;line-height:1.5}
        .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
        @media(max-width:560px){.cgrid{grid-template-columns:1fr}}
        .chip{
          display:flex;align-items:center;gap:8px;padding:11px 12px;
          border:1px solid var(--gray-200);border-radius:var(--r);
          background:var(--white);cursor:pointer;font-size:13px;font-weight:500;
          color:var(--gray-600);
          transition:border-color .18s,background .18s,color .18s,box-shadow .18s,transform .15s var(--ease);
          user-select:none;
        }
        .chip:hover{border-color:var(--navy-bd);color:var(--navy);background:var(--navy-lt);transform:translateY(-1px)}
        .chip.sel{
          border-color:var(--navy);background:linear-gradient(135deg,var(--navy-lt),#fff);
          color:var(--navy);font-weight:600;box-shadow:0 0 0 1px rgba(11,42,111,.12);
        }
        .fico{width:15px;height:15px;opacity:.95;flex-shrink:0}
        .cchk{
          width:15px;height:15px;border-radius:4px;border:1.5px solid var(--gray-300);
          display:flex;align-items:center;justify-content:center;font-size:10px;
          flex-shrink:0;transition:all .15s;
        }
        .chip.sel .cchk{background:var(--navy);border-color:var(--navy);color:white}
        .tgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
        @media(max-width:560px){.tgrid{grid-template-columns:1fr}}
        .tbtn{
          padding:12px 14px;border:1px solid var(--gray-200);border-radius:var(--r);
          background:var(--white);font-family:var(--font);font-size:13px;font-weight:500;
          color:var(--gray-600);cursor:pointer;text-align:left;
          transition:all .18s var(--ease);line-height:1.45;
        }
        .tbtn:hover{border-color:var(--navy-bd);color:var(--navy);background:var(--navy-lt);transform:translateY(-1px)}
        .tbtn.sel{
          border-color:var(--navy);background:linear-gradient(135deg,var(--navy-lt),#fff);
          color:var(--navy);font-weight:600;box-shadow:0 0 0 1px rgba(11,42,111,.1);
        }
        .chk-row{
          display:flex;align-items:flex-start;gap:10px;margin-top:14px;
          font-size:12px;color:var(--gray-600);line-height:1.45;cursor:pointer;
        }
        .chk-row input[type="checkbox"]{
          margin-top:2px;width:16px;height:16px;min-height:unset;flex-shrink:0;
          padding:0;border-radius:4px;border:1.5px solid var(--gray-300);
          background:var(--white);box-shadow:none;cursor:pointer;
          accent-color:var(--navy);appearance:auto;-webkit-appearance:checkbox;
        }
        .chk-row input[type="checkbox"]:focus-visible{
          outline:none;box-shadow:0 0 0 3px var(--focus-ring);
        }
        .btnp{
          width:100%;padding:15px 18px;
          background:linear-gradient(135deg,var(--orange) 0%,#f48930 50%,var(--orange-dk) 100%);
          color:var(--white);font-family:var(--font);font-size:15px;font-weight:800;
          border:none;border-radius:var(--r);cursor:pointer;
          transition:filter .22s var(--ease),transform .2s var(--ease),box-shadow .26s var(--ease);
          margin-top:20px;letter-spacing:-.02em;
          border:1px solid rgba(246,160,87,.65);
          box-shadow:0 12px 28px -14px rgba(11,42,111,.35);
        }
        .btnp:hover:not(:disabled){
          filter:brightness(1.04);
          box-shadow:0 16px 36px -14px rgba(11,42,111,.4);
          transform:translateY(-2px);
        }
        .btnp:active:not(:disabled){transform:translateY(0);transition-duration:.1s}
        .btnp:disabled{opacity:.45;cursor:not-allowed}
        .btn-load{display:inline-flex;align-items:center;justify-content:center;gap:8px}
        .btn-spin{
          width:14px;height:14px;border-radius:50%;
          border:2px solid rgba(255,255,255,.5);border-top-color:#fff;
          animation:btnSpin .8s linear infinite;flex-shrink:0;
        }
        @keyframes btnSpin{to{transform:rotate(360deg)}}
        .btnback{
          background:none;border:none;font-family:var(--font);font-size:13px;
          color:var(--gray-500);cursor:pointer;padding:10px 12px;
          display:flex;align-items:center;gap:6px;margin-top:10px;width:100%;
          justify-content:center;border-radius:var(--r);
          transition:color .2s var(--ease),background .2s var(--ease);
        }
        .btnback:hover{color:var(--navy);background:var(--navy-lt)}
        .ftrust{
          display:flex;align-items:center;justify-content:center;gap:16px;
          padding:12px 0 0;border-top:1px solid var(--gray-100);margin-top:14px;flex-wrap:wrap;
        }
        .tbadge{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-500);font-weight:600}
        .tb-ico{width:13px;height:13px;flex-shrink:0;color:var(--navy)}
        .cap-wrap{
          margin-top:18px;display:flex;justify-content:center;padding:14px;
          background:var(--navy-lt);border-radius:var(--r);
          border:1px dashed var(--navy-bd);max-width:100%;
          overflow-x:hidden;overflow-y:visible;
        }
        .cap-wrap > *{max-width:100%}
        .cap-err{font-size:12px;color:#B91C1C;text-align:center;margin-top:8px;font-weight:500}
        .consent{font-size:11px;color:var(--gray-400);line-height:1.6;text-align:center;margin-top:10px}
        .consent a{color:var(--gray-500);text-decoration:underline}

        .succ{padding:36px 28px 32px;text-align:center}
        .succ-icon{
          width:64px;height:64px;background:var(--green-lt);border:2px solid var(--green-bd);
          border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;
        }
        .succ-icon svg{width:28px;height:28px;color:var(--green)}
        .succ h3{font-family:var(--serif);font-size:22px;font-weight:700;color:var(--navy);margin-bottom:8px}
        .succ p{font-size:14px;color:var(--gray-600);line-height:1.6;margin-bottom:22px}
        .succ-steps{list-style:none;text-align:left;display:flex;flex-direction:column;gap:12px}
        .ss{display:flex;align-items:flex-start;gap:12px}
        .ssn{
          width:24px;height:24px;background:var(--navy-lt);border-radius:50%;
          color:var(--navy);font-size:12px;font-weight:700;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;
        }
        .sst{font-size:13px;color:var(--gray-600);line-height:1.5}

        .sec{padding:72px 0}
        .sec-compact{padding:56px 0}
        .sec-alt{background:linear-gradient(180deg,var(--gray-50) 0%,var(--white) 100%);border-top:1px solid var(--gray-200);border-bottom:1px solid var(--gray-200)}
        .stag{
          display:inline-flex;align-items:center;gap:8px;
          font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;
          color:var(--navy);margin-bottom:10px;
        }
        .stag::before{
          content:'';width:18px;height:2px;border-radius:100px;background:var(--orange);
        }
        h2.sh{
          font-family:var(--serif);font-size:clamp(26px,3.5vw,38px);
          font-weight:700;color:var(--navy);letter-spacing:-.02em;
          line-height:1.15;margin-bottom:10px;
        }
        .ssub{font-size:16px;color:var(--gray-500);max-width:580px;line-height:1.7;margin-bottom:40px}

        .howg{
          display:grid;grid-template-columns:repeat(3,1fr);gap:0;
          border:1px solid var(--navy-bd);border-radius:var(--rl);
          overflow:hidden;box-shadow:var(--sh-md);background:var(--white);
        }
        @media(max-width:640px){.howg{grid-template-columns:1fr}}
        .hc{
          background:var(--white);padding:32px 28px;
          border-right:1px solid var(--navy-bd);
          transition:background .2s ease;
        }
        .hc:last-child{border-right:none}
        @media(max-width:640px){.hc{border-right:none;border-bottom:1px solid var(--navy-bd)}.hc:last-child{border-bottom:none}}
        .hc:hover{background:linear-gradient(180deg,#FFFFFF,var(--navy-lt))}
        .howt{
          display:inline-block;background:var(--navy-lt);color:var(--navy);
          font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.9px;
          padding:4px 10px;border-radius:100px;margin-bottom:14px;
          border:1px solid var(--navy-bd);
        }
        .hwn{
          font-size:42px;font-weight:800;color:rgba(11,42,111,.08);
          letter-spacing:-3px;line-height:1;margin-bottom:10px;font-family:var(--serif);
        }
        .hc h3{font-size:17px;font-weight:700;color:var(--navy);margin-bottom:8px;letter-spacing:-.02em}
        .hc p{font-size:14px;color:var(--gray-500);line-height:1.7}

        .whyg{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        @media(max-width:640px){.whyg{grid-template-columns:1fr}}
        .wc{
          background:var(--white);border:1px solid var(--gray-200);border-radius:var(--r);
          padding:24px 22px;display:flex;gap:16px;box-shadow:var(--sh-sm);
          transition:box-shadow .2s var(--ease),border-color .2s var(--ease),transform .2s var(--ease);
        }
        .wc:hover{box-shadow:var(--sh-md);border-color:var(--navy-bd);transform:translateY(-2px)}
        .wi{
          width:42px;height:42px;background:var(--navy-lt);border-radius:11px;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          border:1px solid var(--navy-bd);
        }
        .wi svg{width:19px;height:19px;color:var(--navy)}
        .wc h4{font-size:15px;font-weight:700;color:var(--navy);margin-bottom:5px}
        .wc p{font-size:13px;color:var(--gray-500);line-height:1.6}

        .tg{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        @media(max-width:800px){.tg{grid-template-columns:1fr}}
        .tc{
          background:var(--white);border:1px solid var(--gray-200);border-radius:var(--rl);
          padding:28px;display:flex;flex-direction:column;box-shadow:var(--sh-sm);
          transition:box-shadow .2s var(--ease),transform .2s var(--ease),border-color .2s var(--ease);
        }
        .tc:hover{box-shadow:var(--sh-md);transform:translateY(-3px);border-color:var(--navy-bd)}
        .rtag{
          display:inline-flex;align-items:center;gap:6px;
          background:var(--green-lt);border:1px solid var(--green-bd);
          color:var(--green);font-size:11px;font-weight:700;
          padding:4px 10px;border-radius:100px;margin-bottom:14px;
          letter-spacing:.02em;
        }
        .tstars{display:flex;gap:3px;margin-bottom:12px}
        .tstars svg{width:15px;height:15px;color:#FBBF24;fill:#FBBF24;stroke:none}
        .tbody{font-size:14px;color:var(--gray-600);line-height:1.72;flex:1}
        .ta{
          display:flex;align-items:center;gap:12px;padding-top:18px;margin-top:18px;
          border-top:1px solid var(--gray-100);
        }
        .av{
          width:40px;height:40px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;flex-shrink:0;
        }
        .an{font-size:14px;font-weight:700;color:var(--navy)}
        .ar{font-size:12px;color:var(--gray-500)}

        .cta-band{
          background:linear-gradient(135deg,var(--navy) 0%,var(--navy-md) 50%,#1549a8 100%);
          border-radius:var(--rl);padding:48px 44px;
          display:flex;align-items:center;justify-content:space-between;gap:32px;
          margin:56px 0 72px;position:relative;overflow:hidden;
          border:1px solid rgba(11,42,111,.2);
          box-shadow:var(--sh-lg);
        }
        .cta-band::before{
          content:'';position:absolute;right:-50px;top:-50px;
          width:220px;height:220px;background:rgba(245,130,32,.15);border-radius:50%;
        }
        .cta-band::after{
          content:'';position:absolute;left:0;bottom:0;width:100%;height:4px;
          background:linear-gradient(90deg,var(--orange),#ffb366);pointer-events:none;
        }
        @media(max-width:700px){.cta-band{flex-direction:column;text-align:center;padding:36px 24px;margin:40px 0 56px}}
        .cta-band-copy{position:relative;z-index:1}
        .cta-band h2{
          font-family:var(--serif);font-size:clamp(22px,3vw,32px);
          font-weight:700;color:var(--white);letter-spacing:-.02em;margin-bottom:8px;
        }
        .cta-band p{font-size:15px;color:rgba(255,255,255,.82);line-height:1.6;max-width:520px}
        .btn-wh{
          background:var(--white);color:var(--navy);font-family:var(--font);
          font-size:15px;font-weight:800;padding:14px 28px;border-radius:var(--r);
          border:1px solid rgba(255,255,255,.4);cursor:pointer;white-space:nowrap;
          flex-shrink:0;text-decoration:none;display:inline-block;
          transition:transform .15s var(--ease),box-shadow .2s var(--ease),filter .15s;
          box-shadow:0 10px 28px -12px rgba(0,0,0,.3);position:relative;z-index:1;
        }
        .btn-wh:hover{
          transform:translateY(-2px);
          box-shadow:0 16px 36px -12px rgba(0,0,0,.35);
          text-decoration:none;color:var(--navy-dk);filter:brightness(1.02);
        }

        @media(max-width:900px){.fc{position:relative;top:auto}}
        @media(max-width:640px){
          .fh{padding:18px 18px 16px}
          .fb{padding:20px 18px 26px}
          .fh-top h2{font-size:18px;line-height:1.25}
          .fbadge{align-self:flex-start}
          .btnp{margin-top:16px;padding:14px 16px;font-size:15px}
          .consent{font-size:12px;padding:0 2px}
          .sec{padding:52px 0}
          .sec-compact{padding:44px 0}
        }
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          .step-pane{animation:none!important}
        }
        @media(max-width:640px){
          input:not([type="checkbox"]):not([type="radio"]),select,textarea{min-height:46px;font-size:16px}
        }

        footer{border-top:1px solid var(--gray-200);padding:24px 0;background:var(--white)}
        .fin{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .fc-copy{font-size:13px;color:var(--gray-400)}
        .fl{display:flex;gap:16px;flex-wrap:wrap}
        .fl a{font-size:13px;color:var(--gray-400)}
        .fl a:hover{color:var(--gray-600);text-decoration:none}
      `;
