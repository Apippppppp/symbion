<script setup>
defineProps({ label: String, value: [Number, String], unit: String, min: Number, max: Number, status: { type: String, default: 'ok' } })
const colorOf = (s) => s === 'critical' ? 'var(--color-danger)' : s === 'warning' ? 'var(--color-warn)' : 'var(--color-ok)'
</script>
<template>
  <div class="gauge">
    <svg viewBox="0 0 120 70" role="img" :aria-label="`${label} ${value} ${unit}`">
      <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="var(--color-border)" stroke-width="12" stroke-linecap="round" />
      <path d="M10 60 A50 50 0 0 1 110 60" fill="none" :stroke="colorOf(status)" stroke-width="12" stroke-linecap="round"
        :stroke-dasharray="`${Math.max(0, Math.min(1, (Number(value) - min) / (max - min))) * 157} 157`" />
    </svg>
    <p class="g-val num">{{ value }}<span>{{ unit }}</span></p>
    <p class="g-label">{{ label }}</p>
  </div>
</template>
<style scoped>
.gauge { text-align: center; min-width: 0; }
.gauge svg { width: 112px; max-width: 100%; }
.g-val { font-size: 18px; font-weight: 700; margin: 2px 0 0; color: var(--color-primary); }
.g-val span { font-size: 11px; font-weight: 500; color: var(--color-text-muted); margin-left: 2px; }
.g-label { font-size: 12px; color: var(--color-text-muted); margin: 0; }
@media (min-width: 1024px) { .gauge svg { width: 160px; } .g-val { font-size: 22px; } }
</style>
