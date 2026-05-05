import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Save,
  Eye,
  EyeOff,
  TestTube,
  Loader2,
  CheckCircle,
  Settings2,
  Sparkles,
  Send,
  Mail,
  Globe,
  Shield,
} from 'lucide-react'
import api from '../utils/api'

const SECTIONS = [
  {
    id: 'api',
    icon: Sparkles,
    accent: 'from-violet-500/15 to-brand/10',
    ring: 'ring-violet-500/15',
    title: 'Claude API',
    desc: 'Anthropic key used for AI blog generation. Falls back to server ANTHROPIC_API_KEY if unset.',
    fields: [{ key: 'claude_api_key', label: 'API key', placeholder: 'sk-ant-api03-…', sensitive: true, fullWidth: true }],
  },
  {
    id: 'telegram',
    icon: Send,
    accent: 'from-sky-500/15 to-cyan-500/5',
    ring: 'ring-sky-500/15',
    title: 'Telegram',
    desc: 'Bot notifications for approvals and publishes.',
    fields: [
      { key: 'telegram_bot_token', label: 'Bot token', placeholder: '123456:ABC-…', sensitive: true },
      { key: 'telegram_chat_id', label: 'Chat ID', placeholder: '-1001234567890', sensitive: false },
    ],
  },
  {
    id: 'email',
    icon: Mail,
    accent: 'from-amber-500/12 to-orange-500/5',
    ring: 'ring-amber-500/15',
    title: 'Email (Resend)',
    desc: 'Used for admin login OTP only.',
    fields: [
      { key: 'resend_api_key', label: 'Resend API key', placeholder: 're_…', sensitive: true },
      { key: 'resend_from_email', label: 'From address', placeholder: 'Blog Admin <onboarding@resend.dev>', sensitive: false, fullWidth: true },
      { key: 'approval_email', label: 'Test inbox', placeholder: 'you@domain.com', sensitive: false },
    ],
  },
  {
    id: 'website',
    icon: Globe,
    accent: 'from-emerald-500/12 to-teal-500/5',
    ring: 'ring-emerald-500/15',
    title: 'Website publishing',
    desc: 'Public blog reads published posts from this backend. Site URL + API key are only needed if you POST/sync to another domain.',
    fields: [
      {
        key: 'website_url',
        label: 'Site base URL',
        placeholder: 'https://www.compare-bazaar.com',
        sensitive: false,
        fullWidth: true,
      },
      {
        key: 'website_api_key',
        label: 'Website API key',
        placeholder: 'Secret your public API expects',
        sensitive: true,
        fullWidth: true,
      },
    ],
  },
]

export const Settings = () => {
  const { toast } = useOutletContext()
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(null)
  const [showSecrets, setShowSecrets] = useState({})

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => {
        const vals = {}
        Object.entries(res.settings || {}).forEach(([key, s]) => {
          vals[key] = s.value || ''
        })
        setSettings(vals)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings', { settings })
      toast.success('Settings saved.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const testTelegram = async () => {
    setTesting('telegram')
    try {
      await api.post('/settings/test-telegram', {
        botToken: settings.telegram_bot_token,
        chatId: settings.telegram_chat_id,
      })
      toast.success('Telegram test message sent.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setTesting(null)
    }
  }

  const testEmail = async () => {
    setTesting('email')
    try {
      await api.post('/settings/test-email', {
        resendApiKey: settings.resend_api_key,
        resendFromEmail: settings.resend_from_email,
        testTo: settings.approval_email,
      })
      toast.success('Test email sent.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setTesting(null)
    }
  }

  const testClaude = async () => {
    setTesting('claude')
    try {
      const payload = {}
      const k = settings.claude_api_key
      if (k && k !== '••••••••') payload.apiKey = k
      const res = await api.post('/generate-blog/validate-key', payload)
      toast.success(res.message + (res.model ? ` (${res.model})` : ''))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setTesting(null)
    }
  }

  const renderTestButton = (section) => {
    if (section.id === 'api') {
      return (
        <button
          type="button"
          onClick={testClaude}
          disabled={!!testing}
          className="btn-secondary text-xs shrink-0"
          title="Uses key above or ANTHROPIC_API_KEY on the server"
        >
          {testing === 'claude' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TestTube className="w-3.5 h-3.5" />}
          Test key
        </button>
      )
    }
    if (section.id === 'telegram') {
      return (
        <button
          type="button"
          onClick={testTelegram}
          disabled={!!testing || !settings.telegram_bot_token || !settings.telegram_chat_id}
          className="btn-secondary text-xs shrink-0"
        >
          {testing === 'telegram' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TestTube className="w-3.5 h-3.5" />}
          Send test
        </button>
      )
    }
    if (section.id === 'email') {
      return (
        <button
          type="button"
          onClick={testEmail}
          disabled={!!testing || !settings.resend_api_key || !settings.resend_from_email || !settings.approval_email}
          className="btn-secondary text-xs shrink-0"
        >
          {testing === 'email' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TestTube className="w-3.5 h-3.5" />}
          Send test
        </button>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-gray-500">
        <Loader2 className="w-9 h-9 animate-spin text-brand" />
        <p className="text-sm">Loading settings…</p>
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-mid to-[#1a3558] text-white shadow-lg shadow-brand/15 ring-1 ring-white/10">
        <div className="absolute -right-20 -top-16 h-48 w-48 rounded-full bg-brand/20 blur-3xl pointer-events-none" aria-hidden />
        <div className="relative px-5 py-7 sm:px-8 sm:py-9 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex gap-4 min-w-0">
            <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/15 shrink-0">
              <Settings2 className="w-6 h-6 text-white/95" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/55">Configuration</p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-sm text-white/75 max-w-xl leading-relaxed">
                API keys and integrations for generation, login email, Telegram, and optional web publishing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-lg shadow-black/25 ring-1 ring-white/20 transition hover:bg-white/95 active:scale-[0.99] disabled:opacity-50 self-start sm:self-center"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save changes
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-950 dark:text-amber-100/90">
        <Shield className="w-5 h-5 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" aria-hidden />
        <p className="leading-relaxed">
          <span className="font-semibold">Secrets stay on the server.</span> Masked values mean a key is stored—paste a new key to replace
          it. Use Test buttons to verify each integration without publishing.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const Icon = section.icon
          return (
            <section
              key={section.id}
              className={`rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm ring-1 ${section.ring} dark:ring-white/5`}
            >
              <div className={`h-1 w-full bg-gradient-to-r ${section.accent}`} aria-hidden />
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex gap-3 min-w-0">
                    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5 text-brand shrink-0">
                      <Icon className="w-5 h-5" aria-hidden />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{section.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{section.desc}</p>
                    </div>
                  </div>
                  {renderTestButton(section)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                  {section.fields.map((field) => (
                    <div key={field.key} className={field.fullWidth ? 'sm:col-span-2' : ''}>
                      <label className="label" htmlFor={`set-${field.key}`}>
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          id={`set-${field.key}`}
                          type={field.sensitive && !showSecrets[field.key] ? 'password' : 'text'}
                          value={settings[field.key] || ''}
                          onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="input pr-10 w-full"
                          autoComplete={field.sensitive ? 'off' : 'on'}
                        />
                        {field.sensitive && (
                          <button
                            type="button"
                            onClick={() => setShowSecrets({ ...showSecrets, [field.key]: !showSecrets[field.key] })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-0.5 rounded"
                            aria-label={showSecrets[field.key] ? 'Hide value' : 'Show value'}
                          >
                            {showSecrets[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                      {settings[field.key] && settings[field.key] !== '••••••••' && (
                        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400/90">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
                          Value saved in database
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Bottom save */}
      <div className="sticky bottom-4 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 py-3.5 shadow-lg shadow-gray-900/10 dark:shadow-black/40">
        <p className="text-sm text-gray-500 dark:text-gray-400">Changes are not auto-saved.</p>
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save all changes
        </button>
      </div>
    </div>
  )
}
