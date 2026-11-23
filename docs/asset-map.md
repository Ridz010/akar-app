# Asset map

Sumber kebenaran di kode: `src/config/images.ts`. Perbarui keduanya bersamaan.

Berkas asli di `public/img/` tidak pernah diubah dan **tidak masuk repositori** (lihat `.gitignore`)
karena ukurannya ±90 MB; unduh ulang dari sumber di `docs/assets-credits.md` bila dibutuhkan. Halaman memakai salinan yang diperkecil
(lebar 2000 px, JPEG kualitas 78) di `public/img/web/`. Komponen React Bits yang memakai `<img>`
(TiltedCard, AccordionGallery) menerima URL dari `optimizedImage()` di `src/lib/image.ts`.

## Logo

| Path                                    | Isi                                                      | Pemakaian              |
| --------------------------------------- | -------------------------------------------------------- | ---------------------- |
| `public/icon/logo.svg`                  | Tanda AKAR (huruf "A" dari daun dan akar) di latar putih | —                      |
| `public/icon/akar-logo-transparent.svg` | Tanda tanpa latar                                        | `Logo variant="color"` |
| `public/icon/akar-logo-white.svg`       | Tanda putih untuk latar gelap/foto                       | `Logo variant="white"` |

Logo ditampilkan sebagai tanda saja, tanpa tulisan "AKAR".

## Foto

| Kunci di `images.ts` | Salinan web (`public/img/web/`)  | Asli (`public/img/`)                                                   | Dipakai di                                  |
| -------------------- | -------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| `hero`               | `mangrove-shoreline.jpg`         | `beautiful-tropical-mangrove-forest.jpg`                               | Hero beranda                                |
| `riverReflection`    | `mangrove-river-reflection.jpg`  | `broad-river-close-black-river-jamaica-exotic-landscape-mangroves.jpg` | CTA penutup                                 |
| `sunsetRoots`        | `mangrove-sunset-roots.jpg`      | `beach-sunset-with-trees.jpg`                                          | Cadangan                                    |
| `propRoots`          | `mangrove-prop-roots.jpg`        | `jimmy-blackwell-JyVPdNe75lg-unsplash.jpg`                             | Cara kerja, masuk, kartu dasbor, edukasi    |
| `tangledRoots`       | `mangrove-tangled-roots.jpg`     | `timothy-k-1CiE1x4dHIY-unsplash.jpg`                                   | Tentang                                     |
| `underwaterRoots`    | `mangrove-underwater-roots.jpg`  | `kristin-hoel-i5kMNyhiw6c-unsplash.jpg`                                | Fitur, galeri edukasi                       |
| `shoreline`          | `mangrove-prop-root-line.jpg`    | `p-mantha-JFh2p1iy27I-unsplash.jpg`                                    | Kartu hero (Edukasi), artikel               |
| `loneTree`           | `mangrove-lone-tree.jpg`         | `bernd-dittrich-UYbtxSM7YPk-unsplash.jpg`                              | Peran                                       |
| `quietRiver`         | `mangrove-quiet-river.jpg`       | `you-le-3AEytv8xS0Y-unsplash.jpg`                                      | Dasbor, galeri edukasi                      |
| `handLeaf`           | `mangrove-hand-leaf.jpg`         | `joylynn-goh-x6DoI-s7eaI-unsplash.jpg`                                 | Fitur, cara kerja                           |
| `leafRosette`        | `leaf-rosette.jpg`               | `patrick-hendry-h1PaT2um6xo-unsplash.jpg`                              | Kartu hero (Scan), kartu dasbor             |
| `saplings`           | `mangrove-saplings.jpg`          | `sara-aurora-cimminiello-FyaIuDIacTs-unsplash.jpg`                     | Tentang, cara kerja, daftar, galeri edukasi |
| `aerialCanopy`       | `mangrove-aerial-canopy.jpg`     | `waranont-joe-xIwYx_U9yNU-unsplash.jpg`                                | Kartu hero (Peta), fitur, galeri edukasi    |
| `aerialRiver`        | `mangrove-aerial-river.jpg`      | `agung-hidayat-jQ6FCly--vI-unsplash.jpg`                               | Halaman peta                                |
| `aerialChannel`      | `mangrove-aerial-channel.jpg`    | `collins-lesulie-ry1N8T-Lbyc-unsplash.jpg`                             | Cara kerja                                  |
| `aerialWetland`      | `mangrove-aerial-wetland.jpg`    | `hector-mavare-CYtuAEW1W7g-unsplash.jpg`                               | Cadangan                                    |
| `aerialDarkWater`    | `mangrove-aerial-dark-water.jpg` | `hugh-whyte-h1prnnV1KE4-unsplash.jpg`                                  | Cadangan                                    |

Menambah foto baru: simpan aslinya di `public/img/`, buat salinan 2000 px di `public/img/web/`,
daftarkan di `images.ts` dengan alt berbahasa Indonesia yang menggambarkan isi foto, lalu catat
sumber dan lisensinya di `docs/assets-credits.md`.

`leafRosette` adalah daun umum, bukan daun mangrove yang teridentifikasi. Ganti dengan foto daun
mangrove milik tim bila tersedia.
