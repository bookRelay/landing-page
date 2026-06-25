<script setup>
const { t, locale } = useI18n()

useHead({
  htmlAttrs: { lang: locale },
  title: computed(() => `Bookrelay — ${t('hero.titleLine1')} ${t('hero.titleMatch')} ${t('hero.titleLine2')} ${t('hero.titleLine3')}`),
  meta: [
    { name: 'description', content: computed(() => t('hero.paragraph')) },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-cream">
    <AppHeader />
    <main>
      <HeroSection />
      <HowItWorksSection />
      <WaitlistSection />
    </main>
    <AppFooter />
  </div>
</template>
