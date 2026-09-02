import Script from 'next/script'

/** Alli AI site key for www.compare-bazaar.com (SEO automation widget). */
export const ALLI_SITE_ID = 'site_g1rqC7RWgfMT13tm'

/**
 * Loads Alli AI in &lt;head&gt; on every public page (beforeInteractive).
 * Applies only pre-approved on-page SEO recommendations from the Alli dashboard.
 */
export function AlliAiScript() {
  return (
    <Script
      id="alli-ai-widget"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function (w,d,s,o,f,js,fjs){w['AlliJSWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);}(window,document,'script','alli','https://static.alliai.com/widget/v1.js'));alli('init','${ALLI_SITE_ID}');alli('optimize','all');`,
      }}
    />
  )
}
