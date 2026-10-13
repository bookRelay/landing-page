// Da dove arriva chi si iscrive alla waitlist (Notion: "Admin 5/5 — Provenienza
// utenti"). Solo la prima provenienza, e solo quello che il link stesso dice:
// utm_* nei link di bio e post, il browser interno di un'app social (dall'user
// agent, che non si salva), il dominio da cui si è cliccato. Niente pixel né
// cookie di terzi. Il canale (Instagram, LinkedIn…) lo decide il backend
// dell'app, che legge queste colonne della tabella waitlist (migrazione 013).
//
// La stessa logica, per chi si registra direttamente nell'app, sta in
// Bookrealy-frontend/src/utils/attribution.js.

const KEY = 'bookrelay_attribution'

const IN_APP = [
  [/Instagram/i, 'instagram'],
  [/FBAN|FBAV|FB_IAB/i, 'facebook'],
  [/LinkedInApp/i, 'linkedin'],
  [/musical_ly|TikTok|BytedanceWebview/i, 'tiktok'],
]

const cut = (value, max) => (value ? String(value).trim().slice(0, max) || null : null)

function capture() {
  const params = new URLSearchParams(window.location.search)
  let referrerHost = null
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : ''
    if (host && !/(^|\.)bookrelay\.it$|^localhost$/.test(host)) referrerHost = host
  } catch { /* referrer non leggibile */ }

  return {
    utm_source:    cut(params.get('utm_source'), 60),
    utm_medium:    cut(params.get('utm_medium'), 60),
    utm_campaign:  cut(params.get('utm_campaign'), 100),
    referrer_host: cut(referrerHost, 100),
    in_app:        IN_APP.find(([re]) => re.test(navigator.userAgent))?.[1] ?? null,
    tracked:       true,
  }
}

// Prima visita vince: chi arriva da Instagram e torna giorni dopo scrivendo
// l'indirizzo a mano resta arrivato da Instagram.
export function useAttribution() {
  function get() {
    if (typeof window === 'undefined') return null
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
      if (saved) return saved
      const fresh = capture()
      localStorage.setItem(KEY, JSON.stringify(fresh))
      return fresh
    } catch {
      return capture()
    }
  }

  return { getAttribution: get }
}
