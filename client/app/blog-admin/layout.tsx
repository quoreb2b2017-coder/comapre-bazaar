import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Blog Admin',
}

const themeInlineInit = `
(function(){
  try {
    var v = localStorage.getItem('darkMode');
    var on = v === 'true' || v === '1';
    function apply(){
      document.documentElement.classList.toggle('dark', on);
      var root = document.querySelector('.blog-admin-root');
      if (root) root.classList.toggle('dark', on);
    }
    apply();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply);
    }
  } catch (e) {}
})();
`

export default function BlogAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="blog-admin-dark-sync" strategy="beforeInteractive">
        {themeInlineInit}
      </Script>
      <div className="blog-admin-root min-h-screen bg-gray-50 font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {children}
      </div>
    </>
  )
}
