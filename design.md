# DESIGN.MD — Dashboard Bioponik (Akuaponik Greenhouse Tenaga Surya)

> Dokumen desain ini disusun berdasarkan gambar rancangan greenhouse bioponik (Tampak Depan, Tampak Atas, Tampak Samping, Detail Hidroponik, Detail Kolam Ikan). Semua angka dimensi diambil langsung dari gambar.

> **WAJIB: Dashboard ini dibangun menggunakan Vue.js (Vue 3 + Composition API + `<script setup>`).** Seluruh section, card, dan teks harus **responsive** untuk **mobile** dan **desktop** (ukuran, posisi, dan layout dijabarkan di Bagian 7.4 dan 7.5). Pendekatan: **mobile-first**.

## Tech Stack Ringkas

| Kebutuhan | Teknologi |
|---|---|
| Framework | **Vue.js 3** (Composition API, `<script setup>`) |
| Build tool | Vite |
| Routing | Vue Router 4 |
| State management | Pinia |
| Styling | Tailwind CSS (mobile-first) + CSS variables untuk design token |
| Grafik | Apache ECharts via `vue-echarts` |
| Utility responsive | VueUse (`useBreakpoints`, `useMediaQuery`) |
| Realtime | WebSocket / MQTT over WebSocket (`mqtt.js`) |
| Ikon | Lucide (`lucide-vue-next`) |

---

## 1. Ringkasan Sistem

Sistem **bioponik / akuaponik**: budidaya **ikan lele** di kolam dan **sayuran (selada)** secara hidroponik pada paralon PVC kotak, dalam satu greenhouse berdinding transparan dengan atap panel surya.

| Item | Nilai |
|---|---|
| Luas tanah | **12 m x 10 m** |
| Luas terpakai (bangunan) | **8 m x 5 m** |
| Tinggi atap | **3 – 4 m** |
| Struktur | Rangka logam, dinding & atap transparan (polycarbonate/kaca) |
| Atap | Bentuk pelana (gable) dengan **solar panel** di salah satu sisi |
| Ventilasi | **Exhaust fan** di dinding depan bagian atas |
| Lantai | Paving blok + **grating (kisi besi)** di jalur tengah |
| Komoditas ikan | **Ikan Lele** |
| Komoditas tanaman | Selada (sayuran daun) |

---

## 2. Spesifikasi Fisik (Sumber Data Dashboard)

### 2.1 Denah / Layout (Tampak Atas)

Lebar total 8 m dibagi 3 zona memanjang (arah 5 m):

```
|<---- 3 m ---->|<-- 2 m -->|<---- 3 m ---->|   = 8 m (luas terpakai)
+---------------+-----------+---------------+  ---
|  KOLAM KIRI   |  JALUR    |  KOLAM KANAN  |   ^
|  + 2 paralon  | (grating) |  + 2 paralon  |   | 5 m
|  hidroponik   |           |  hidroponik   |   | (luas terpakai)
|               |           |   [Filter][P] |   v
+---------------+-----------+---------------+  ---
```

| Zona | Lebar | Isi |
|---|---|---|
| Kiri | 3 m | 1 kolam ikan lele + 2 paralon PVC kotak hidroponik (posisi sejajar) |
| Tengah | 2 m | Jalur jalan (grating besi) |
| Kanan | 3 m | 1 kolam ikan lele + 2 paralon PVC kotak hidroponik (posisi sejajar) + area peralatan |

### 2.2 Komponen Utama

| ID | Komponen | Keterangan dari gambar |
|---|---|---|
| `POND_L` | Kolam Ikan Lele Kiri | Rangka logam + dinding kaca/akrilik transparan |
| `POND_R` | Kolam Ikan Lele Kanan | Sama dengan kiri |
| `HYDRO_L1`, `HYDRO_L2` | Paralon PVC kotak kiri | 2 paralon sejajar, di atas kolam kiri |
| `HYDRO_R1`, `HYDRO_R2` | Paralon PVC kotak kanan | 2 paralon sejajar, di atas kolam kanan |
| `FILTER` | Tabung filter biru | Di ujung kolam kanan (sisi depan) |
| `PUMP` | Pompa + pipa PVC putih/hitam | Sirkulasi air kolam ↔ hidroponik |
| `SOLAR` | Panel surya | Atap sisi miring |
| `FAN` | Exhaust fan | Dinding depan atas (tengah) |

### 2.3 Ukuran Vertikal

| Parameter | Nilai |
|---|---|
| Jarak paralon hidroponik dari permukaan kolam | **80 – 100 cm** |
| Kedalaman kolam dari permukaan tanah | **0 – 50/70 cm** |
| Tinggi atap | **3 – 4 m** |

---

## 3. Tujuan Dashboard

1. Memantau kondisi **air kolam ikan lele** secara real-time.
2. Memantau **nutrisi & aliran** pada 4 paralon hidroponik.
3. Memantau **iklim greenhouse** (suhu, kelembapan, cahaya).
4. Memantau **energi surya** (produksi, baterai, konsumsi).
5. Mengontrol **aktuator** (pompa, fan, aerator, lampu) manual/otomatis.
6. Memberi **alert** saat parameter di luar batas aman.

**Pengguna:** petani/operator (mobile-first), pemilik/manajer (laporan).

---

## 4. Sensor & Parameter Monitoring

### 4.1 Kolam Ikan (per kolam: `POND_L`, `POND_R`)

| Parameter | Satuan | Rentang Ideal (lele) | Warning | Critical |
|---|---|---|---|---|
| Suhu air | °C | 26 – 30 | <24 / >32 | <22 / >34 |
| pH | – | 6.5 – 8.0 | <6.2 / >8.5 | <5.5 / >9.0 |
| DO (oksigen terlarut) | mg/L | ≥ 4 | < 3 | < 2 |
| Amonia (NH3/NH4) | ppm | < 0.5 | > 1 | > 2 |
| Nitrit (NO2) | ppm | < 0.5 | > 1 | > 2 |
| Nitrat (NO3) | ppm | 5 – 150 | > 200 | > 300 |
| Level air | cm | 50 – 70 | < 45 | < 35 |
| Kekeruhan (opsional) | NTU | rendah | tinggi | – |

### 4.2 Hidroponik (per paralon: `HYDRO_L1`, `HYDRO_L2`, `HYDRO_R1`, `HYDRO_R2`)

| Parameter | Satuan | Rentang Ideal (selada) |
|---|---|---|
| pH larutan | – | 5.8 – 6.5 |
| EC / TDS | mS/cm / ppm | 0.8 – 1.5 / 560 – 1050 |
| Suhu larutan | °C | 18 – 24 |
| Debit/aliran | L/menit | sesuai pompa |
| Umur tanam | hari | target panen 30 – 45 |

### 4.3 Iklim Greenhouse

| Parameter | Satuan | Rentang Ideal |
|---|---|---|
| Suhu udara | °C | 22 – 30 |
| Kelembapan udara | % | 60 – 80 |
| Intensitas cahaya | lux | 10.000 – 40.000 |
| Status fan | on/off, rpm | – |

### 4.4 Energi Surya

| Parameter | Satuan |
|---|---|
| Daya panel (produksi) | W |
| Tegangan & arus panel | V / A |
| Energi harian | kWh |
| Kapasitas baterai (SoC) | % |
| Konsumsi beban (pompa, fan, aerator) | W |

---

## 5. Aktuator & Kontrol

| Aktuator | Mode | Kontrol |
|---|---|---|
| Pompa sirkulasi | Auto / Manual / Jadwal | Toggle, jadwal on/off, siklus (mis. 15 mnt on / 15 mnt off) |
| Aerator kolam | Auto (berdasar DO) / Manual | Toggle |
| Exhaust fan | Auto (berdasar suhu) / Manual | Toggle, ambang suhu |
| Pompa pengisi air | Auto (berdasar level) / Manual | Toggle |
| Pemberi pakan (opsional) | Jadwal | Waktu & jumlah |

Aturan otomasi contoh:
- Jika `DO < 3 mg/L` → aerator ON + alert.
- Jika `suhu udara > 30 °C` → fan ON.
- Jika `level air < 45 cm` → pompa pengisi ON.
- Jika `SoC baterai < 20%` → matikan beban non-esensial + alert.

---

## 6. Arsitektur Informasi (Halaman)

```
Dashboard
├── 1. Overview (Ringkasan)
├── 2. Denah Greenhouse (Digital Twin)
├── 3. Kolam Ikan
├── 4. Hidroponik
├── 5. Iklim & Ventilasi
├── 6. Energi Surya
├── 7. Kontrol & Otomasi
├── 8. Alert & Notifikasi
├── 9. Laporan & Riwayat
└── 10. Pengaturan
```

### 6.1 Overview
- **Kartu KPI** (baris atas): Suhu Air, pH Air, DO, Suhu Udara, Kelembapan, Daya Surya, SoC Baterai.
- **Status Sistem**: Normal / Warning / Critical (badge besar).
- **Grafik tren 24 jam**: suhu air, pH, DO.
- **Ringkasan aktuator**: pompa, fan, aerator (indikator on/off).
- **Alert terbaru** (5 teratas).

### 6.2 Denah Greenhouse (Digital Twin)
Visual top-down yang **meniru gambar Tampak Atas**:
- Persegi panjang 8 : 5 (rasio 1.6 : 1).
- Zona kiri (3/8), tengah (2/8), kanan (3/8).
- Setiap kolam = persegi biru gelap dengan 2 paralon putih memanjang di atasnya.
- Jalur tengah = pola grid abu-abu.
- Ikon filter (biru) + pompa di pojok kanan bawah.
- Panel surya sebagai strip biru di bagian atas denah.
- **Titik sensor interaktif** (pin): hover/tap → tooltip nilai + status warna.
- Warna pin: hijau (normal), kuning (warning), merah (critical), abu (offline).
- Toggle layer: *Ikan*, *Hidroponik*, *Iklim*, *Energi*.

### 6.3 Kolam Ikan
- Pemilih kolam: **Kiri / Kanan / Bandingkan**.
- Gauge: suhu, pH, DO, amonia, level air.
- Visual **penampang kolam** dengan indikator level (0 – 50/70 cm).
- Grafik riwayat (1 jam / 24 jam / 7 hari / 30 hari).
- Log pakan & kematian ikan (opsional), estimasi biomassa.

### 6.4 Hidroponik
- Grid 4 kartu (`HYDRO_L1`, `L2`, `R1`, `R2`): pH, EC, suhu, aliran, umur tanam.
- Progress bar siklus tanam → estimasi tanggal panen.
- Catatan nutrisi & jadwal perawatan.

### 6.5 Iklim & Ventilasi
- Grafik suhu/kelembapan/cahaya.
- Kontrol fan + ambang otomatis.

### 6.6 Energi Surya
- Grafik produksi vs konsumsi (harian/bulanan).
- Indikator baterai (SoC), estimasi runtime.
- Total kWh dan penghematan.

### 6.7 Kontrol & Otomasi
- Daftar aktuator dengan toggle & pilihan mode.
- Editor aturan (IF–THEN) dan jadwal.
- Log aksi (siapa, kapan, apa).

### 6.8 Alert & Notifikasi
- Daftar alert dengan filter severity, status (aktif/selesai), area.
- Aksi: acknowledge, snooze, lihat sumber.
- Kanal notifikasi: push, WhatsApp/Telegram, email.

### 6.9 Laporan
- Export CSV/PDF, rentang tanggal, per kolam/paralon.
- Ringkasan panen & performa ikan.

### 6.10 Pengaturan
- Ambang batas parameter, kalibrasi sensor, pengguna & peran, perangkat (IoT).

---

## 7. Desain Visual (UI Style)

Gaya mengikuti gambar: **bersih, modern, teknis-hijau** — kartu putih, label biru tua, aksen hijau.

### 7.1 Palet Warna

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary` | `#0F2A47` | Judul/header (biru tua seperti label "TAMPAK DEPAN") |
| `--color-secondary` | `#1F6FEB` | Aksen biru (label "Kolam Ikan Lele", solar panel) |
| `--color-accent-green` | `#0B6B3A` | Label hidroponik/tanaman |
| `--color-leaf` | `#6CC24A` | Indikator tanaman, status OK |
| `--color-water` | `#0E5A6B` | Visual air/kolam |
| `--color-surface` | `#FFFFFF` | Kartu |
| `--color-bg` | `#F3F6F4` | Latar halaman |
| `--color-border` | `#D9E1DC` | Garis kartu |
| `--color-text` | `#1B2430` | Teks utama |
| `--color-text-muted` | `#5B6770` | Teks sekunder |
| `--color-ok` | `#2E9E4F` | Normal |
| `--color-warn` | `#F5A623` | Warning |
| `--color-danger` | `#D64545` | Critical |
| `--color-offline` | `#9AA5AD` | Perangkat offline |

**Dark mode:** `--color-bg: #0B1620`, `--color-surface: #12212E`, `--color-text: #E6EEF2`, border `#22364A`; warna status tetap sama.

### 7.2 Tipografi
- Font: **Inter** (fallback: system-ui, sans-serif).
- Ukuran teks **berbeda untuk mobile dan desktop**, lihat tabel di Bagian 7.4.3.
- Angka memakai `font-variant-numeric: tabular-nums`.
- Satuan ditampilkan lebih kecil & muted di samping angka.

### 7.3 Komponen
- **Kartu KPI:** radius 12 px, bayangan lembut, ikon kiri, nilai besar, tren (▲▼), badge status.
- **Label anotasi** (meniru gambar): kotak kecil putih/biru/hijau dengan teks tebal untuk menandai area di denah.
- **Callout dimensi:** garis panah + teks "3 m", "2 m", "5 m" pada denah.
- **Gauge setengah lingkaran** untuk pH, DO, suhu.
- **Toggle switch** besar (mudah ditekan di mobile).
- **Badge status:** pill dengan titik warna.
- **Grafik:** garis halus, area gradasi tipis, ambang batas sebagai garis putus-putus.

### 7.4 Layout & Responsif (Mobile & Desktop)

Pendekatan **mobile-first**: gaya dasar = mobile, lalu ditimpa pada breakpoint lebih besar (`sm:`, `md:`, `lg:`, `xl:` di Tailwind).

#### 7.4.1 Breakpoint

| Nama | Lebar layar | Perangkat target | Prefix Tailwind |
|---|---|---|---|
| **Mobile** | 0 – 639 px (desain acuan 360 – 430 px) | Smartphone | (default) |
| **Tablet** | 640 – 1023 px | Tablet / HP landscape | `sm:` / `md:` |
| **Desktop** | 1024 – 1439 px | Laptop / monitor | `lg:` |
| **Desktop Lebar** | ≥ 1440 px | Monitor besar | `xl:` / `2xl:` |

```js
// tailwind.config.js
export default {
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1440px' },
  },
}
```

```js
// composables/useBreakpoint.js (VueUse)
import { useBreakpoints } from '@vueuse/core'
export function useBreakpoint() {
  const bp = useBreakpoints({ tablet: 640, desktop: 1024, wide: 1440 })
  return {
    isMobile: bp.smaller('tablet'),
    isTablet: bp.between('tablet', 'desktop'),
    isDesktop: bp.greaterOrEqual('desktop'),
  }
}
```

#### 7.4.2 Ukuran Kerangka (Shell) & Spasi

| Elemen | Mobile | Tablet | Desktop |
|---|---|---|---|
| Container max-width | 100% | 100% | 1440 px (center) |
| Padding halaman | 16 px | 24 px | 32 px |
| Gap antar section | 20 px | 24 px | 32 px |
| Gap antar card (grid) | 12 px | 16 px | 24 px |
| Padding dalam card | 16 px | 20 px | 24 px |
| Radius card | 12 px | 12 px | 16 px |
| Navigasi | **Bottom nav** tinggi 64 px (+ `safe-area-inset-bottom`) | Sidebar ikon saja, lebar 72 px | Sidebar penuh, lebar 240 px |
| Top bar | Tinggi 56 px, sticky | Tinggi 60 px, sticky | Tinggi 64 px, sticky |
| Konten area | Penuh, `padding-bottom: 80px` (ruang bottom nav) | Penuh di kanan sidebar | Penuh di kanan sidebar |
| Spasi basis | 4 px | 4 px | 4 px |

**Posisi navigasi:**
- **Mobile:** Top bar (logo kiri, status sistem tengah, notifikasi kanan) + **Bottom navigation 5 item**: Overview, Denah, Kolam, Hidroponik, Lainnya. "Lainnya" membuka **bottom sheet** berisi Iklim, Energi, Kontrol, Alert, Laporan, Pengaturan.
- **Tablet:** Sidebar ikon (tooltip saat hover/long-press), top bar di kanan.
- **Desktop:** Sidebar kiri penuh (ikon + teks, grup menu), top bar berisi breadcrumb, pencarian, status sistem, notifikasi, avatar.

#### 7.4.3 Tipografi Responsive

| Peran | Mobile (size/line-height) | Desktop (size/line-height) | Weight |
|---|---|---|---|
| Judul halaman (H1) | 20 / 28 px | 28 / 36 px | 600 |
| Judul section (H2) | 16 / 24 px | 20 / 28 px | 600 |
| Judul card (H3) | 14 / 20 px | 16 / 24 px | 600 |
| **Nilai KPI** | **28 / 32 px** | **36 / 44 px** | 700 |
| Satuan KPI | 12 / 16 px | 14 / 20 px | 500 |
| Label KPI | 12 / 16 px | 13 / 18 px | 500 |
| Teks isi | 14 / 20 px | 14 / 22 px | 400 |
| Teks input/form | **16 / 24 px** (cegah zoom otomatis iOS) | 14 / 20 px | 400 |
| Caption / timestamp | 11 / 14 px | 12 / 16 px | 400 |
| Label anotasi denah | 10 / 12 px | 12 / 16 px | 600 |
| Teks tombol | 14 / 20 px | 14 / 20 px | 600 |

- Ukuran teks minimum di seluruh aplikasi: **11 px**.
- Teks panjang di card dipotong dengan `truncate` (satu baris) atau `line-clamp-2`.
- Alternatif fluid: `font-size: clamp(1.25rem, 1rem + 1.2vw, 1.75rem)` untuk H1.

#### 7.4.4 Ukuran Komponen

| Komponen | Mobile | Desktop |
|---|---|---|
| Tombol (tinggi) | 44 px (full-width di form) | 40 px (lebar sesuai isi) |
| Target sentuh minimum | 44 × 44 px | 32 × 32 px |
| Toggle switch | 52 × 32 px | 44 × 24 px |
| Input / select | tinggi 44 px | tinggi 40 px |
| Ikon di card KPI | 20 px | 24 px |
| Gauge (diameter) | 112 px | 160 px |
| Tinggi grafik | 200 px | 320 px |
| Pin sensor di denah | 28 px (area tap 44 px) | 24 px (hover tooltip) |
| Badge status | tinggi 22 px | tinggi 24 px |
| Modal / detail | **Bottom sheet** penuh lebar, maks tinggi 85vh | **Dialog** tengah, lebar 560 px, atau **side panel** kanan 400 px |
| Tabel data | Diubah jadi **daftar card** bertumpuk | Tabel penuh dengan header sticky |

#### 7.4.5 Posisi & Ukuran Section per Halaman

**Aturan umum grid:** `grid grid-cols-*` di Tailwind. Desktop memakai grid 12 kolom.

##### a. Overview

| Section | Mobile (< 640) | Tablet (640 – 1023) | Desktop (≥ 1024) |
|---|---|---|---|
| Banner Status Sistem | 1 kolom, penuh, tinggi 72 px, paling atas | 1 kolom, penuh, tinggi 80 px | span 12, tinggi 88 px |
| Kartu KPI (7 buah) | **2 kolom** (card tinggi min 104 px) | **3 kolom** | **4 kolom** (span 3 per card), tinggi min 128 px |
| Grafik tren 24 jam | 1 kolom, penuh, di bawah KPI, tinggi 200 px | 1 kolom, penuh, tinggi 260 px | span 8, tinggi 320 px |
| Ringkasan aktuator | 1 kolom, di bawah grafik; item horizontal scroll | 1 kolom, 3 item per baris | span 4, di samping grafik, daftar vertikal |
| Alert terbaru | 1 kolom, 3 item teratas + tombol "Lihat semua" | 1 kolom, 5 item | span 12 atau span 4 di bawah aktuator, 5 item |

##### b. Denah Greenhouse (Digital Twin)

| Section | Mobile | Desktop |
|---|---|---|
| Toggle layer (Ikan / Hidroponik / Iklim / Energi) | Chip horizontal scroll, sticky di atas denah | Segmented control di header card |
| Denah (rasio **8 : 5**, `aspect-ratio: 8 / 5`) | Lebar penuh (`100% - 32px`), tinggi otomatis (± 215 px pada layar 360 px) | span 8, tinggi otomatis (± 480 px pada lebar 768 px) |
| Label dimensi (3 m / 2 m / 3 m / 5 m / 8 m) | Teks 10 px, hanya angka (tanpa kata "Luas terpakai") | Teks 12 px, lengkap dengan keterangan |
| Detail sensor (saat pin ditekan) | **Bottom sheet** dari bawah | **Side panel** span 4, di kanan denah, selalu terlihat |
| Legenda warna status | Baris horizontal di bawah denah | Vertikal di panel kanan |

##### c. Kolam Ikan

| Section | Mobile | Desktop |
|---|---|---|
| Pemilih kolam (Kiri / Kanan / Bandingkan) | Segmented control penuh lebar, tinggi 44 px | Segmented control di kiri atas, lebar 320 px |
| Gauge (suhu, pH, DO, amonia, level) | **Carousel horizontal** (scroll-snap) atau grid 2 kolom, gauge 112 px | Grid **5 kolom** satu baris, gauge 160 px |
| Penampang kolam + level air | 1 kolom, tinggi 180 px | span 4, tinggi 280 px |
| Grafik riwayat | 1 kolom, rentang waktu via dropdown | span 8, rentang waktu via tab (1 j / 24 j / 7 h / 30 h) |
| Mode "Bandingkan" | Kolam kiri & kanan **bertumpuk** | Kolam kiri & kanan **berdampingan** 50 : 50 |

##### d. Hidroponik

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Kartu paralon (4 buah) | 1 kolom, kartu bertumpuk, tinggi ± 160 px | 2 kolom | **4 kolom** satu baris (span 3) |
| Progress siklus tanam | Di dalam card, bar tinggi 8 px | sama | sama, bar tinggi 10 px |
| Catatan nutrisi & jadwal | Accordion di bawah | Accordion | Panel span 12 di bawah |

##### e. Iklim & Ventilasi, Energi Surya

| Section | Mobile | Desktop |
|---|---|---|
| KPI ringkas | Grid 2 kolom | Grid 4 kolom |
| Grafik | 1 kolom, bertumpuk, tinggi 200 px | 2 kolom (span 6), tinggi 320 px |
| Kontrol fan / indikator baterai | Card penuh lebar | Card span 4 di samping grafik |

##### f. Kontrol & Otomasi

| Section | Mobile | Desktop |
|---|---|---|
| Daftar aktuator | Card bertumpuk, toggle di kanan (52 × 32 px), baris tinggi 64 px | Grid 3 kolom card |
| Editor aturan IF–THEN | Halaman penuh (stepper vertikal) | Dialog / panel kanan, 2 kolom (IF kiri, THEN kanan) |
| Log aksi | Daftar card, 10 item per halaman | Tabel dengan kolom Waktu, Pengguna, Aksi, Hasil |

##### g. Alert, Laporan, Pengaturan

| Section | Mobile | Desktop |
|---|---|---|
| Filter | Tombol "Filter" → bottom sheet | Bar filter horizontal di atas daftar |
| Daftar alert | Card bertumpuk, swipe kiri untuk acknowledge | Tabel dengan aksi di kolom kanan |
| Export laporan | Tombol penuh lebar di bawah | Tombol di kanan atas header |
| Form pengaturan | 1 kolom, input penuh lebar | 2 kolom (label kiri 1/3, input kanan 2/3) |

#### 7.4.6 Contoh Implementasi Vue + Tailwind

```vue
<!-- components/KpiCard.vue -->
<script setup>
defineProps({ label: String, value: [Number, String], unit: String, status: { type: String, default: 'ok' } })
</script>

<template>
  <article
    class="rounded-xl bg-surface border border-border p-4 min-h-[104px]
           sm:p-5 lg:p-6 lg:min-h-[128px] lg:rounded-2xl">
    <p class="text-xs leading-4 text-muted lg:text-[13px]">{{ label }}</p>
    <p class="mt-1 text-[28px] leading-8 font-bold tabular-nums lg:text-4xl lg:leading-[44px]">
      {{ value }}<span class="ml-1 text-xs font-medium text-muted lg:text-sm">{{ unit }}</span>
    </p>
    <StatusBadge :status="status" class="mt-2" />
  </article>
</template>
```

```vue
<!-- views/OverviewView.vue (grid responsive) -->
<template>
  <main class="px-4 py-5 pb-20 sm:px-6 lg:px-8 lg:pb-8 max-w-[1440px] mx-auto space-y-5 sm:space-y-6 lg:space-y-8">
    <SystemStatusBanner />
    <section class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      <KpiCard v-for="k in kpis" :key="k.id" v-bind="k" />
    </section>
    <section class="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-6">
      <TrendChart class="lg:col-span-8" />
      <ActuatorSummary class="lg:col-span-4" />
    </section>
    <RecentAlerts />
  </main>
</template>
```

```vue
<!-- layouts/AppShell.vue (navigasi adaptif) -->
<script setup>
import { useBreakpoint } from '@/composables/useBreakpoint'
const { isMobile, isTablet } = useBreakpoint()
</script>

<template>
  <div class="min-h-dvh bg-bg text-text">
    <SidebarNav v-if="!isMobile" :collapsed="isTablet" />      <!-- 72px / 240px -->
    <div :class="!isMobile ? (isTablet ? 'ml-[72px]' : 'ml-[240px]') : ''">
      <TopBar class="sticky top-0 h-14 sm:h-[60px] lg:h-16" />
      <RouterView />
    </div>
    <BottomNav v-if="isMobile" class="fixed bottom-0 inset-x-0 h-16 pb-[env(safe-area-inset-bottom)]" />
  </div>
</template>
```

Catatan wajib di `index.html`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

#### 7.4.7 Aturan Responsif Tambahan
- Gunakan `100dvh` (bukan `100vh`) agar tidak terpotong address bar di mobile.
- Tidak boleh ada **scroll horizontal pada halaman**. Konten lebar (tabel, grafik, chip) discroll di dalam kontainernya (`overflow-x-auto`).
- Grafik ECharts: gunakan `autoresize` dan `resize` otomatis saat orientasi berubah.
- Gambar/ikon dengan `max-width: 100%`.
- Uji minimal pada: **360×640**, **390×844**, **768×1024**, **1280×720**, **1440×900**, **1920×1080**.
- Mode landscape mobile: bottom nav disembunyikan, diganti sidebar ikon 72 px.

### 7.5 Aksesibilitas
- Kontras teks ≥ 4.5:1.
- Status tidak hanya warna (tambahkan ikon & teks).
- Target sentuh ≥ 44 px di mobile.
- Mendukung `prefers-reduced-motion` dan `prefers-color-scheme`.

---

## 8. Model Data

```json
{
  "site": { "land": {"w": 12, "l": 10, "unit": "m"}, "built": {"w": 8, "l": 5, "unit": "m"}, "roofHeight": {"min": 3, "max": 4, "unit": "m"} },
  "ponds": [
    { "id": "POND_L", "species": "lele", "depthCm": {"min": 50, "max": 70},
      "readings": { "temp": 28.4, "ph": 7.1, "do": 5.2, "nh3": 0.2, "levelCm": 62, "ts": "ISO-8601" } },
    { "id": "POND_R", "species": "lele", "depthCm": {"min": 50, "max": 70}, "readings": {} }
  ],
  "hydroponics": [
    { "id": "HYDRO_L1", "pond": "POND_L", "crop": "selada", "heightAbovePondCm": {"min": 80, "max": 100},
      "readings": { "ph": 6.1, "ec": 1.2, "temp": 22.0, "flow": 3.5 }, "plantedAt": "date" }
  ],
  "climate": { "airTemp": 29.1, "humidity": 71, "lux": 28000, "fan": "on" },
  "energy": { "solarW": 820, "batterySoc": 76, "loadW": 340, "todayKWh": 4.8 },
  "actuators": [
    { "id": "PUMP_1", "mode": "auto", "state": "on" },
    { "id": "FAN_1", "mode": "auto", "state": "off" },
    { "id": "AERATOR_1", "mode": "auto", "state": "on" }
  ],
  "alerts": [
    { "id": "A001", "severity": "warning", "source": "POND_L", "message": "pH mendekati batas atas", "ts": "ISO-8601", "ack": false }
  ]
}
```

---

## 9. Arsitektur Teknis (Frontend WAJIB Vue.js)

| Lapisan | Rekomendasi |
|---|---|
| Sensor/IoT | ESP32 + sensor suhu (DS18B20), pH, DO, TDS/EC, ultrasonik/level, DHT22/SHT31, LDR/BH1750, INA219 (arus-tegangan) |
| Protokol | MQTT (broker: Mosquitto/EMQX) |
| Backend | Node.js / FastAPI + WebSocket untuk realtime |
| Database | TimescaleDB / InfluxDB (time-series) + PostgreSQL (konfigurasi) |
| Frontend | **Vue.js 3** + Vite + Vue Router + Pinia + Tailwind CSS + ECharts (`vue-echarts`) + VueUse |
| Notifikasi | Firebase Cloud Messaging, Telegram/WhatsApp API |
| Hosting | VPS / cloud; opsi edge gateway di lokasi |

### 9.1 Struktur Proyek Vue.js

```
src/
├── main.js
├── App.vue
├── router/index.js              # rute 10 halaman
├── stores/                      # Pinia
│   ├── sensors.js               # data realtime kolam, hidroponik, iklim
│   ├── energy.js
│   ├── actuators.js
│   └── alerts.js
├── composables/
│   ├── useBreakpoint.js         # isMobile / isTablet / isDesktop
│   ├── useRealtime.js           # WebSocket / MQTT
│   └── useThresholds.js         # status ok/warn/critical
├── layouts/
│   └── AppShell.vue             # sidebar (tablet/desktop) + bottom nav (mobile)
├── components/
│   ├── ui/                      # KpiCard, StatusBadge, GaugeChart, ToggleSwitch, BottomSheet, SidePanel
│   ├── charts/                  # TrendChart, EnergyChart
│   └── greenhouse/              # FloorPlan.vue (denah 8:5), SensorPin.vue, PondCrossSection.vue
├── views/
│   ├── OverviewView.vue
│   ├── FloorPlanView.vue
│   ├── PondView.vue
│   ├── HydroponicView.vue
│   ├── ClimateView.vue
│   ├── EnergyView.vue
│   ├── ControlView.vue
│   ├── AlertsView.vue
│   ├── ReportsView.vue
│   └── SettingsView.vue
└── assets/styles/tokens.css     # CSS variables warna & ukuran
```

### 9.2 Aturan Pengembangan Vue
- Semua komponen memakai `<script setup>` dan Composition API.
- Komponen presentasional menerima data lewat `props`; data realtime diambil dari store Pinia.
- Responsif dikerjakan dengan kelas Tailwind (mobile-first); `useBreakpoint` hanya untuk perbedaan struktur (mis. bottom sheet vs side panel).
- Denah (`FloorPlan.vue`) dibuat dengan SVG `viewBox="0 0 800 500"` (rasio 8 : 5) agar skala otomatis di semua ukuran layar.
- Halaman dimuat dengan lazy loading: `component: () => import('@/views/PondView.vue')`.

---

## 10. Alur Pengguna Utama

1. **Cek kondisi harian:** buka Overview → lihat status → jika Warning, tap alert → menuju kolam terkait.
2. **Respons alert:** terima notifikasi → buka detail → jalankan aksi (mis. nyalakan aerator) → acknowledge.
3. **Atur otomasi:** Kontrol → Aturan → buat IF–THEN → simpan.
4. **Lihat laporan:** Laporan → pilih rentang → export.

---

## 11. Acceptance Criteria

- [ ] Denah dashboard mereplikasi layout gambar: 8 m x 5 m, zona 3 m – 2 m – 3 m.
- [ ] Terdapat 2 kolam, 4 paralon hidroponik (2 per sisi), filter, pompa, panel surya, dan fan.
- [ ] Semua parameter pada bagian 4 tampil dengan status warna.
- [ ] Data realtime diperbarui ≤ 5 detik.
- [ ] Kontrol aktuator manual & otomatis berfungsi dengan log aksi.
- [ ] Alert muncul pada ambang warning/critical.
- [ ] Dibangun dengan **Vue.js 3** (Composition API) sesuai Bagian 9.
- [ ] **Responsive mobile & desktop** sesuai Bagian 7.4: ukuran dan posisi semua section, card, dan teks mengikuti tabel breakpoint.
- [ ] Mobile memakai bottom nav, grid KPI 2 kolom, dan bottom sheet; desktop memakai sidebar, grid KPI 4 kolom, dan side panel.
- [ ] Tidak ada scroll horizontal halaman pada lebar 360 px sampai 1920 px.
- [ ] Mendukung dark mode.

---

## 12. Catatan & Asumsi

- Angka rentang ideal (pH, suhu, DO, dll.) adalah **nilai umum** untuk lele dan selada, bukan dari gambar; sesuaikan dengan kondisi lapangan.
- Gambar tidak menyebutkan jumlah titik tanam, kapasitas pompa, dan volume kolam. Nilai tersebut perlu ditambahkan setelah spesifikasi final.
- Notasi "0 – 50/70 cm" pada gambar diartikan sebagai kedalaman kolam 50 atau 70 cm (dua opsi desain).
