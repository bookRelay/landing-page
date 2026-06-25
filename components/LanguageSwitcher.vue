<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Globe, ChevronUp } from 'lucide-vue-next'
import { AnimatePresence, motion } from 'motion-v'

const { locale, locales, setLocale } = useI18n()

const open = ref(false)
const rootRef = ref(null)

const availableLocales = computed(() => locales.value)
const current = computed(() => availableLocales.value.find((l) => l.code === locale.value))

function toggle() {
  open.value = !open.value
}

function select(code) {
  setLocale(code)
  open.value = false
}

function handleClickOutside(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="flex items-center gap-1.5 text-ink/45 hover:text-ink/75 text-sm transition-colors duration-200"
      :aria-label="$t('footer.language')"
      @click="toggle"
    >
      <Globe :size="14" :stroke-width="1.5" />
      <span>{{ current?.name }}</span>
      <ChevronUp
        :size="12"
        :stroke-width="1.5"
        class="transition-transform duration-200"
        :class="open ? '' : 'rotate-180'"
      />
    </button>

    <AnimatePresence>
      <motion.div
        v-if="open"
        :initial="{ opacity: 0, y: 8, scale: 0.96 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: 8, scale: 0.96 }"
        :transition="{ duration: 0.22, ease: 'easeOut' }"
        class="absolute bottom-full mb-2 right-0 sm:right-auto sm:left-0 bg-white border border-ink/10 rounded-2xl shadow-xl overflow-hidden py-1.5 min-w-40 z-40 origin-bottom"
      >
        <button
          v-for="l in availableLocales"
          :key="l.code"
          type="button"
          class="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150"
          :class="l.code === locale ? 'text-terra font-medium bg-terra/6' : 'text-ink/65 hover:bg-ink/5'"
          @click="select(l.code)"
        >
          {{ l.name }}
        </button>
      </motion.div>
    </AnimatePresence>
  </div>
</template>
