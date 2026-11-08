<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { MapPin, Store, Mail } from 'lucide-vue-next'

const { t } = useI18n()

// Lo stesso indirizzo della pagina Aiuto dell'app. Sta qui e non nei testi
// tradotti: vue-i18n non accetta la chiocciola nelle stringhe (vedi README).
const CONTACT = ['bookrelay.hub', 'gmail.com'].join('@')
const mailto = computed(() => `mailto:${CONTACT}?subject=${encodeURIComponent(t('hub.partner.mailSubject'))}`)
</script>

<template>
  <!-- Hub Bookrelay: in arrivo per i lettori, in sviluppo per i locali (task #177) -->
  <section id="hub" class="py-16 sm:py-24 px-4 sm:px-6 border-b border-ink/8">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true }"
        :transition="{ duration: 0.5 }"
      >
        <span class="inline-flex items-center gap-1.5 bg-sky/10 text-sky text-sm font-medium px-4 py-2 rounded-full border border-sky/20">
          <MapPin :size="16" :stroke-width="1.5" />
          {{ $t('hub.badge') }}
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold text-ink leading-tight mt-5">
          {{ $t('hub.title') }}
        </h2>
        <p class="font-serif italic text-ink/45 text-lg mt-4 max-w-xl leading-relaxed">
          {{ $t('hub.text') }}
        </p>
        <p class="font-serif italic text-ink/60 text-lg mt-3 max-w-xl leading-relaxed">
          {{ $t('hub.text2') }}
        </p>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true }"
        :transition="{ duration: 0.5, delay: 0.1 }"
        class="bg-white border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-xl shadow-ink/5"
      >
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <p class="flex items-center gap-2 text-ink/50 text-xs font-semibold uppercase tracking-widest">
            <Store :size="16" :stroke-width="1.5" class="text-terra" />
            {{ $t('hub.partner.eyebrow') }}
          </p>
          <span class="bg-caramel/10 text-caramel text-xs font-semibold px-3 py-1 rounded-full border border-caramel/20">
            {{ $t('hub.partner.badge') }}
          </span>
        </div>

        <h3 class="font-serif italic text-ink font-medium text-2xl sm:text-3xl leading-snug mt-5">
          {{ $t('hub.partner.title') }}
        </h3>
        <p class="text-ink/55 text-base leading-relaxed mt-3">{{ $t('hub.partner.text') }}</p>
        <p class="text-ink/55 text-base leading-relaxed mt-2">{{ $t('hub.partner.text2') }}</p>

        <a
          :href="mailto"
          class="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-terra hover:bg-terra/90 active:scale-[0.98] text-white text-base font-semibold px-8 py-4 rounded-full transition shadow-lg shadow-terra/20"
        >
          <Mail :size="18" :stroke-width="1.5" />
          {{ $t('hub.partner.cta') }}
        </a>
      </motion.div>
    </div>
  </section>
</template>
