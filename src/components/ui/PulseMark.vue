<script setup>
defineProps({
  size: { type: Number, default: 28 },
  animate: { type: Boolean, default: true },
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    fill="none"
    class="ag-pulse-mark"
    :class="{ 'ag-pulse-mark--animate': animate }"
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="12" fill="var(--ag-primary)" />
    <path
      d="M6 25h6l3-9 6 17 4-13 3 5h14"
      stroke="var(--ag-surface)"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      class="ag-pulse-mark__line"
    />
  </svg>
</template>

<style scoped>
.ag-pulse-mark__line {
  stroke-dasharray: 70;
  stroke-dashoffset: 70;
}
.ag-pulse-mark--animate .ag-pulse-mark__line {
  animation: ag-pulse-draw 1.1s var(--ag-ease) forwards;
}
@keyframes ag-pulse-draw {
  to { stroke-dashoffset: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ag-pulse-mark__line { stroke-dashoffset: 0; animation: none; }
}
</style>
