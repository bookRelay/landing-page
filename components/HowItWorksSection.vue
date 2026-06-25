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
  <section class="bg-linear-to-br from-terra to-[#8C4640] py-16 sm:py-24 px-4 sm:px-6">
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
