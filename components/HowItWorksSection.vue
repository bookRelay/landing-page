<script setup>
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import PhoneFrame from './PhoneFrame.vue'
import StepVideoStack from './StepVideoStack.vue'
import registratiVideo from '~/assets/video/Registrati.mp4'
import leggiVideo from '~/assets/video/Leggi.mp4'
import condividiVideo from '~/assets/video/Condividi.mp4'

const { t } = useI18n()

const stepKeys = ['registrati', 'leggi', 'condividi']

// computed (not a static const) so step titles/text re-render when the locale changes
const steps = computed(() => stepKeys.map((key, i) => ({
  n: String(i + 1),
  key,
  title: t(`howItWorks.steps.${key}.title`),
  text: t(`howItWorks.steps.${key}.text`),
})))

const videoSources = [
  { key: 'registrati', src: registratiVideo },
  { key: 'leggi',      src: leggiVideo },
  { key: 'condividi',  src: condividiVideo },
]

// Hover (or tap, on touch devices) selects a step's video and it stays
// selected until another step is hovered/tapped — no revert on mouseleave.
const activeStep = ref('registrati')
</script>

<template>
  <!--
    `overflow-x-clip` non e' decorativo: e' il recinto dell'animazione qui sotto.

    La colonna del telefono entra da destra (`:initial="{ x: 24 }"`), quindi
    prima di partire sta 24px fuori posto. Su desktop avanza margine e non si
    nota; su un telefono il padding laterale e' 16px, quindi 24 - 16 = 8px
    sbordano dalla finestra. Misurato su quattro larghezze (390, 412, 430,
    480): scrollWidth superava clientWidth di 8-9px su tutte.

    Otto pixel sembrano niente e non lo sono: rendono la pagina trascinabile di
    lato. Il lettore sposta la pagina con un dito senza volerlo, il titolo e le
    card escono dal bordo, e sembra che il sito sia rotto — mentre a essere
    fuori posto e' solo la finestra.

    `clip` e non `hidden`: `hidden` farebbe di questa sezione un contenitore di
    scorrimento, e un contenitore di scorrimento rompe `position: sticky` di
    qualunque cosa ci finisca dentro un domani. `clip` taglia e basta.

    Si taglia QUI e non sul body: un `overflow-x` globale spegnerebbe anche il
    prossimo sbordo, che nessuno vedrebbe piu' arrivare.
  -->
  <section class="overflow-x-clip bg-linear-to-br from-terra to-[#8C4640] py-16 sm:py-24 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <motion.p
          :initial="{ opacity: 0, y: 12 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :in-view-options="{ once: true }"
          :transition="{ duration: 0.5 }"
          class="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3"
        >
          {{ $t('howItWorks.label') }}
        </motion.p>

        <motion.h2
          :initial="{ opacity: 0, y: 12 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :in-view-options="{ once: true }"
          :transition="{ duration: 0.5, delay: 0.1 }"
          class="text-4xl sm:text-5xl font-bold text-white leading-tight mb-10"
        >
          {{ $t('howItWorks.titleLine1') }}<br />
          <span class="font-serif italic font-normal text-white/85">{{ $t('howItWorks.titleItalic') }}</span>
        </motion.h2>

        <div class="space-y-4">
          <motion.button
            v-for="(step, i) in steps"
            :key="step.n"
            type="button"
            :initial="{ opacity: 0, y: 16 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="{ once: true }"
            :transition="{ duration: 0.5, delay: 0.15 * i }"
            class="w-full text-left bg-cream rounded-2xl p-6 flex gap-4 transition-shadow duration-300 cursor-pointer"
            :class="activeStep === step.key ? 'ring-2 ring-white/70 shadow-lg' : ''"
            @mouseenter="activeStep = step.key"
            @click="activeStep = step.key"
          >
            <span class="font-serif italic text-terra text-xl font-medium shrink-0">{{ step.n }}</span>
            <div>
              <p class="font-serif italic text-ink font-medium text-lg mb-1">{{ step.title }}</p>
              <p class="text-ink/55 text-base leading-relaxed">{{ step.text }}</p>
            </div>
          </motion.button>
        </div>
      </div>

      <motion.div
        :initial="{ opacity: 0, x: 24 }"
        :while-in-view="{ opacity: 1, x: 0 }"
        :in-view-options="{ once: true }"
        :transition="{ duration: 0.6 }"
        class="flex justify-center"
      >
        <PhoneFrame>
          <StepVideoStack :sources="videoSources" :active="activeStep" />
        </PhoneFrame>
      </motion.div>
    </div>
  </section>
</template>
