<script setup>
// All videos stay mounted and playing in the background — only opacity changes —
// so switching is an instant smooth crossfade with no reload/buffering stutter.
defineProps({
  sources: { type: Array, required: true }, // [{ key, src }]
  active: { type: String, required: true },
})
</script>

<template>
  <div class="relative w-full h-full">
    <video
      v-for="s in sources"
      :key="s.key"
      :src="s.src"
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
      :class="active === s.key ? 'opacity-100' : 'opacity-0'"
    />
  </div>
</template>
