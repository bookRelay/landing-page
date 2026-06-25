<template>
  <!--
    The aspect-ratio lives on the inner "screen" div, not the outer bezel —
    the bezel's padding (p-2.5, a flat 10px) would otherwise subtract unevenly
    from width vs. height and skew the ratio away from the intended value.
    The outer bezel just wraps the screen + padding, no explicit ratio needed.

    480/1064 matches the source videos' native 480×1164 frame, minus ~100px
    cropped off the bottom (the "jitter.video" watermark badge, measured ~87px tall).
    Matching the frame to the real footage means object-cover only ever crops
    vertically off the bottom — never stretches, never crops the sides.
  -->
  <div class="relative w-[280px] sm:w-[300px] rounded-[2.5rem] bg-ink p-2.5 shadow-2xl shrink-0">
    <!-- Notch -->
    <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-ink rounded-b-2xl z-10" />

    <!-- Screen -->
    <div class="relative w-full aspect-[480/1064] rounded-[2rem] overflow-hidden bg-cream">
      <slot />
    </div>
  </div>
</template>
