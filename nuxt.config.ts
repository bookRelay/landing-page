import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  // Static site generation — `npm run generate` outputs fully static HTML/JS
  // to .output/public, ready to be served by GitHub Pages (no Node server needed).
  ssr: true,
  nitro: {
    preset: 'static',
  },

  // Project page on GitHub Pages → https://<org>.github.io/landing-page/
  // Every asset/link must be prefixed with this base path or it 404s in production.
  app: {
    baseURL: '/landing-page/',
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'Bookrelay — Fai match con il libro giusto per te',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: "Bookrelay ti offre una selezione di libri pensata per te: esplora titoli esclusivi, salvali e scambia opinioni all'interno della community.",
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },

  modules: ['motion-v/nuxt', '@nuxtjs/i18n'],

  // Auto-detected from the visitor's browser/OS language (navigator.languages),
  // not from IP geolocation — that's the standard, privacy-friendly approach and
  // works perfectly on a static site with no backend. Falls back to Italian.
  // strategy: 'no_prefix' keeps a single URL (no /en/, /fr/... routes) — the
  // language switches client-side, which fits a small static landing page best.
  i18n: {
    baseUrl: '/landing-page/',
    defaultLocale: 'it',
    strategy: 'no_prefix',
    langDir: 'locales',
    locales: [
      { code: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'en', name: 'English',  file: 'en.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'es', name: 'Español',  file: 'es.json' },
      { code: 'zh', name: '中文',      file: 'zh.json' },
      { code: 'ja', name: '日本語',    file: 'ja.json' },
      { code: 'ko', name: '한국어',    file: 'ko.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'bookrelay_locale',
      alwaysRedirect: false,
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      googleScriptUrl: process.env.NUXT_PUBLIC_GOOGLE_SCRIPT_URL || '',
    },
  },

  devtools: { enabled: true },
})
