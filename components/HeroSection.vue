<script setup>
import { motion } from 'motion-v'
import PhoneFrame from './PhoneFrame.vue'
import PhoneVideo from './PhoneVideo.vue'
import swipeVideo from '~/assets/video/swipe.mp4'

function scrollToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="px-4 sm:px-6 pt-14 sm:pt-20 pb-10">
    <div class="max-w-7xl mx-auto">
      <div class="max-w-4xl mx-auto text-center">
        <motion.h1
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, ease: 'easeOut' }"
          class="text-5xl sm:text-7xl font-bold text-ink leading-[1.05] tracking-tight"
        >
          {{ $t('hero.titleLine1') }} <span class="font-serif italic font-medium text-terra">{{ $t('hero.titleMatch') }}</span><br />
          {{ $t('hero.titleLine2') }}<br />
          {{ $t('hero.titleLine3') }}
        </motion.h1>

        <motion.p
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.15, ease: 'easeOut' }"
          class="font-serif italic text-ink/45 text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed"
        >
          {{ $t('hero.paragraph') }}
        </motion.p>

        <motion.div
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.3, ease: 'easeOut' }"
          class="mt-8"
        >
          <button
            type="button"
            class="bg-terra hover:bg-terra/90 text-white text-base font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-terra/20"
            @click="scrollToWaitlist"
          >
            {{ $t('hero.cta') }}
          </button>
        </motion.div>
      </div>

      <motion.div
        :initial="{ opacity: 0, y: 40, scale: 0.96 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :transition="{ duration: 0.7, delay: 0.35, ease: 'easeOut' }"
        class="flex justify-center mt-12"
      >
        <PhoneFrame>
          <PhoneVideo :src="swipeVideo" />
        </PhoneFrame>
      </motion.div>
    </div>
  </section>
</template>
