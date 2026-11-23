# ml/

Metode identifikasi spesies AKAR, cara mengevaluasinya, dan rencana menuju model terlatih
sendiri. Folder ini tidak ikut dibangun oleh Next.js.

## Metode yang berjalan sekarang

Identifikasi dilayani `backend/` dengan model visi-bahasa `openai/gpt-4o-mini` melalui
OpenRouter. Karena belum ada dataset daun mangrove yang terverifikasi, AKAR tidak melatih
klasifier. Akurasi dijaga dengan lima teknik berikut.

| Teknik                                  | Letak                                       | Manfaat                                                                                                                   |
| --------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Katalog tertutup + structured output    | `identifier.py` (`build_response_format`)   | Label dibatasi ke `species.model_label` + `unknown` lewat JSON Schema `strict`. Model tidak bisa mengarang spesies.       |
| Analisis ciri dulu, keputusan kemudian  | `leaf_prompt.txt`, urutan properti skema    | Model wajib menulis `observed_traits` (bentuk, ujung, pangkal, permukaan bawah, susunan) sebelum memberi kandidat.         |
| Ciri pembeda per spesies                | `species.leaf_traits` (`supabase/seed.sql`) | Prompt berisi kunci pembeda seperti mukro pada *Rhizophora* dan permukaan bawah keputihan pada *Avicennia*.                |
| Ensemble + augmentasi saat uji          | `OpenRouterIdentifier.identify`, `images.py` | `IDENTIFY_SAMPLES` analisis paralel atas foto utuh dan potongan tengah 80%, suhu 0 untuk analisis pertama dan 0,4 untuk sisanya. Keyakinan dirata-rata. |
| Gerbang kualitas dan kesepakatan        | `predictions.classify`                      | Status `confident` hanya bila keyakinan ≥ 0,80, foto tidak `poor`, dan ≥ 60% analisis sepakat. Sisanya `needs_review`.     |

Agregasi (`aggregate`):

- `is_leaf` ditentukan suara mayoritas.
- Keyakinan tiap label adalah rata-rata dari semua analisis, dan label yang tidak dipilih
  dihitung 0. Ketidaksepakatan otomatis menurunkan keyakinan.
- `agreement` adalah proporsi analisis yang memilih label teratas yang sama.
- `photo_quality` diambil dari median penilaian; `observed_traits` dari analisis paling yakin
  yang sepakat dengan hasil akhir.

Biaya: `IDENTIFY_SAMPLES=3` berarti tiga panggilan per scan. Turunkan ke 1 untuk menghemat,
dengan konsekuensi `agreement` selalu 1 dan keyakinan kurang stabil.

## Mengevaluasi

Sebelum lomba atau rilis, ukur performa pada foto yang **tidak** dipakai untuk menyusun prompt.

1. Kumpulkan minimal 20 foto daun per spesies dari lapangan, diberi label oleh orang yang
   kompeten. Simpan di `ml/eval/<model_label>/*.jpg` (jangan commit foto pihak lain tanpa izin).
2. Kirim tiap foto ke `POST /v1/predictions` dengan akun uji, lalu catat label dan status.
3. Laporkan:
   - akurasi top-1 dan top-3,
   - akurasi pada prediksi berstatus `confident` (harus sangat tinggi, karena ini yang paling
     dipercaya pengguna),
   - cakupan: persentase foto yang menjadi `confident`,
   - matriks kebingungan, terutama *R. mucronata* vs *R. apiculata* dan *Rhizophora* vs
     *Bruguiera*.
4. Bila akurasi `confident` kurang dari target, naikkan `CONFIDENT_THRESHOLD`, perjelas
   `leaf_traits`, atau tambah `IDENTIFY_SAMPLES`.

## Rencana model terlatih

Setelah laporan terverifikasi di AKAR cukup banyak (target ≥ 300 foto per spesies), foto-foto
itu menjadi dataset berlabel dari manusia. Rencana pelatihannya:

1. **Data**: ekspor foto dari laporan `verified` beserta `species_id`. Bagi per lokasi (bukan
   per foto) menjadi latih/validasi/uji agar foto dari pohon yang sama tidak bocor ke data uji.
2. **Arsitektur**: transfer learning dari backbone modern yang efisien, misalnya
   EfficientNetV2-S atau ConvNeXt-Tiny pralatih ImageNet. Kalau perlu, mulai dari bobot
   PlantNet/iNaturalist untuk domain tumbuhan.
3. **Pelatihan**: augmentasi (crop acak, flip, rotasi, perubahan warna dan cahaya), label
   smoothing, fine-tuning bertahap (kepala dulu, lalu seluruh jaringan dengan learning rate
   kecil), dan early stopping pada validasi.
4. **Kalibrasi**: temperature scaling pada data validasi agar keyakinan sesuai akurasi nyata.
   Ambang `confident` dipilih dari kurva presisi–cakupan.
5. **Penolakan**: kelas `unknown` dari foto non-mangrove dan foto buram, ditambah ambang
   entropi untuk menolak foto di luar distribusi.
6. **Penyajian**: ekspor ke ONNX atau TFLite, lalu buat kelas yang memenuhi protokol
   `Identifier` di `backend/app/services/identifier.py`. Model terlatih dan LLM bisa digabung:
   model terlatih sebagai keputusan utama, LLM untuk `observed_traits` dan saran foto.

Catat setiap sumber dataset dan lisensinya di `docs/assets-credits.md` sebelum pelatihan.
