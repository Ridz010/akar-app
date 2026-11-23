# Sistem desain AKAR

- **Tipografi**: dua font. **Changa One** untuk judul dan teks sorotan (judul kartu, angka, tagline),
  **Google Sans Flex** untuk teks isi dan UI. Judul _sentence case_, tanpa teks kapital semua.
- **Ilustrasi**: latar vektor 2D (langit, awan, bukit, laut, pasir, pohon mangrove, ikan, kepiting)
  di `src/components/illustrations/`, dipakai sebagai pemisah di bawah kartu hero, kartu
  "Tentang", latar awan bagian Fitur, dan latar pesisir bagian Peran.
- **Logo**: hanya tanda, tanpa tulisan.
- **Warna**: putih dan `paper` sebagai dasar, `sage` dan `ink` untuk struktur, `lime` hanya untuk
  satu tombol utama per layar. Hasil model memakai warna netral dan label "Prediksi awal"; hijau
  khusus untuk data yang sudah diverifikasi manusia.
- **Gerak**: komponen React Bits di `src/components/motion/` (AnimatedContent/Reveal, SplitText,
  ScrollReveal, CountUp, Magnet, MagicBento, GooeyNav, TiltedCard, AccordionGallery, CurvedInput). Percikan GooeyNav berwarna biru air.
  Semua animasi ≤ 600 ms, sekali jalan, dan menghormati `prefers-reduced-motion`.

| Token                                      | Nilai                             | Pemakaian                       |
| ------------------------------------------ | --------------------------------- | ------------------------------- |
| `primary` / `lime-400`                     | `#CFEA5E`                         | Tombol aksi utama (teks ink)    |
| `sage-600` / `sage-900` / `sage-950`       | `#5B735C` / `#2B3A2D` / `#1C261D` | Brand, section gelap, footer    |
| `ink` / `slate`                            | `#18211A` / `#5E6A60`             | Teks utama / sekunder           |
| `surface` / `paper` / `line`               | `#F4F6F1` / `#FBFCFA` / `#E2E6DF` | Latar section, kartu, garis     |
| `prediction` / `prediction-bg`             | `#3F4A41` / `#EEF0EC`             | Hasil model (netral)            |
| `water-300…600`                            | `#8FCBEA` → `#2F7FB8`             | Efek percikan navbar            |
| `pending` `verified` `revision` `rejected` | lihat `globals.css`               | Status laporan (+ ikon + label) |
