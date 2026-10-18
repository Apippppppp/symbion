<script setup>
import { ref } from 'vue'
const range = ref('7 hari')
const src = ref('Semua')
const done = ref('')
function exportCsv(e) { e.preventDefault(); done.value = `File CSV (${src.value}, ${range.value}) siap diunduh.` }
</script>
<template>
  <main class="page">
    <section class="card">
      <form class="form" @submit="exportCsv">
        <label class="field">Rentang tanggal
          <select v-model="range"><option>24 jam</option><option>7 hari</option><option>30 hari</option></select>
        </label>
        <label class="field">Sumber
          <select v-model="src"><option>Semua</option><option>POND_L</option><option>POND_R</option><option>Hidroponik</option></select>
        </label>
        <button class="btn btn-primary btn-full" type="submit">Export CSV</button>
      </form>
      <p v-if="done" class="muted" role="status">{{ done }}</p>
    </section>
    <section class="card"><h2 class="h2">Ringkasan panen</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Paralon</th><th>Umur</th><th>Estimasi panen</th></tr></thead>
        <tbody>
          <tr><td>HYDRO L1/L2</td><td class="num">18 hari</td><td class="num">±20 hari lagi</td></tr>
          <tr><td>HYDRO R1/R2</td><td class="num">25 hari</td><td class="num">±13 hari lagi</td></tr>
        </tbody>
      </table></div>
    </section>
  </main>
</template>
<style scoped>
.form { display: grid; gap: 12px; }
@media (min-width: 1024px) { .form { grid-template-columns: 1fr 1fr auto; align-items: end; } }
</style>
