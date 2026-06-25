<script setup>
defineProps({
  src: { type: String, required: true },
})
</script>

<template>
  <video
    :src="src"
    autoplay
    loop
    muted
    playsinline
    class="w-full h-full object-cover object-top"
  />
</template>
