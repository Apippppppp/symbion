<script setup>
import { ref } from 'vue'
const saved = ref('')
function save(e) { e.preventDefault(); saved.value = 'Pengaturan tersimpan.' }
</script>
<template>
  <main class="page">
    <section class="card">
      <form class="form" @submit="save">
        <label class="field">Batas warning pH atas<input type="number" value="8.5" step="0.1" /></label>
        <label class="field">Batas warning suhu udara (°C)<input type="number" value="30" /></label>
        <label class="field">Batas warning DO (mg/L)<input type="number" value="3" step="0.1" /></label>
        <label class="field">Batas level air (cm)<input type="number" value="45" /></label>
        <button class="btn btn-primary btn-full" type="submit">Simpan</button>
      </form>
      <p v-if="saved" class="muted" role="status">{{ saved }}</p>
    </section>
  </main>
</template>
<style scoped>
.form { display: grid; gap: 12px; }
@media (min-width: 1024px) { .form { grid-template-columns: 1fr 1fr; } }
</style>
