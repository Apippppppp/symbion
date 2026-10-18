<script setup>
defineProps({ modelValue: Boolean, label: String })
defineEmits(['update:modelValue'])
</script>
<template>
  <button
    type="button" role="switch" :aria-checked="modelValue" :aria-label="label"
    class="tgl" :data-on="modelValue" @click="$emit('update:modelValue', !modelValue)"
  ><span></span></button>
</template>
<style scoped>
.tgl { width: 52px; height: 32px; border-radius: 999px; border: 1px solid var(--color-border); background: var(--color-bg); cursor: pointer; padding: 3px; transition: background 160ms var(--ease-out); flex: 0 0 auto; }
.tgl span { display: block; width: 24px; height: 24px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform 180ms var(--ease-out); }
.tgl[data-on="true"] { background: var(--color-accent-green); border-color: var(--color-accent-green); }
.tgl[data-on="true"] span { transform: translateX(20px); }
@media (min-width: 1024px) { .tgl { width: 44px; height: 24px; padding: 2px; } .tgl span { width: 18px; height: 18px; } .tgl[data-on="true"] span { transform: translateX(20px); } }
</style>
