<script setup>
import logoMark from '~/assets/images/logo-mark.png'

function scrollToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="border-b border-ink/8 bg-cream/90 backdrop-blur-sm sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img :src="logoMark" alt="Bookrelay" class="h-8 w-8" />
        <div class="leading-tight">
          <p class="font-semibold text-ink text-xl leading-none">Bookrelay</p>
          <p class="text-ink/45 text-sm leading-none mt-1">{{ $t('header.tagline') }}</p>
        </div>
      </div>

      <button
        type="button"
        class="hidden sm:inline-flex items-center gap-1.5 bg-sky/10 text-sky text-sm font-medium px-4 py-2 rounded-full border border-sky/20"
        @click="scrollToWaitlist"
      >
        {{ $t('header.comingSoon') }}
      </button>
    </div>
  </header>
</template>
