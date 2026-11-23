# supabase/

Migrasi basis data dan konfigurasi Supabase untuk AKAR.

| Berkas                                              | Isi                                                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `migrations/20261122000000_initial_schema.sql`      | Enum, tabel, indeks, trigger, RLS, view `public_map_points`, bucket `observation-photos`, Custom Access Token Hook |
| `migrations/20261123000000_prediction_insights.sql` | Kolom `observed_traits`, `photo_quality`, `photo_feedback`, `agreement` di `predictions`                           |
| `seed.sql`                                          | 11 spesies beserta ciri pembeda daun dan `model_label`, serta 6 artikel edukasi                                    |

```bash
npx supabase init                                    # sekali, membuat supabase/config.toml
npx supabase link --project-ref <project-ref>
npx supabase db push --include-seed                  # menerapkan migrasi + seed spesies
npx supabase migration new <nama>                    # migrasi berikutnya
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```

Setelah migrasi, aktifkan **Authentication → Hooks → Customize Access Token** dengan fungsi
`public.custom_access_token_hook`. Tanpa langkah ini semua pengguna dibaca sebagai `community`.

Penjelasan lengkap skema, RLS, alur autentikasi, dan konfigurasi Auth ada di
[backend/README.md](../backend/README.md#7-menyiapkan-supabase).

`src/types/database.ts` saat ini ditulis tangan agar sesuai dengan migrasi. Setelah project
Supabase siap, ganti dengan hasil `supabase gen types`.
