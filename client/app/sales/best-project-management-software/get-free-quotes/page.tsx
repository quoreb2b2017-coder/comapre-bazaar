// @ts-nocheck
"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { CheckCircle, Clock3, KanbanSquare, ShieldCheck, Sparkles, Users } from 'lucide-react';

const FEATURE_OPTIONS = [
  'Task dependencies',
  'Gantt charts',
  'Automation rules',
  'Team workload view',
  'Client collaboration',
  'Time tracking',
];

export default function ProjectManagementGetQuotesPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    teamSize: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    currentTool: '',
    features: [],
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const captchaRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!captchaValue) return setError("Please verify you're not a robot.");

    setIsSubmitting(true);
    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) throw new Error('Web3Forms key missing');

      const payload = {
        access_key: accessKey,
        subject: 'Project Management Software Quote Request - Compare Bazaar',
        from_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phoneNumber,
        company_name: formData.companyName,
        team_size: formData.teamSize,
        project_type: formData.projectType,
        budget_range: formData.budgetRange,
        timeline: formData.timeline,
        current_tool: formData.currentTool,
        must_have_features: formData.features.join(', '),
        notes: formData.notes,
        form_source: 'Sales > Best Project Management Software > Get Free Quotes',
        captcha_token: captchaValue,
      };

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error('Submission failed');

      setSubmitted(true);
      setFormData({
        firstName: '', lastName: '', companyName: '', email: '', phoneNumber: '',
        teamSize: '', projectType: '', budgetRange: '', timeline: '', currentTool: '', features: [], notes: '',
      });
      setCaptchaValue(null);
      captchaRef.current?.reset();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff7ef] via-white to-white py-8 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/sales/best-project-management-software" className="text-sm text-[#b45309] hover:underline">
          ← Back to Project Management comparison
        </Link>

        <section className="mt-4 rounded-3xl overflow-hidden border border-[#f1dcc8] bg-white shadow-sm">
          <div className="relative px-6 sm:px-8 py-8 bg-gradient-to-r from-[#F78230] via-[#EC7A22] to-[#D96A08] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(255,255,255,0.2),transparent_55%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.18em] text-white/75 mb-2">Get Free Quotes</p>
              <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Find the right project management platform for your team
              </h1>
              <p className="mt-3 text-white/90 max-w-3xl">
                Compare pricing and capabilities across Monday, ClickUp, Asana, Jira, and more with expert-guided vendor matching.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30">No commitment</span>
                <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30">Independent recommendations</span>
                <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30">Fast response</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr]">
            <div className="p-6 sm:p-8">
              {submitted && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Thank you! Your request has been submitted. We will share matched options shortly.
                </div>
              )}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="firstName" value={formData.firstName} onChange={onChange} required placeholder="First name" className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none" />
                <input name="lastName" value={formData.lastName} onChange={onChange} required placeholder="Last name" className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none" />
                <input name="companyName" value={formData.companyName} onChange={onChange} required placeholder="Company name" className="sm:col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none" />
                <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="Work email" className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none" />
                <input name="phoneNumber" value={formData.phoneNumber} onChange={onChange} required placeholder="Phone number" className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none" />

                <select name="teamSize" value={formData.teamSize} onChange={onChange} required className="border border-gray-300 bg-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none">
                  <option value="">Team size</option><option>1-10</option><option>11-50</option><option>51-200</option><option>200+</option>
                </select>
                <select name="projectType" value={formData.projectType} onChange={onChange} required className="border border-gray-300 bg-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none">
                  <option value="">Primary project type</option><option>Marketing</option><option>Product</option><option>Software Development</option><option>Operations</option><option>Mixed</option>
                </select>
                <select name="budgetRange" value={formData.budgetRange} onChange={onChange} required className="border border-gray-300 bg-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none">
                  <option value="">Budget range</option><option>Under $100/mo</option><option>$100-$500/mo</option><option>$500-$1500/mo</option><option>$1500+/mo</option>
                </select>
                <select name="timeline" value={formData.timeline} onChange={onChange} required className="border border-gray-300 bg-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none">
                  <option value="">Implementation timeline</option><option>Immediately</option><option>Within 30 days</option><option>1-3 months</option><option>Exploring options</option>
                </select>

                <input name="currentTool" value={formData.currentTool} onChange={onChange} placeholder="Current tool (optional)" className="sm:col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none" />

                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Must-have features</p>
                  <div className="flex flex-wrap gap-2">
                    {FEATURE_OPTIONS.map((feature) => (
                      <button
                        type="button"
                        key={feature}
                        onClick={() => onFeatureToggle(feature)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          formData.features.includes(feature)
                            ? 'bg-[#F27F25] text-white border-[#F27F25]'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#F2B582]'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea name="notes" value={formData.notes} onChange={onChange} placeholder="Anything specific to your workflow?" className="sm:col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 min-h-24 focus:ring-2 focus:ring-[#FCE7D0] focus:border-[#F27F25] outline-none" />

                <div className="sm:col-span-2">
                  <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={setCaptchaValue} ref={captchaRef} />
                </div>

                <button type="submit" disabled={isSubmitting} className="sm:col-span-2 bg-gradient-to-r from-[#F78230] to-[#D96A08] text-white font-semibold rounded-lg py-3.5 hover:opacity-95 disabled:opacity-60 transition-all shadow-sm">
                  {isSubmitting ? 'Submitting...' : 'Get Free Quotes'}
                </button>
              </form>
            </div>

            <aside className="border-t lg:border-t-0 lg:border-l border-[#f1dcc8] bg-[#fffaf5] p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-[#1f2937]">Why this form works</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-[#f1dcc8] bg-white p-4">
                  <div className="flex items-center gap-2 text-[#9C4302] mb-1"><KanbanSquare className="w-4 h-4" /><span className="text-xs font-semibold uppercase">Smart Match</span></div>
                  <p className="text-sm text-gray-700">We shortlist vendors based on workflow complexity, team size, and budget.</p>
                </div>
                <div className="rounded-xl border border-[#f1dcc8] bg-white p-4">
                  <div className="flex items-center gap-2 text-[#9C4302] mb-1"><Clock3 className="w-4 h-4" /><span className="text-xs font-semibold uppercase">Save Time</span></div>
                  <p className="text-sm text-gray-700">Avoid manual research and compare the right platforms faster.</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#F27F25] mt-0.5" />Independent recommendations</li>
                <li className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-[#F27F25] mt-0.5" />No hidden charges for matching</li>
                <li className="flex items-start gap-2"><Users className="w-4 h-4 text-[#F27F25] mt-0.5" />Support for SMB to enterprise teams</li>
                <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-[#F27F25] mt-0.5" />Updated vendor benchmarks</li>
              </ul>

              <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                By submitting this form, you agree to our <Link href="/privacy-policy" className="underline hover:text-[#9C4302]">Privacy Policy</Link> and <Link href="/terms-of-use" className="underline hover:text-[#9C4302]">Terms of Use</Link>.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
