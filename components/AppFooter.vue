<script setup>
import logoMark from '~/assets/images/logo-mark.png'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-ink/8 py-8 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <img :src="logoMark" alt="Bookrelay" class="h-6 w-6 opacity-70" />
        <span class="text-ink/50 text-base">Bookrelay</span>
      </div>

      <LanguageSwitcher />

      <p class="text-ink/35 text-sm">{{ $t('footer.rights', { year }) }}</p>
    </div>
  </footer>
</template>
