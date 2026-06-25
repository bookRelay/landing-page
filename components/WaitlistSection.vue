<script setup>
import { motion } from 'motion-v'
import WaitlistForm from './WaitlistForm.vue'
</script>

<template>
  <section id="waitlist" class="py-16 sm:py-24 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true }"
        :transition="{ duration: 0.5 }"
      >
        <h2 class="text-4xl sm:text-5xl font-bold text-ink leading-tight">
          {{ $t('waitlist.titleLine1') }}
          <span class="font-serif italic font-medium text-terra">{{ $t('waitlist.titleItalic') }}</span>
        </h2>
        <p class="font-serif italic text-ink/45 text-lg mt-4 max-w-lg leading-relaxed">
          {{ $t('waitlist.paragraph') }}
        </p>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true }"
        :transition="{ duration: 0.5, delay: 0.1 }"
      >
        <WaitlistForm />
      </motion.div>
    </div>
  </section>
</template>
