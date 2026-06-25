# Bookrelay — Landing Page

Landing page statica della waitlist di Bookrelay, sviluppata in **Nuxt 4** e pensata per
essere ospitata su **GitHub Pages** (repo di progetto `landing-page`).

## Stack

- Nuxt 4 (static generation — `ssr: true` + `nuxt generate`, nessun server Node in produzione)
- Tailwind CSS v4 (stessa palette brand del progetto principale: `terra`, `caramel`, `sky`, `cream`, `ink`)
- [motion-v](https://motion-vue.dev) (porting Vue della libreria Motion / ex Framer Motion) per le animazioni
- `@nuxtjs/i18n` per le traduzioni (7 lingue, rilevamento automatico dal browser)
- `@supabase/supabase-js` per il salvataggio degli iscritti alla waitlist
- `lucide-vue-next` per le icone (stesso set usato nell'app React)

## Lingue

Il sito è disponibile in **italiano, inglese, francese, spagnolo, cinese, giapponese e
coreano**. La lingua viene rilevata automaticamente dalla lingua del browser/sistema
del visitatore (`navigator.languages`, **non** dalla posizione geografica/IP — è il
metodo standard, funziona offline ed è più rispettoso della privacy). La scelta fatta
manualmente dal selettore nel footer viene ricordata in un cookie e ha sempre la
precedenza sul rilevamento automatico ai visite successive.

- Testi: `i18n/locales/{it,en,fr,es,zh,ja,ko}.json` — un file per lingua, stessa struttura di chiavi
- Per aggiungere una lingua: crea `i18n/locales/<codice>.json` copiando la struttura di `it.json`,
  poi aggiungilo all'array `locales` in `nuxt.config.ts`
- **Attenzione**: il carattere `@` non può comparire in nessuna stringa tradotta (vue-i18n lo
  interpreta come sintassi di "linked message" e la build fallisce) — per l'email di esempio nel
  form, infatti, lo username e il dominio sono due chiavi separate (`placeholderEmailUser` /
  `placeholderEmailDomain`) unite via JS in `WaitlistForm.vue`, non un'unica stringa con `@`
- Selettore lingua: `components/LanguageSwitcher.vue`, montato nel footer

## Sviluppo locale

```bash
npm install
cp .env.example .env   # poi compila le variabili (vedi sotto)
npm run dev            # http://localhost:3000/landing-page/
```

> Nota: il sito ha `app.baseURL: '/landing-page/'` configurato in `nuxt.config.ts`
> perché su GitHub Pages sarà servito da `https://<org>.github.io/landing-page/`.
> Anche in locale va quindi visitato con quel prefisso nell'URL.

```bash
npm run generate       # genera il sito statico in .output/public
npm run preview        # serve .output/public in locale per un check finale
```

## Variabili d'ambiente

| Variabile | Descrizione |
|---|---|
| `NUXT_PUBLIC_SUPABASE_URL` | URL del progetto Supabase (Project Settings → API) |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key del progetto Supabase |
| `NUXT_PUBLIC_GOOGLE_SCRIPT_URL` | URL del Web App di Google Apps Script (vedi guida sotto) |

Tutte e tre sono **pubbliche per natura** (vengono lette dal browser): l'anon key di
Supabase è protetta dalle Row Level Security policy (sotto), non da segretezza; l'URL
dell'Apps Script accetta solo `POST` e scrive su un foglio, non espone nulla.

Il form invia i dati **a entrambi** i sistemi in parallelo: se uno dei due non è
configurato (variabile vuota), viene semplicemente saltato senza errori.

---

## 1. Setup Supabase

1. Crea un progetto su [supabase.com](https://supabase.com) (o usa quello già esistente di Bookrelay).
2. Vai su **SQL Editor** e esegui:

```sql
create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name  text not null,
  email      text not null unique,
  interest   text,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Chiunque può INSERIRE una riga (necessario per il form pubblico),
-- nessuno può leggerla via API pubblica: niente policy di SELECT per "anon".
create policy "Allow public insert"
  on public.waitlist
  for insert
  to anon
  with check (true);
```

3. Vai su **Project Settings → API** e copia **Project URL** e **anon public key**
   in `NUXT_PUBLIC_SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Per consultare gli iscritti: **Table Editor → waitlist** nella dashboard Supabase
   (vista tabellare, esportabile in CSV — utile anche per i colleghi con accesso al progetto).

---

## 2. Setup Google Sheets (guida dettagliata)

Questo permette ai colleghi di consultare/aggiornare la lista iscritti direttamente
da un Google Sheet, senza accesso a Supabase. Va fatto **una sola volta**, dall'account
Google di Bookrelay.

### Passo 1 — Crea il foglio Google

1. Vai su [sheets.google.com](https://sheets.google.com) con l'account Google di Bookrelay.
2. Crea un nuovo foglio, chiamalo ad es. **"Bookrelay — Waitlist"**.
3. Nella prima riga inserisci le intestazioni delle colonne:

   | A | B | C | D | E |
   |---|---|---|---|---|
   | Data | Nome | Cognome | Email | Funzione di interesse |

### Passo 2 — Apri l'editor di Apps Script

1. Nel foglio, vai su **Estensioni → Apps Script** (in alto nel menu).
2. Si apre un nuovo tab con l'editor di script collegato a questo foglio specifico.
3. Cancella il contenuto di default del file `Code.gs` e incolla questo codice:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.created_at || new Date().toISOString(),
    data.first_name || '',
    data.last_name  || '',
    data.email      || '',
    data.interest   || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Salva il progetto (icona del dischetto, o `Ctrl+S`). Dagli un nome quando richiesto,
   ad es. "Waitlist Web App".

### Passo 3 — Pubblica come Web App

1. In alto a destra, clicca su **Esegui distribuzione → Nuova distribuzione**
   ("Deploy → New deployment").
2. Clicca sull'icona a forma di ingranaggio accanto a "Seleziona tipo" e scegli
   **App web** ("Web app").
3. Configura così:
   - **Descrizione**: "Waitlist form" (libero)
   - **Esegui come**: **Io** (il tuo account — è l'account che scrive sul foglio)
   - **Chi ha accesso**: **Chiunque** ("Anyone") — *necessario*, altrimenti il sito
     pubblico non potrà chiamare l'endpoint
4. Clicca **Distribuisci** ("Deploy").
5. Google chiederà di **autorizzare l'accesso**: clicca **Autorizza accesso**, scegli
   l'account Bookrelay, poi nella schermata "Google non ha verificato questa app"
   clicca **Avanzate** → **Vai a "Waitlist Web App" (non sicuro)**. È normale per
   script personali non pubblicati sul marketplace: l'app è tua, non di terzi.
6. Concedi il permesso di modificare i fogli Google quando richiesto.
7. Copia l'**URL dell'app web** che appare (è nel formato
   `https://script.google.com/macros/s/AKfycb.../exec`).

### Passo 4 — Collega l'URL al sito

Metti l'URL copiato in:
- `.env` locale → `NUXT_PUBLIC_GOOGLE_SCRIPT_URL=...` (per testare in dev)
- **Secret della repo GitHub** → `NUXT_PUBLIC_GOOGLE_SCRIPT_URL` (per il deploy, vedi sezione sotto)

### Passo 5 — Testa che funzioni

Compila il form sul sito (in locale con `npm run dev`, oppure dopo il deploy) e
controlla che una nuova riga compaia nel foglio Google entro qualche secondo.

### Note di manutenzione

- **Se modifichi il codice di `Code.gs`** in futuro, devi creare una **nuova versione**
  della distribuzione: Esegui distribuzione → Gestisci distribuzioni → icona matita →
  cambia versione su "Nuova versione" → Distribuisci. L'URL resta lo stesso.
- **Per dare accesso ai colleghi**: condividi il Google Sheet normalmente (pulsante
  **Condividi** in alto a destra), non serve dare accesso ad Apps Script.
- Se l'URL viene rigenerato (nuova distribuzione invece di nuova versione), va
  aggiornato anche nel secret GitHub e si deve rifare il deploy.

---

## 3. Deploy su GitHub Pages

Il workflow in `.github/workflows/deploy.yml` builda e pubblica automaticamente ad
ogni push su `main`.

### Setup iniziale (una sola volta)

1. Crea la repo GitHub **`landing-page`** sotto il profilo/organizzazione Bookrelay.
2. Vai su **Settings → Pages** della repo e in **Source** seleziona
   **GitHub Actions** (non "Deploy from a branch").
3. Vai su **Settings → Secrets and variables → Actions** e crea questi 3 *repository secrets*:
   - `NUXT_PUBLIC_SUPABASE_URL`
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NUXT_PUBLIC_GOOGLE_SCRIPT_URL`
4. Inizializza git in questa cartella e fai il primo push:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<org-bookrelay>/landing-page.git
git push -u origin main
```

5. Il workflow parte automaticamente. Dopo ~1 minuto il sito sarà live su:

   ```
   https://<org-bookrelay>.github.io/landing-page/
   ```

### Deploy successivi

Basta pushare su `main` — il workflow rigenera e ripubblica il sito automaticamente.

---

## Struttura progetto

```
landing-page/
├── assets/
│   ├── css/main.css         ← Tailwind v4 + font + palette brand
│   └── images/logo-mark.png ← stesso marchio dell'app React
├── components/
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── HeroSection.vue
│   ├── HowItWorksSection.vue
│   ├── WaitlistSection.vue
│   ├── WaitlistForm.vue
│   ├── PhoneFrame.vue        ← bezel telefono riutilizzabile
│   ├── PhoneVideo.vue        ← video singolo in loop dentro PhoneFrame (Hero)
│   └── StepVideoStack.vue    ← 3 video sovrapposti con crossfade (Come funzionerà)
├── composables/
│   └── useWaitlist.js        ← invio dual-write Supabase + Google Sheets
├── assets/video/              ← swipe.mp4, Registrati.mp4, Leggi.mp4, Condividi.mp4
├── .github/workflows/deploy.yml
├── nuxt.config.ts
└── .env.example
```

**Video nei telefoni**: la Hero mostra `swipe.mp4` in loop. La sezione "Come
funzionerà" mostra i 3 video step (`Registrati.mp4` / `Leggi.mp4` / `Condividi.mp4`)
sovrapposti in `StepVideoStack`: sono tutti montati e in riproduzione contemporaneamente,
solo l'opacità cambia, così il passaggio da un video all'altro è una dissolvenza
istantanea senza ricaricamento. Passa il mouse (o tocca su mobile) su uno step per
selezionarne il video — resta selezionato finché non scegli un altro step.
