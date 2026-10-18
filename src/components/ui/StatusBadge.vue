<script setup>
import { statusLabel } from '../../composables/useThresholds.js'
defineProps({ status: { type: String, default: 'ok' } })
</script>
<template>
  <span class="badge" :data-s="status"><i></i>{{ statusLabel[status] ?? status }}</span>
</template>
<style scoped>
.badge { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid var(--color-border); background: var(--color-bg); }
.badge i { width: 8px; height: 8px; border-radius: 50%; background: var(--color-offline); }
.badge[data-s="ok"] i { background: var(--color-ok); }
.badge[data-s="warning"] i { background: var(--color-danger); }
.badge[data-s="warning"] { border-color: color-mix(in srgb, var(--color-danger) 28%, var(--color-border)); background: color-mix(in srgb, var(--color-danger) 10%, var(--color-surface)); color: var(--color-danger); }
.badge[data-s="critical"] i { background: var(--color-danger); }
@media (min-width: 1024px) { .badge { height: 24px; } }
</style>
