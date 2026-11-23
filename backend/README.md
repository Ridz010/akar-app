# AKAR Backend

Layanan backend AKAR berbasis **Python + FastAPI**, dengan **Supabase** sebagai basis data
(PostgreSQL + Row Level Security), penyimpanan berkas (Storage), dan autentikasi (Supabase Auth).
Identifikasi spesies dari foto daun memakai model **`openai/gpt-4o-mini` melalui OpenRouter**.

Folder ini tidak ikut dibangun oleh Next.js (diabaikan oleh ESLint dan Prettier).

---

## Daftar isi

0. [Setup cepat (urutan lengkap)](#0-setup-cepat-urutan-lengkap)
1. [Peran backend](#1-peran-backend)
2. [Arsitektur](#2-arsitektur)
3. [Tech stack](#3-tech-stack)
4. [Struktur folder](#4-struktur-folder)
5. [Menjalankan secara lokal](#5-menjalankan-secara-lokal)
6. [Variabel lingkungan](#6-variabel-lingkungan)
7. [Menyiapkan Supabase](#7-menyiapkan-supabase)
8. [Autentikasi dan otorisasi](#8-autentikasi-dan-otorisasi)
9. [Model data](#9-model-data)
10. [Referensi API](#10-referensi-api)
11. [Identifikasi spesies (OpenRouter)](#11-identifikasi-spesies-openrouter)
12. [Pengujian](#12-pengujian)
13. [Deployment](#13-deployment)
14. [Daftar periksa keamanan](#14-daftar-periksa-keamanan)
15. [Pemecahan masalah](#15-pemecahan-masalah)

---

## 0. Setup cepat (urutan lengkap)

1. **Buat project Supabase** di <https://supabase.com/dashboard>. Catat dari
   _Project Settings → API Keys_: Project URL, publishable key (`sb_publishable_…`), dan secret
   key (`sb_secret_…`).
2. **Terapkan skema dan seed spesies** dari root repo:

   ```bash
   npx supabase login
   npx supabase init                           # sekali, bila supabase/config.toml belum ada
   npx supabase link --project-ref <project-ref>
   npx supabase db push --include-seed
   ```

3. **Aktifkan Custom Access Token Hook**: _Authentication → Hooks → Customize Access Token_ →
   fungsi `public.custom_access_token_hook` → Enable ([7.2](#72-mengaktifkan-custom-access-token-hook-wajib)).
4. **Atur Auth**: Site URL, Redirect URLs, template email konfirmasi, dan kunci JWT asimetris
   ([7.3](#73-konfigurasi-auth)).
5. **Buat API key OpenRouter** di <https://openrouter.ai/keys> dan isi kredit secukupnya.
6. **Jalankan backend** (detail di [bagian 5](#5-menjalankan-secara-lokal)):

   ```bash
   cd backend
   cp .env.example .env                        # isi SUPABASE_* dan OPENROUTER_API_KEY
   uv sync && uv run uvicorn app.main:app --reload --port 8000
   ```

7. **Jalankan web** dari root repo: salin `.env.example` menjadi `.env.local`, isi
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, dan
   `BACKEND_API_URL=http://localhost:8000`, lalu `npm run dev`.
8. **Buat admin pertama**: daftar lewat `/register`, konfirmasi email, lalu jalankan SQL di
   [7.4](#74-membuat-admin-pertama). Login ulang agar peran baru masuk ke token.
9. **Cek**: <http://localhost:8000/health> harus `"model_loaded": true`, lalu coba scan daun di
   `/scanner`.

---

## 1. Peran backend

Pembagian tugas dibuat agar setiap lapisan hanya mengerjakan apa yang paling cocok untuknya:

| Lapisan                         | Tanggung jawab                                                                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js** (`src/`)            | Antarmuka, render server, Server Actions. Membaca dan menulis data **milik pengguna** langsung ke Supabase dengan sesi pengguna, sehingga RLS selalu berlaku.                         |
| **FastAPI** (`backend/`)        | Pekerjaan yang butuh **komputasi** atau **kunci rahasia**: identifikasi spesies lewat OpenRouter (`openai/gpt-4o-mini`), menyimpan foto hasil scan, mencatat prediksi, dan operasi admin yang melewati RLS (ubah peran). |
| **Supabase Auth**               | Pendaftaran, login, konfirmasi email, penerbitan JWT. Peran pengguna disisipkan ke JWT lewat _Custom Access Token Hook_.                                                              |
| **Supabase Postgres + RLS**     | Sumber kebenaran data. Aturan akses ditegakkan di basis data, bukan hanya di kode aplikasi.                                                                                           |
| **Supabase Storage**            | Foto pengamatan di bucket privat `observation-photos`, satu folder per pengguna (`<user_id>/...`).                                                                                  |

Akibatnya, CRUD laporan pengamatan, verifikasi, kegiatan, dan profil **tidak** melewati FastAPI.
Backend tetap kecil, mudah diuji, dan bisa diskalakan terpisah dari web.

---

## 2. Arsitektur

```
                    ┌────────────────────────────┐
  Browser ────────▶ │  Next.js (App Router)      │
                    │  Server Components/Actions │
                    └──────┬──────────────┬──────┘
         sesi (cookie)     │              │  Authorization: Bearer <JWT pengguna>
         + RLS             │              ▼
                           │     ┌──────────────────────┐
                           │     │  FastAPI  /v1/*      │
                           │     │  verifikasi JWT      │
                           │     │  (JWKS Supabase)     │
                           │     └──┬─────────┬─────────┘
                           │        │         │ OpenRouter → openai/gpt-4o-mini
                           ▼        ▼         ▼
                    ┌────────────────────────────────────┐
                    │ Supabase                           │
                    │  Auth · Postgres (RLS) · Storage   │
                    └────────────────────────────────────┘
```

Alur scan daun:

1. Browser mengompres foto (≤ 1 MB, sisi terpanjang 1600 px) lalu mengirimnya ke Server Action
   `identifyLeaf` (`src/features/scanner/actions.ts`).
2. Server Action meneruskan foto ke `POST /v1/predictions` dengan JWT pengguna
   (`src/lib/api/backend.ts`). Kunci rahasia tidak pernah sampai ke browser.
3. FastAPI memverifikasi JWT, menyimpan foto ke `observation-photos/<user_id>/<uuid>.jpg`,
   mengirim foto beserta daftar spesies yang didukung ke OpenRouter, memetakan label ke tabel
   `species`, lalu mencatat baris `predictions`.
4. Respons dipakai halaman scan. Bila pengguna lanjut melapor, `photo_path` dari prediksi dipakai
   ulang oleh formulir laporan (`/observations/new?prediksi=<id>`).
5. Koordinator/admin memverifikasi laporan. Hanya laporan `verified` yang tampil di peta publik
   melalui view `public_map_points`.

---

## 3. Tech stack

| Komponen     | Pilihan                                                | Catatan                                               |
| ------------ | ------------------------------------------------------ | ----------------------------------------------------- |
| Bahasa       | Python 3.12+                                           | Diuji dengan 3.13                                     |
| Framework    | FastAPI                                                | Async, OpenAPI otomatis di `/docs`                    |
| Server ASGI  | Uvicorn (`uvicorn[standard]`)                          |                                                       |
| Validasi     | Pydantic v2 + `pydantic-settings`                      | Skema request/response dan konfigurasi dari env       |
| Basis data   | Supabase Postgres via `supabase` (supabase-py v2)      | Klien per-pengguna (RLS) dan klien admin (secret key) |
| Autentikasi  | Supabase Auth + `PyJWT[crypto]`                        | Verifikasi JWT asimetris via JWKS                     |
| Identifikasi | OpenRouter, model `openai/gpt-4o-mini`                 | Dipanggil dengan `httpx`, keluaran JSON terstruktur   |
| Gambar       | Pillow                                                 | Validasi, orientasi EXIF, kompres ulang               |
| Upload       | `python-multipart`                                     | Wajib untuk `UploadFile`                              |
| Pengujian    | `pytest`, `pytest-asyncio`                             | OpenRouter dan Supabase diganti tiruan                |
| Lint/format  | `ruff`                                                 |                                                       |
| Paket        | `uv` (`pyproject.toml`) atau pip (`requirements*.txt`) |                                                       |

---

## 4. Struktur folder

```
backend/
├── app/
│   ├── main.py                 create_app(): CORS, handler error, router, lifespan (klien httpx)
│   ├── core/
│   │   ├── config.py           Settings dari env (.env), dibaca sekali
│   │   ├── security.py         Verifikasi JWT Supabase (JWKS) → CurrentUser
│   │   └── errors.py           AppError + handler → format error seragam
│   ├── api/
│   │   ├── deps.py             get_current_user, require_roles, identifier, repository
│   │   └── v1/
│   │       ├── router.py       Menggabungkan semua route /v1
│   │       ├── predictions.py  POST/GET prediksi
│   │       ├── model.py        Info model aktif
│   │       └── admin.py        Ubah peran pengguna
│   ├── schemas/                Model Pydantic request/response
│   ├── services/
│   │   ├── images.py           Validasi dan kompres ulang foto
│   │   ├── identifier.py       Klien OpenRouter, prompt, skema JSON, parsing hasil
│   │   ├── repository.py       Semua akses Supabase (species, storage, predictions, profiles)
│   │   ├── predictions.py      Orkestrasi: foto → identifikasi → simpan → catat
│   │   └── users.py            Ubah peran
│   └── db/supabase.py          Pabrik klien admin dan per-pengguna
├── tests/                      pytest dengan identifier dan repository tiruan
├── pyproject.toml · requirements.txt · requirements-dev.txt
├── .env.example
└── Dockerfile
```

Aturan dependensi:

- `api/` memanggil `services/` dan `schemas/`. `services/` tidak bergantung pada route.
- Hanya `services/repository.py` (lewat `db/supabase.py`) yang menyentuh Supabase.
- Identifier dan repository disuntikkan lewat dependency FastAPI, sehingga mudah diganti saat
  pengujian atau saat beralih ke model sendiri.

---

## 5. Menjalankan secara lokal

Prasyarat: Python 3.12+, project Supabase yang sudah dimigrasi (lihat
[bagian 7](#7-menyiapkan-supabase)), dan API key OpenRouter.

Dengan [uv](https://docs.astral.sh/uv/):

```bash
cd backend
uv sync
cp .env.example .env
uv run uvicorn app.main:app --reload --port 8000
```

Dengan pip (Windows PowerShell):

```powershell
cd backend
py -3.13 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

- Dokumentasi interaktif: <http://localhost:8000/docs>
- Health check: <http://localhost:8000/health>

Perintah lain:

```bash
pytest -q                           # atau: uv run pytest
ruff check . && ruff format .
```

---

## 6. Variabel lingkungan

Semua nilai dibaca dari `backend/.env` (lihat `.env.example`). **API key OpenRouter hanya ada di
backend**, tidak di `.env.local` Next.js dan tidak pernah dikirim ke browser.

| Variabel                     | Wajib | Contoh / default           | Keterangan                                                               |
| ---------------------------- | ----- | -------------------------- | ------------------------------------------------------------------------ |
| `SUPABASE_URL`               | ya    | `https://abcd.supabase.co` | URL project Supabase                                                     |
| `SUPABASE_PUBLISHABLE_KEY`   | ya    | `sb_publishable_...`       | Klien per-pengguna (RLS berlaku)                                         |
| `SUPABASE_SECRET_KEY`        | ya    | `sb_secret_...`            | **Rahasia.** Klien admin yang melewati RLS                               |
| `SUPABASE_JWT_AUDIENCE`      | tidak | `authenticated`            | Klaim `aud` yang diterima                                                |
| `STORAGE_BUCKET`             | tidak | `observation-photos`       | Harus sama dengan migrasi                                                |
| `OPENROUTER_API_KEY`         | ya    | `sk-or-v1-...`             | **Rahasia.** Tanpa ini `POST /v1/predictions` mengembalikan 503          |
| `OPENROUTER_MODEL`           | tidak | `openai/gpt-4o-mini`       | Model OpenRouter yang mendukung gambar dan `json_schema`                 |
| `OPENROUTER_IMAGE_DETAIL`    | tidak | `high`                     | `high` membaca tekstur daun lebih teliti; `low` lebih murah              |
| `IDENTIFY_SAMPLES`           | tidak | `3`                        | Jumlah analisis paralel per scan (1–5). Lihat [bagian 11](#11-identifikasi-spesies-openrouter) |
| `SAMPLE_TEMPERATURE`         | tidak | `0.4`                      | Suhu analisis ke-2 dan seterusnya (analisis pertama selalu 0)            |
| `OPENROUTER_TIMEOUT_SECONDS` | tidak | `25`                       | Harus di bawah batas 30 detik di Server Action                           |
| `APP_URL`                    | tidak | `http://localhost:3000`    | Dikirim sebagai `HTTP-Referer` untuk atribusi aplikasi di OpenRouter     |
| `CONFIDENT_THRESHOLD`        | tidak | `0.80`                     | ≥ nilai ini → `confident`                                                |
| `REVIEW_THRESHOLD`           | tidak | `0.50`                     | ≥ nilai ini dan < `CONFIDENT_THRESHOLD` → `needs_review`                 |
| `MAX_UPLOAD_BYTES`           | tidak | `5242880`                  | Batas ukuran foto (5 MB, sama dengan batas bucket)                       |
| `CORS_ORIGINS`               | tidak | `http://localhost:3000`    | Dipisah koma. Backend dipanggil dari server Next.js; CORS untuk alat dev |
| `LOG_LEVEL`                  | tidak | `INFO`                     |                                                                          |

`model_version` yang dicatat di setiap baris `predictions` otomatis berbentuk
`openrouter/<OPENROUTER_MODEL>`, sehingga hasil dari model berbeda tetap bisa dibedakan.

---

## 7. Menyiapkan Supabase

Skema lengkap ada di `supabase/migrations/20261122000000_initial_schema.sql`.

### 7.1 Membuat project dan menjalankan migrasi

```bash
npx supabase login
npx supabase init                                   # sekali, membuat supabase/config.toml
npx supabase link --project-ref <project-ref>
npx supabase db push                                # menerapkan semua migrasi
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```

Untuk pengembangan lokal penuh (Docker): `npx supabase start` lalu `npx supabase db reset`.

Migrasi membuat:

- enum `user_role`, `observation_status`, `prediction_status`, `site_condition`, `activity_status`
- tabel `profiles`, `conservation_groups`, `species`, `locations`, `observations`, `predictions`,
  `verifications`, `activities`, `activity_participants`, `articles`
- view `public_map_points` (hanya laporan terverifikasi, koordinat lokasi sensitif dibulatkan)
- bucket privat `observation-photos` (maks 5 MB, JPEG/PNG/WebP) beserta kebijakannya
- fungsi `is_verifier()`, `is_admin()`, `current_user_role()`, `custom_access_token_hook()`
- trigger: profil otomatis saat daftar, `updated_at`, penerapan keputusan verifikasi, reset
  status ke `pending` saat laporan direvisi
- seluruh kebijakan RLS

### 7.2 Mengaktifkan Custom Access Token Hook (wajib)

Peran pengguna dibaca dari klaim `user_role` di JWT, baik oleh Next.js maupun FastAPI.

Dashboard Supabase → **Authentication → Hooks** → **Customize Access Token (JWT) Claims** →
pilih skema `public`, fungsi `custom_access_token_hook` → **Enable**.

Setelah peran seseorang diubah, klaim baru berlaku saat token berikutnya diterbitkan (login ulang
atau refresh otomatis, maksimal satu masa berlaku token).

### 7.3 Konfigurasi Auth

| Pengaturan                                   | Nilai                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Authentication → URL Configuration → Site URL | URL produksi web, mis. `https://akar.example.id`                                          |
| Redirect URLs                                | `http://localhost:3000/**` dan URL produksi `/**`                                         |
| Providers → Email                            | Aktif, _Confirm email_ aktif                                                              |
| Email Templates → Confirm signup             | Tautan: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`             |
| JWT Signing Keys                             | Gunakan kunci **asimetris** (ES256/RS256) agar backend memverifikasi via JWKS tanpa rahasia |

Route `src/app/auth/confirm/route.ts` menukar `token_hash` menjadi sesi lalu mengarahkan ke
`/dashboard`.

### 7.4 Membuat admin pertama

Daftar lewat `/register`, lalu jalankan di SQL Editor:

```sql
update public.profiles set role = 'admin' where id = (
  select id from auth.users where email = 'email-admin@contoh.id'
);
```

Admin berikutnya diatur lewat `POST /v1/admin/users/{id}/role`.

### 7.5 Mengisi data spesies

Identifikasi hanya memilih dari spesies yang `is_supported = true` dan punya `model_label`.
Kolom `leaf_traits` ikut dikirim ke model sebagai petunjuk ciri daun, jadi tulis dengan jelas.

`supabase/seed.sql` berisi 11 spesies mangrove Indonesia beserta ciri pembeda daunnya, dan 6
artikel edukasi untuk Pusat pengetahuan:

```bash
npx supabase db push --include-seed     # project remote
npx supabase db reset                   # Supabase lokal (migrasi + seed)
```

Atau tempel isi `supabase/seed.sql` ke SQL Editor. Seed aman dijalankan ulang
(`on conflict do update`). Spesies baru cukup ditambahkan sebagai baris baru; tidak perlu
melatih ulang model.

### 7.6 Data demo (opsional)

Untuk presentasi atau uji peran, `scripts/seed-demo.mjs` membuat empat akun demo (admin,
koordinator, dua relawan), dua kelompok, enam lokasi, dua belas laporan berfoto (sebagian sudah
diverifikasi), prediksi, dan empat aktivitas beserta pesertanya. Semua nama diberi akhiran
"(demo)" dan email memakai domain `example.com`.

```bash
npm run seed:demo           # membaca backend/.env (SUPABASE_URL, SUPABASE_SECRET_KEY)
npm run seed:demo:reset     # menghapus semua data demo, termasuk foto
```

Kata sandi semua akun demo: `AkarDemo#2026` (ubah lewat env `DEMO_PASSWORD`). Jangan jalankan
di project produksi yang dipakai publik.

---

## 8. Autentikasi dan otorisasi

### 8.1 Alur

1. Pengguna login di Next.js (`signInWithPassword`). Supabase menerbitkan access token (JWT)
   dan refresh token, disimpan sebagai cookie oleh `@supabase/ssr`. `src/proxy.ts` menyegarkan
   sesi di setiap request.
2. Saat memanggil backend, server Next.js mengambil access token dari sesi dan mengirimnya
   sebagai `Authorization: Bearer <token>`.
3. FastAPI memverifikasi tanda tangan JWT dengan **JWKS** Supabase
   (`{SUPABASE_URL}/auth/v1/.well-known/jwks.json`), memeriksa `exp`, `aud = authenticated`, dan
   `iss = {SUPABASE_URL}/auth/v1`.
4. Dari klaim diperoleh `sub` (id pengguna), `email`, dan `user_role`.
5. Query yang mewakili pengguna memakai **klien per-pengguna** (publishable key + JWT pengguna),
   sehingga RLS di Postgres tetap menjadi penjaga terakhir.

### 8.2 Peran

| Peran         | Label UI                        | Hak utama                                                         |
| ------------- | ------------------------------- | ----------------------------------------------------------------- |
| `community`   | Masyarakat & relawan            | Scan, kirim/revisi laporan sendiri, ikut kegiatan                 |
| `coordinator` | Koordinator kelompok konservasi | + membaca semua laporan, memverifikasi, mengelola kegiatan/lokasi |
| `admin`       | Administrator                   | + mengelola spesies, artikel, kelompok, dan peran pengguna        |

Di FastAPI, otorisasi dinyatakan sebagai dependency:

```python
@router.post("/admin/users/{user_id}/role")
async def set_role(..., user: CurrentUser = Depends(require_roles("admin"))): ...
```

### 8.3 Dua jenis klien Supabase

| Klien             | Kunci                         | RLS     | Dipakai untuk                                                            |
| ----------------- | ----------------------------- | ------- | ------------------------------------------------------------------------ |
| Per-pengguna      | publishable + JWT pengguna    | berlaku | Membaca data atas nama pengguna (mis. memeriksa prediksi miliknya)       |
| Admin             | secret key                    | dilewati | Menulis `predictions`, upload foto atas nama pengguna, mengubah `role` |

Aturan: klien admin **hanya** dipakai setelah identitas dan peran sudah diverifikasi, dan setiap
query admin **selalu** menyertakan filter eksplisit (`user_id = current_user.id`).

---

## 9. Model data

```
auth.users 1─1 profiles ─┬─< observations >─┬─ locations
                         │        │         └─ species
                         │        ├─< predictions >── species
                         │        └─< verifications
                         ├─< activity_participants >── activities
                         └─< articles (author)
conservation_groups 1─< profiles, locations, activities
```

### 9.1 Status laporan

```
 pending ──verifikasi──▶ verified        (tampil di peta publik)
    │                └─▶ rejected
    └──────────────────▶ revision_required ──kontributor merevisi──▶ pending
```

- Kontributor hanya dapat mengubah kolom isi laporan (lokasi, waktu, foto, kondisi, catatan).
  Kolom `status` dan `species_id` tidak dapat ia ubah (column-level grant).
- Keputusan dicatat sebagai baris `verifications`. Trigger `apply_verification` memperbarui
  `observations.status` dan `species_id`. Penolakan dan permintaan revisi wajib memiliki catatan.

### 9.2 Ringkasan RLS

| Tabel / objek            | Baca                                             | Tulis                                                     |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------- |
| `profiles`               | diri sendiri, verifikator                        | diri sendiri (nama, privasi, kelompok). `role` via backend |
| `species`                | publik                                           | admin                                                     |
| `locations`              | pengguna masuk                                   | tambah: pengguna masuk. ubah: verifikator                  |
| `observations`           | pemilik, verifikator                             | pemilik (status `pending`/`revision_required`)            |
| `predictions`            | pemilik, verifikator                             | hanya backend (secret key)                                |
| `verifications`          | verifikator, pemilik laporan                     | verifikator                                               |
| `activities`             | publik (kecuali dibatalkan)                      | verifikator                                               |
| `activity_participants`  | pengguna masuk                                   | diri sendiri                                              |
| `articles`               | publik bila terbit                               | admin                                                     |
| `public_map_points`      | publik                                           | —                                                         |
| Storage `observation-photos` | pemilik folder, verifikator                  | pemilik folder                                            |

---

## 10. Referensi API

- Base URL: `BACKEND_API_URL` (mis. `http://localhost:8000`)
- Versi: semua endpoint bisnis di bawah `/v1`
- Autentikasi: `Authorization: Bearer <access token Supabase>` kecuali disebut lain
- Format waktu: ISO 8601 UTC
- Format error seragam:

```json
{ "error": { "code": "invalid_image", "message": "Format foto harus JPG, PNG, atau WebP." } }
```

`message` berbahasa Indonesia dan aman ditampilkan ke pengguna; Next.js menampilkannya apa adanya.

### `GET /health`

Tanpa autentikasi. Dipakai load balancer.

```json
{ "status": "ok", "model_version": "openrouter/openai/gpt-4o-mini", "model_loaded": true }
```

### `POST /v1/predictions`

Mengenali spesies dari satu foto daun, menyimpan foto, dan mencatat prediksi.

- Body: `multipart/form-data`, field `image` (JPEG/PNG/WebP, ≤ `MAX_UPLOAD_BYTES`)
- Peran: semua pengguna masuk

Respons `201` (kontrak ini divalidasi oleh `src/features/scanner/types.ts`):

```json
{
  "id": "6f0c1d1e-8d0a-4a4f-9a51-3c2a0f1f7a11",
  "prediction_status": "confident",
  "predicted_label": "rhizophora_mucronata",
  "species": {
    "id": "a3b5...",
    "scientific_name": "Rhizophora mucronata",
    "local_name": "Bakau hitam",
    "family": "Rhizophoraceae",
    "leaf_traits": "Daun tunggal berhadapan, ... Ujung daun meruncing dengan duri kecil (mukro) yang jelas. ..."
  },
  "confidence": 0.88,
  "top_k": [
    { "label": "Rhizophora mucronata", "local_name": "Bakau hitam", "confidence": 0.88 },
    { "label": "Rhizophora apiculata", "local_name": "Bakau minyak", "confidence": 0.07 }
  ],
  "observed_traits": ["Ujung daun berduri kecil", "Bintik hitam di permukaan bawah"],
  "photo_quality": "good",
  "photo_feedback": null,
  "agreement": 1.0,
  "model_version": "openrouter/openai/gpt-4o-mini",
  "photo_path": "4d1c.../0b8e....jpg"
}
```

| Field             | Arti                                                                        |
| ----------------- | --------------------------------------------------------------------------- |
| `observed_traits` | Ciri daun yang benar-benar terlihat di foto, ditampilkan ke pengguna        |
| `photo_quality`   | `good`, `fair`, atau `poor`                                                 |
| `photo_feedback`  | Saran memotret ulang bila foto belum `good`                                 |
| `agreement`       | Proporsi analisis ensemble yang sepakat dengan label teratas (0–1)          |

| `prediction_status` | Arti                                                                 | `species`       |
| ------------------- | -------------------------------------------------------------------- | --------------- |
| `confident`         | Keyakinan ≥ `CONFIDENT_THRESHOLD`                                    | terisi          |
| `needs_review`      | Ada kandidat, tetapi keyakinan di antara kedua ambang                | terisi          |
| `unrecognized`      | Bukan daun, keyakinan < `REVIEW_THRESHOLD`, atau tidak cocok dengan kandidat | `null` |

`top_k[].label` berisi nama ilmiah bila label terpetakan, selain itu label mentah model.

### `GET /v1/predictions/{id}`

Mengembalikan prediksi milik pengguna (bentuk sama seperti di atas). Verifikator boleh membaca
semua prediksi. `404` bila tidak ada atau bukan miliknya.

### `GET /v1/model`

Info model aktif untuk halaman admin.

```json
{
  "version": "openrouter/openai/gpt-4o-mini",
  "provider": "openrouter",
  "labels": ["avicennia_marina", "bruguiera_gymnorrhiza", "rhizophora_mucronata", "sonneratia_alba"],
  "thresholds": { "confident": 0.8, "review": 0.5 }
}
```

### `POST /v1/admin/users/{user_id}/role`

- Peran: `admin`
- Body: `{ "role": "coordinator" }` (`community` | `coordinator` | `admin`)
- Respons `200`: `{ "id": "...", "role": "coordinator" }`
- Admin tidak dapat menurunkan perannya sendiri (`409 cannot_demote_self`).

### Kode error

| HTTP | `code`               | Kapan                                                        |
| ---- | -------------------- | ------------------------------------------------------------ |
| 400  | `invalid_image`      | Bukan gambar, format tidak didukung, atau rusak              |
| 401  | `unauthenticated`    | Header hilang, token kedaluwarsa, tanda tangan tidak valid  |
| 403  | `forbidden`          | Peran tidak mencukupi                                        |
| 404  | `not_found`          | Sumber daya tidak ada atau bukan milik pengguna              |
| 409  | `cannot_demote_self` | Admin menurunkan perannya sendiri                            |
| 413  | `image_too_large`    | Melebihi `MAX_UPLOAD_BYTES`                                  |
| 422  | `validation_error`   | Body tidak sesuai skema                                      |
| 503  | `model_unavailable`  | `OPENROUTER_API_KEY` kosong, OpenRouter gagal, atau timeout   |
| 503  | `species_catalog_empty` | Belum ada spesies `is_supported` di tabel `species`       |
| 500  | `internal_error`     | Kesalahan tak terduga (detail hanya di log)                  |

---

## 11. Identifikasi spesies (OpenRouter)

Alur di `app/services/predictions.py` dan `app/services/identifier.py`:

1. Foto divalidasi dan dibuka ulang dengan Pillow (JPG/PNG/WebP, ≤ `MAX_UPLOAD_BYTES`), orientasi
   EXIF dinormalkan, lalu dibuat dua salinan JPEG: 1600 px untuk Storage dan 1024 px untuk model.
2. Daftar kandidat diambil dari tabel `species` (`is_supported = true`), lengkap dengan
   `leaf_traits` dan suku.
3. Backend menjalankan `IDENTIFY_SAMPLES` analisis **paralel** ke
   `POST https://openrouter.ai/api/v1/chat/completions` (`openai/gpt-4o-mini`): bergantian atas
   foto utuh dan potongan tengah 80%, suhu 0 untuk analisis pertama dan `SAMPLE_TEMPERATURE`
   untuk sisanya. `response_format: json_schema` **membatasi label ke `model_label` kandidat +
   `unknown`**, dan prompt (`app/services/leaf_prompt.txt`) mewajibkan penilaian kualitas foto
   serta pencatatan ciri daun sebelum memilih kandidat.
4. Setiap jawaban `{ photo_quality, photo_feedback, is_leaf, observed_traits, candidates }`
   dibersihkan, lalu digabung: keyakinan dirata-rata, `agreement` = proporsi analisis yang
   sepakat dengan label teratas, dan kualitas foto diambil dari median. Satu analisis yang gagal
   tidak menggagalkan scan.
5. Status ditentukan oleh `CONFIDENT_THRESHOLD` dan `REVIEW_THRESHOLD`. `confident` juga
   mensyaratkan foto tidak `poor` dan `agreement` ≥ 0,6. Bukan daun atau `unknown` →
   `unrecognized`. Penjelasan metode dan cara evaluasinya ada di [ml/README.md](../ml/README.md).
6. Foto diunggah ke `observation-photos/<user_id>/<uuid>.jpg` dan baris `predictions` dicatat.
   Bila pencatatan gagal, foto dihapus lagi.

Catatan penting:

- Keyakinan dari model bahasa adalah **perkiraan model sendiri**, bukan probabilitas terkalibrasi.
  Karena itu hasil selalu ditampilkan sebagai "Prediksi awal" dan setiap laporan tetap
  diverifikasi koordinator.
- Biaya per scan kecil (satu gambar ≤ 1024 px dan ±300 token keluaran). Pantau pemakaian di
  dashboard OpenRouter dan pasang batas kredit.
- Foto dikirim ke OpenRouter dan penyedia model. Sebutkan ini di kebijakan privasi aplikasi.
  Nama, email, dan lokasi pengguna tidak ikut dikirim.
- Mengganti model cukup lewat `OPENROUTER_MODEL` (harus mendukung input gambar dan structured
  output). Untuk model klasifikasi sendiri di masa depan, buat kelas yang memenuhi protokol
  `Identifier` lalu pasang di `lifespan` (`app/main.py`).

---

## 12. Pengujian

```bash
pytest -q
```

- Endpoint diuji dengan `TestClient`; `get_current_user`, `get_identifier`, dan `get_repository`
  diganti lewat `app.dependency_overrides`, jadi tidak ada panggilan ke OpenRouter atau Supabase.
- `verify_token` diuji dengan pasangan kunci EC buatan sendiri (token kedaluwarsa, `aud` salah,
  `iss` salah → 401).
- Klien OpenRouter diuji dengan `httpx.MockTransport`: URL, header `Authorization`, model, dan
  enum label di skema JSON; respons 429 dipetakan ke 503 `model_unavailable`.

| Uji                                     | Harapan                              |
| --------------------------------------- | ------------------------------------ |
| Tanpa header `Authorization`            | 401 `unauthenticated`                |
| Token kedaluwarsa / `aud` / `iss` salah | 401                                  |
| Berkas teks dikirim sebagai `image`     | 400 `invalid_image`                  |
| Foto melebihi batas                     | 413 `image_too_large`                |
| Keyakinan 0.9 untuk label terpetakan    | 201 `confident`                      |
| Keyakinan 0.6                           | 201 `needs_review`                   |
| Model menyatakan bukan daun             | 201 `unrecognized`, `species = null` |
| Tabel `species` kosong                  | 503 `species_catalog_empty`          |
| Pencatatan gagal setelah upload         | 500, foto dihapus                    |
| `community` memanggil endpoint admin    | 403 `forbidden`                      |
| Admin menurunkan perannya sendiri       | 409 `cannot_demote_self`             |

---

## 13. Deployment

### Vercel (disarankan)

Buat project Vercel kedua dari repositori yang sama dengan **Root Directory `backend`**. Vercel
mendeteksi FastAPI dari `app/main.py` (entrypoint juga ditetapkan di `pyproject.toml` lewat
`[tool.vercel] entrypoint = "app.main:app"`), memasang dependensi dari `pyproject.toml`, dan
menjalankan lifespan FastAPI. Isi environment variables dari `.env.example`, lalu set
`BACKEND_API_URL` di project web ke URL backend. Langkah lengkap ada di
[README utama](../README.md#deployment-ke-vercel).

### Docker

`Dockerfile` tersedia di folder ini:

```bash
docker build -t akar-backend backend
docker run --env-file backend/.env -p 8000:8000 akar-backend
```

Catatan produksi:

- Jalankan di belakang HTTPS. Hanya server Next.js yang perlu menjangkau backend.
- Simpan `SUPABASE_SECRET_KEY` dan `OPENROUTER_API_KEY` di secret manager platform.
- Set `BACKEND_API_URL` di hosting Next.js ke URL backend produksi, dan `APP_URL` di backend ke
  URL web produksi.
- Health check: `GET /health`.
- Batasi laju `POST /v1/predictions` per pengguna (mis. di reverse proxy) untuk menjaga biaya.

---

## 14. Daftar periksa keamanan

- [ ] JWT diverifikasi tanda tangan, `exp`, `aud`, dan `iss` di setiap request.
- [ ] `SUPABASE_SECRET_KEY` hanya ada di backend dan server Next.js, tidak pernah di bundle browser.
- [ ] `OPENROUTER_API_KEY` hanya ada di `backend/.env` atau secret manager, dengan batas kredit di OpenRouter.
- [ ] Klien admin hanya dipakai setelah otorisasi, dengan filter `user_id` eksplisit.
- [ ] Unggahan divalidasi ukuran, tipe MIME, dan dibuka ulang dengan Pillow (bukan hanya ekstensi).
- [ ] Foto disimpan di bucket privat dalam folder milik pengguna.
- [ ] Peran hanya bisa diubah lewat endpoint admin; kolom `role` tidak dapat ditulis klien.
- [ ] Peta publik hanya membaca view `public_map_points`; lokasi sensitif dibulatkan.
- [ ] Pesan error ke pengguna tidak membocorkan detail internal.
- [ ] Batasi laju request `POST /v1/predictions` per pengguna (mis. di reverse proxy).

---

## 15. Pemecahan masalah

| Gejala                                                     | Penyebab umum dan solusi                                                                                    |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Semua request 401                                          | `SUPABASE_URL` salah (issuer tidak cocok), atau project masih memakai JWT secret HS256; aktifkan kunci asimetris. |
| Peran selalu `community`                                   | Custom Access Token Hook belum aktif, atau pengguna belum login ulang setelah perannya diubah.              |
| `Could not find the table 'public.…' in the schema cache`  | Migrasi belum diterapkan: `npx supabase db push`.                                                           |
| `/health` → `"model_loaded": false`                        | `OPENROUTER_API_KEY` kosong di `backend/.env`.                                                              |
| Scan → 503 `model_unavailable`                             | Kredit OpenRouter habis (402), kena batas laju (429), atau timeout. Lihat log backend.                      |
| Scan → 503 `species_catalog_empty`                         | Seed belum dijalankan: `npx supabase db push --include-seed` atau tempel `supabase/seed.sql`.               |
| Prediksi sering `unrecognized`                             | Foto buram atau latar ramai, atau `leaf_traits` kurang jelas. Coba `OPENROUTER_IMAGE_DETAIL=high`.          |
| Upload gagal 403 dari Storage                              | Bucket `observation-photos` belum dibuat oleh migrasi, atau `SUPABASE_SECRET_KEY` salah.                    |
| Halaman scan: "Layanan identifikasi belum dapat dihubungi" | `BACKEND_API_URL` di `.env.local` belum diisi atau backend tidak berjalan.                                  |
