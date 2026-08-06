'use client'

import { Check, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { createContext, useContext } from 'react'

export const QuoteFormEmbeddedContext = createContext(false)

export function QuoteFormProgress({ current, total }) {
  const pct = Math.min(100, Math.max(0, Math.round((current / total) * 100)))
  return (
    <div className="mb-4">
      <p className="mb-1 text-center text-xs font-semibold text-cb-orange">Progress: {pct}%</p>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cb-orange to-cb-orange-mid transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function QuoteFormStepTitle({ title, subtitle, center = true }) {
  return (
    <div className={`mb-3 ${center ? 'text-center' : ''}`}>
      <h2
        className={`font-serif text-base font-semibold leading-snug text-cb-orange sm:text-lg ${center ? 'mx-auto max-w-lg' : ''}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-1 text-xs leading-relaxed text-gray-500 ${center ? 'mx-auto max-w-md' : ''}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

export function QuoteFormOptionGrid({ children, cols = 3 }) {
  const colClass =
    cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1'
  return <div className={`grid ${colClass} gap-2`}>{children}</div>
}

function OptionIconBadge({ Icon, highlighted = true }) {
  if (!Icon) return null
  return (
    <span className="quote-form-icon-badge relative mb-2 flex h-11 w-11 shrink-0 items-center justify-center">
      <span
        className={`absolute inset-0 rounded-xl ${
          highlighted
            ? 'bg-gradient-to-br from-brand-light via-white to-blue-50 ring-2 ring-brand/30 shadow-[0_0_0_3px_rgba(29,78,216,0.14),0_3px_10px_-3px_rgba(29,78,216,0.35)]'
            : 'bg-brand-light/60 ring-1 ring-brand/20'
        }`}
        aria-hidden
      />
      <Icon className="relative h-[22px] w-[22px] text-brand" strokeWidth={1.9} aria-hidden />
    </span>
  )
}

export function QuoteFormRadioOption({ selected, onSelect, label, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex min-h-[90px] flex-col items-center justify-center rounded-xl border px-2 py-2.5 text-center transition-all duration-150 sm:min-h-[94px] ${
        selected
          ? 'border-2 border-cb-orange bg-cb-orange-light/60 shadow-sm ring-1 ring-cb-orange-ring'
          : 'border border-gray-200 bg-white hover:border-cb-orange-border hover:bg-cb-orange-soft/40'
      }`}
    >
      <OptionIconBadge Icon={Icon} highlighted />
      <span
        className={`text-[11px] font-semibold leading-tight sm:text-xs ${
          selected ? 'text-cb-orange' : 'text-navy'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export function QuoteFormCheckboxOption({ selected, onSelect, label, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex min-h-[90px] flex-col items-center justify-center rounded-xl border px-2 py-2.5 text-center transition-all duration-150 sm:min-h-[94px] ${
        selected
          ? 'border-2 border-cb-orange bg-cb-orange-light/60 shadow-sm ring-1 ring-cb-orange-ring'
          : 'border border-gray-200 bg-white hover:border-cb-orange-border hover:bg-cb-orange-soft/40'
      }`}
    >
      {selected ? (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cb-orange">
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} aria-hidden />
        </span>
      ) : null}
      <OptionIconBadge Icon={Icon} highlighted />
      <span
        className={`text-[11px] font-semibold leading-tight sm:text-xs ${
          selected ? 'text-cb-orange' : 'text-navy'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export function QuoteFormRadioGroup({ title, subtitle, cols = 3, options, value, onChange }) {
  return (
    <div>
      <QuoteFormStepTitle title={title} subtitle={subtitle} />
      <QuoteFormOptionGrid cols={cols}>
        {options.map((opt) => (
          <QuoteFormRadioOption
            key={opt.label}
            selected={value === opt.label}
            onSelect={() => onChange(opt.label)}
            label={opt.label}
            icon={opt.icon}
          />
        ))}
      </QuoteFormOptionGrid>
    </div>
  )
}

export function QuoteFormCheckboxGroup({ title, subtitle, cols = 3, options, values, onToggle }) {
  return (
    <div>
      <QuoteFormStepTitle title={title} subtitle={subtitle} />
      <QuoteFormOptionGrid cols={cols}>
        {options.map((opt) => (
          <QuoteFormCheckboxOption
            key={opt.label}
            selected={values.includes(opt.label)}
            onSelect={() => onToggle(opt.label)}
            label={opt.label}
            icon={opt.icon}
          />
        ))}
      </QuoteFormOptionGrid>
    </div>
  )
}

export function QuoteFormTextField({
  label,
  icon: Icon,
  error,
  hint,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={className}>
      {label ? <label className="mb-1 block text-xs font-semibold text-navy">{label}</label> : null}
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand"
            aria-hidden
          />
        ) : null}
        <input
          {...props}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-cb-orange focus:ring-2 focus:ring-cb-orange-ring ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200'} ${inputClassName}`}
        />
      </div>
      {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
      {hint && !error ? <p className="mt-1 text-[11px] text-gray-500">{hint}</p> : null}
    </div>
  )
}

export function QuoteFormCaptchaStep({ captchaRef, captchaValue, onChange }) {
  return (
    <div>
      <QuoteFormStepTitle title="Verify you're not a robot" />
      <div className="flex justify-center scale-90 origin-top sm:scale-100">
        {captchaValue ? (
          <div className="flex items-center gap-2 rounded-lg border border-cb-orange-border bg-cb-orange-light/60 px-4 py-2.5 ring-1 ring-cb-orange-ring">
            <span className="relative flex h-9 w-9 items-center justify-center">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-light via-white to-blue-50 ring-2 ring-brand/30" aria-hidden />
              <ShieldCheck className="relative h-5 w-5 text-brand" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-cb-orange">Verified</span>
          </div>
        ) : (
          <ReCAPTCHA ref={captchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={onChange} />
        )}
      </div>
    </div>
  )
}

export function QuoteFormNav({
  showBack,
  onBack,
  onNext,
  onSubmit,
  isLastStep,
  isValid,
  isSubmitting,
  nextLabel = 'Continue',
  submitLabel = 'Continue',
  backDisabled,
}) {
  const handlePrimary = isLastStep ? onSubmit : onNext

  return (
    <div className="mt-4 flex items-stretch gap-2 border-t border-gray-100 pt-3">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy-mid transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      <button
        type="button"
        onClick={handlePrimary}
        disabled={!isValid || isSubmitting}
        className={`h-10 flex-1 rounded-lg text-sm font-bold transition-all ${
          isValid && !isSubmitting
            ? 'bg-cb-orange text-white shadow-md hover:bg-cb-orange-hover active:scale-[0.99]'
            : 'cursor-not-allowed bg-gray-200 text-gray-400'
        }`}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center justify-center gap-1.5">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Submitting…
          </span>
        ) : isLastStep ? (
          submitLabel
        ) : (
          nextLabel
        )}
      </button>
    </div>
  )
}

export function QuoteFormSuccessToast({ onClose }) {
  return (
    <div className="fixed top-4 right-4 z-[100] max-w-sm animate-[slideInRight_0.45s_ease-out] rounded-xl border border-cb-orange-border bg-white p-3 shadow-xl">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cb-orange-light text-cb-orange">
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-sm text-navy">Thank you!</h3>
          <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
            Your submission was received. We&apos;ll match you with vendors shortly.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export function QuoteFormShell({
  totalSteps,
  currentStep,
  showSuccess,
  onCloseSuccess,
  onSubmit,
  isStepValid,
  isSubmitting,
  onBack,
  onNext,
  backDisabled,
  children,
}) {
  const embedded = useContext(QuoteFormEmbeddedContext)

  return (
    <div className={embedded ? 'quote-form-embedded w-full' : 'mx-auto flex w-full max-w-lg flex-col'}>
      {showSuccess ? <QuoteFormSuccessToast onClose={onCloseSuccess} /> : null}
      <form onSubmit={onSubmit} className="flex flex-col">
        <QuoteFormProgress current={currentStep} total={totalSteps} />
        <div className="min-h-0 flex-1">{children}</div>
        <QuoteFormNav
          showBack={currentStep > 1}
          onBack={onBack}
          onNext={onNext}
          onSubmit={onSubmit}
          isLastStep={currentStep === totalSteps}
          isValid={isStepValid()}
          isSubmitting={isSubmitting}
          backDisabled={backDisabled}
        />
      </form>
    </div>
  )
}
