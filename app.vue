<script setup>
const { t, locale } = useI18n()

useHead({
  htmlAttrs: { lang: locale },
  title: computed(() => `Bookrelay — ${t('hero.titleLine1')} ${t('hero.titleMatch')} ${t('hero.titleLine2')} ${t('hero.titleLine3')}`),
  meta: [
    { name: 'description', content: computed(() => t('hero.paragraph')) },
  ],
})

// Provenienza letta all'arrivo: cambiando lingua l'indirizzo perde gli utm.
const { getAttribution } = useAttribution()
onMounted(getAttribution)
</script>

<template>
  <div class="min-h-screen bg-cream">
    <AppHeader />
    <main>
      <HeroSection />
      <HowItWorksSection />
      <HubSection />
      <WaitlistSection />
    </main>
    <AppFooter />
  </div>
</template>
