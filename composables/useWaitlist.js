import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

function getSupabase(config) {
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) return null
  if (!supabaseClient) {
    supabaseClient = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  }
  return supabaseClient
}

// Apps Script web apps don't send CORS headers for the final redirected response,
// so we POST in 'no-cors' mode: the browser can't read the response, but the
// request still reaches the script and the row still gets appended.
// Content-Type must stay one of the CORS-safelisted values (text/plain) — the
// Apps Script side parses the JSON string from e.postData.contents regardless.
async function postToGoogleSheets(url, payload) {
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
}

export function useWaitlist() {
  const config = useRuntimeConfig()
  const { t } = useI18n()

  async function submitWaitlist({ firstName, lastName, email, interest }) {
    const supabase = getSupabase(config)
    const timestamp = new Date().toISOString()

    const tasks = [
      supabase
        ? supabase.from('waitlist').insert([{
            first_name: firstName,
            last_name:  lastName,
            email,
            interest,
          }])
        : Promise.reject(new Error('not configured')),

      config.public.googleScriptUrl
        ? postToGoogleSheets(config.public.googleScriptUrl, {
            first_name: firstName,
            last_name:  lastName,
            email,
            interest,
            created_at: timestamp,
          })
        : Promise.reject(new Error('not configured')),
    ]

    const [supabaseResult, sheetsResult] = await Promise.allSettled(tasks)

    // Surface a friendly message for the one error case worth telling the user about:
    // they already signed up (unique constraint on email).
    if (supabaseResult.status === 'fulfilled' && supabaseResult.value?.error?.code === '23505') {
      throw new Error(t('waitlist.form.errorDuplicate'))
    }

    const supabaseOk = supabaseResult.status === 'fulfilled' && !supabaseResult.value?.error
    const sheetsOk   = sheetsResult.status === 'fulfilled'

    if (!supabaseOk && !sheetsOk) {
      throw new Error(t('waitlist.form.errorGeneric'))
    }

    return { supabaseOk, sheetsOk }
  }

  return { submitWaitlist }
}
