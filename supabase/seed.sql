insert into public.species (scientific_name, local_name, family, leaf_traits, model_label, is_supported)
values
  (
    'Rhizophora mucronata',
    'Bakau hitam',
    'Rhizophoraceae',
    'Daun tunggal berhadapan, jorong lebar sampai bulat telur, besar dan tebal seperti kulit. Ujung daun meruncing dengan duri kecil (mukro) yang jelas. Permukaan bawah hijau pucat dengan bintik hitam kecil tersebar. Tangkai daun hijau.',
    'rhizophora_mucronata',
    true
  ),
  (
    'Rhizophora apiculata',
    'Bakau minyak',
    'Rhizophoraceae',
    'Daun tunggal berhadapan, jorong menyempit dan lebih ramping daripada bakau hitam. Ujung daun runcing dengan mukro pendek. Tangkai dan tulang daun bagian bawah sering kemerahan. Permukaan atas hijau tua mengilap.',
    'rhizophora_apiculata',
    true
  ),
  (
    'Bruguiera gymnorrhiza',
    'Tancang',
    'Rhizophoraceae',
    'Daun tunggal berhadapan, jorong memanjang, tebal seperti kulit. Ujung daun runcing tanpa duri. Tangkai daun sering kemerahan. Permukaan bawah tanpa bintik hitam.',
    'bruguiera_gymnorrhiza',
    true
  ),
  (
    'Ceriops tagal',
    'Tengar',
    'Rhizophoraceae',
    'Daun tunggal berhadapan, bulat telur terbalik dan lebih kecil dari daun bakau. Ujung daun membundar atau sedikit bertakik, tanpa duri. Pangkal menyempit ke tangkai. Hijau kekuningan mengilap dan sering bergerombol di ujung ranting.',
    'ceriops_tagal',
    true
  ),
  (
    'Avicennia marina',
    'Api-api putih',
    'Acanthaceae',
    'Daun tunggal berhadapan, jorong sampai bulat telur dengan ujung agak runcing. Permukaan atas hijau mengilap. Permukaan bawah keputihan atau abu-abu pucat, kadang tampak kristal garam. Lebih tipis daripada daun bakau.',
    'avicennia_marina',
    true
  ),
  (
    'Sonneratia alba',
    'Pedada',
    'Lythraceae',
    'Daun tunggal berhadapan, tebal dan berdaging. Bulat telur terbalik dengan ujung membundar tanpa duri. Pangkal menyempit ke tangkai yang pendek. Warna hijau hampir sama di kedua permukaan.',
    'sonneratia_alba',
    true
  ),
  (
    'Xylocarpus granatum',
    'Nyirih',
    'Meliaceae',
    'Daun majemuk menyirip, biasanya dua pasang anak daun, tersusun berseling pada ranting. Anak daun jorong sampai bulat telur terbalik dengan ujung membundar. Hijau mengilap, tepi rata, tanpa duri di ujung.',
    'xylocarpus_granatum',
    true
  ),
  (
    'Lumnitzera racemosa',
    'Teruntum',
    'Combretaceae',
    'Daun tunggal berseling, kecil dan berdaging, berbentuk seperti sendok (bulat telur terbalik memanjang). Ujung daun membundar dan sering bertakik. Daun bergerombol di ujung ranting. Hijau muda dengan tepi rata.',
    'lumnitzera_racemosa',
    true
  ),
  (
    'Aegiceras corniculatum',
    'Gedangan',
    'Primulaceae',
    'Daun tunggal berseling, bulat telur terbalik dengan ujung membundar atau bertakik. Tebal seperti kulit, kadang tampak butiran garam di permukaan. Tangkai daun pendek dan sering kemerahan.',
    'aegiceras_corniculatum',
    true
  ),
  (
    'Excoecaria agallocha',
    'Buta-buta',
    'Euphorbiaceae',
    'Daun tunggal berseling, jorong dengan ujung meruncing. Tepi daun bergerigi halus atau hampir rata. Tangkai daun panjang dan ramping. Daun tua berubah merah sebelum gugur. Getahnya putih dan beracun, hindari mata dan kulit.',
    'excoecaria_agallocha',
    true
  ),
  (
    'Nypa fruticans',
    'Nipah',
    'Arecaceae',
    'Daun majemuk menyirip sangat panjang seperti daun kelapa, tumbuh langsung dari batang di dalam lumpur. Anak daun lanset memanjang dengan ujung runcing. Permukaan bawah anak daun keputihan.',
    'nypa_fruticans',
    true
  )
on conflict (scientific_name) do update
set
  local_name = excluded.local_name,
  family = excluded.family,
  leaf_traits = excluded.leaf_traits,
  model_label = excluded.model_label,
  is_supported = excluded.is_supported;

insert into public.articles (slug, title, summary, body, cover_path, published_at)
values
  (
    'mengenal-mangrove-dan-fungsinya',
    'Mengenal mangrove dan fungsinya bagi pesisir',
    'Mangrove bukan sekadar pohon di tepi pantai. Hutan ini menahan abrasi, meredam gelombang, menyimpan karbon, dan menjadi rumah bagi ikan serta kepiting.',
    $body$
Mangrove adalah kelompok tumbuhan yang mampu hidup di zona pasang surut: tanahnya berlumpur, airnya payau, dan setiap hari tergenang lalu surut kembali. Indonesia memiliki salah satu hutan mangrove terluas di dunia, sehingga menjaganya berarti menjaga sebagian besar pesisir kita.

## Menahan abrasi

Akar mangrove tumbuh rapat dan saling membelit. Jaringan akar ini mengikat lumpur dan pasir sehingga garis pantai tidak cepat tergerus arus. Di tempat mangrove ditebang, abrasi biasanya berjalan jauh lebih cepat.

## Meredam gelombang

Batang dan akar tunjang memecah energi ombak sebelum mencapai daratan. Sabuk mangrove yang lebar dan sehat membantu melindungi permukiman, tambak, dan jalan di belakangnya dari gelombang pasang maupun badai.

## Rumah bagi kehidupan pesisir

Celah di antara akar menjadi tempat berlindung dan berkembang biak bagi:

- ikan muda yang kelak hidup di laut lepas,
- kepiting bakau dan udang,
- kerang serta siput,
- burung air yang mencari makan saat air surut.

Karena itu, nelayan di sekitar mangrove yang sehat umumnya lebih mudah mendapatkan tangkapan.

## Penyimpan karbon

Mangrove menyimpan karbon bukan hanya di batang dan daunnya, tetapi juga di lumpur di bawahnya. Lumpur yang tergenang membuat sisa tumbuhan terurai sangat lambat, sehingga karbon tersimpan dalam waktu lama. Saat mangrove rusak, karbon ini bisa terlepas kembali ke udara.

## Apa yang bisa kamu lakukan

Kamu tidak perlu menjadi ahli untuk ikut menjaga mangrove. Mulailah dengan mengenali spesies di sekitarmu, mencatat kondisinya, dan melaporkan kerusakan atau sampah melalui AKAR. Laporan yang terverifikasi membantu pengelola memutuskan di mana penanaman dan pembersihan paling dibutuhkan.
$body$,
    '/img/web/mangrove-shoreline.jpg',
    '2026-11-03 08:00:00+07'
  ),
  (
    'cara-memotret-daun-mangrove',
    'Cara memotret daun mangrove agar mudah dikenali',
    'Foto yang baik membuat prediksi Pindai AI jauh lebih akurat. Ikuti tujuh langkah sederhana ini sebelum menekan tombol kamera.',
    $body$
Pindai AI mengenali spesies dari ciri daun: bentuk helai, ujung daun, warna permukaan bawah, dan susunannya pada ranting. Semakin jelas ciri itu terlihat, semakin yakin hasilnya.

## Tujuh langkah memotret

1. **Pilih satu daun yang utuh dan sehat.** Hindari daun yang sobek, berlubang, atau tertutup lumpur.
2. **Gunakan latar polos.** Letakkan daun di telapak tangan, buku catatan, atau kertas berwarna terang.
3. **Cari cahaya alami.** Potret di tempat teduh yang terang. Hindari sinar matahari langsung yang membuat bayangan keras.
4. **Isi bingkai dengan daun.** Dekatkan kamera sampai daun memenuhi sekitar dua pertiga layar, tetapi seluruh tepinya tetap terlihat.
5. **Pastikan fokus tajam.** Ketuk layar pada daun dan tahan ponsel beberapa detik sampai gambar tidak goyang.
6. **Tunjukkan ujung daun.** Ujung daun adalah salah satu ciri pembeda terpenting, misalnya duri kecil pada bakau hitam atau ujung membundar pada pedada.
7. **Ambil foto kedua untuk permukaan bawah.** Bila ragu, balik daunnya. Permukaan bawah keputihan menjadi petunjuk kuat untuk api-api.

## Kesalahan yang sering terjadi

- Memotret seluruh pohon dari jauh, sehingga daun terlalu kecil.
- Banyak daun bertumpuk dalam satu foto.
- Foto buram karena diambil sambil berjalan di atas perahu.
- Latar dedaunan lain yang membuat tepi daun sulit dibedakan.

## Bila hasilnya "perlu diperiksa"

Itu bukan kegagalan. Artinya ciri daun belum cukup kuat untuk disimpulkan. Coba foto daun lain dari pohon yang sama, atau tetap kirim laporan; pengelola akan memeriksa fotonya secara langsung.
$body$,
    '/img/web/mangrove-hand-leaf.jpg',
    '2026-11-06 08:00:00+07'
  ),
  (
    'membedakan-bakau-api-api-pedada-tancang',
    'Membedakan bakau, api-api, pedada, dan tancang dari daunnya',
    'Empat kelompok mangrove ini paling sering dijumpai di pesisir Indonesia. Ternyata cukup melihat ujung dan permukaan bawah daun untuk membedakannya.',
    $body$
Di lapangan, banyak orang menyebut semua mangrove sebagai "bakau". Padahal ada beberapa marga dengan ciri daun yang cukup mudah dibedakan. Panduan ini merangkum ciri kunci yang juga dipakai Pindai AI.

## Bakau (Rhizophora)

- Daun besar, tebal seperti kulit, tersusun berhadapan.
- **Ujung daun memiliki duri kecil (mukro).** Ini ciri paling mudah dikenali.
- Bakau hitam (*Rhizophora mucronata*) memiliki bintik hitam kecil di permukaan bawah daun.
- Bakau minyak (*Rhizophora apiculata*) berdaun lebih ramping dengan tangkai kemerahan.
- Akar tunjang melengkung dari batang ke lumpur.

## Api-api (Avicennia)

- Daun berhadapan, lebih tipis daripada bakau.
- **Permukaan bawah keputihan atau abu-abu pucat**, kadang terasa asin karena kristal garam.
- Akar napas tumbuh tegak dari lumpur seperti pensil di sekitar pohon.

## Pedada (Sonneratia)

- Daun tebal dan berdaging, berhadapan.
- **Ujung daun membundar tanpa duri.**
- Warna kedua permukaan hampir sama.
- Akar napasnya berbentuk kerucut dan lebih besar daripada akar api-api.

## Tancang (Bruguiera)

- Daun jorong memanjang dan tebal, mirip bakau.
- **Ujung daun runcing tetapi tidak berduri**, dan tidak ada bintik hitam di permukaan bawah.
- Tangkai daun sering kemerahan.
- Akarnya berupa akar lutut yang menyembul dari lumpur.

## Ringkasan cepat

1. Ujung berduri kecil: kemungkinan bakau.
2. Permukaan bawah keputihan: kemungkinan api-api.
3. Ujung membundar dan daun berdaging: kemungkinan pedada.
4. Ujung runcing tanpa duri dan tangkai kemerahan: kemungkinan tancang.

Gunakan ringkasan ini untuk mencocokkan hasil Pindai AI dengan daun di tanganmu. Bila ada ciri yang jelas bertentangan, tuliskan di catatan laporan.
$body$,
    '/img/web/mangrove-prop-roots.jpg',
    '2026-11-10 08:00:00+07'
  ),
  (
    'keselamatan-di-kawasan-mangrove',
    'Keselamatan saat memantau mangrove di lapangan',
    'Lumpur dalam, pasang yang naik cepat, dan tumbuhan bergetah adalah risiko nyata. Siapkan diri sebelum berangkat.',
    $body$
Kawasan mangrove indah, tetapi bukan tempat bermain yang aman tanpa persiapan. Panduan ini berlaku untuk semua kegiatan AKAR, baik pemantauan mandiri maupun kegiatan kelompok.

## Sebelum berangkat

- **Periksa jadwal pasang surut.** Rencanakan pengamatan saat air surut dan pastikan kamu kembali sebelum air naik.
- **Jangan pergi sendirian.** Ajak minimal satu teman dan beri tahu keluarga lokasi serta perkiraan jam pulang.
- **Isi daya ponsel** dan bawa pelindung tahan air untuk ponsel.
- **Bawa air minum, topi, dan obat pribadi.**

## Perlengkapan yang disarankan

- Sepatu bot karet atau sepatu yang mengikat erat di pergelangan kaki.
- Celana panjang dan baju lengan panjang untuk melindungi dari goresan dan nyamuk.
- Sarung tangan bila akan memungut sampah.
- Tongkat untuk menguji kedalaman lumpur.

## Saat di lapangan

1. Berjalan di atas akar atau jalur yang sudah ada, bukan di lumpur yang belum diketahui kedalamannya.
2. Bila kaki terbenam, jangan panik. Rebahkan badan untuk menyebarkan berat, lalu tarik kaki perlahan.
3. Hindari menyentuh getah buta-buta (*Excoecaria agallocha*). Getahnya dapat melukai mata dan kulit.
4. Waspadai satwa seperti ular dan buaya di wilayah tertentu. Ikuti arahan warga setempat.
5. Jangan mematahkan ranting atau mencabut bibit hanya untuk difoto. Cukup potret daunnya di pohon.

## Setelah kembali

Cuci tangan dan kaki, periksa luka goresan, lalu kirim laporanmu saat sinyal tersedia. AKAR menyimpan foto yang sudah dikompres sehingga unggahan tetap ringan.
$body$,
    '/img/web/mangrove-tangled-roots.jpg',
    '2026-11-13 08:00:00+07'
  ),
  (
    'membaca-kondisi-lokasi-mangrove',
    'Membaca kondisi lokasi: sehat, tertekan, rusak, atau banyak sampah',
    'Setiap laporan AKAR menyertakan kondisi lokasi. Begini cara menilainya secara konsisten agar data bisa dibandingkan dari waktu ke waktu.',
    $body$
Kondisi lokasi membantu pengelola memprioritaskan tindakan. Karena dinilai oleh banyak orang, kita perlu ukuran yang sama. Gunakan panduan berikut saat mengisi laporan.

## Sehat

- Tajuk rapat dan daun hijau segar.
- Banyak anakan atau bibit alami di sekitar pohon induk.
- Satwa seperti kepiting dan ikan kecil mudah dijumpai.
- Tidak ada tanda penebangan atau sampah yang berarti.

## Tertekan

- Banyak daun menguning, berlubang, atau rontok di luar kebiasaan.
- Ada pohon mati di beberapa titik.
- Air tampak keruh atau berbau, atau aliran pasang surut terhalang tanggul.
- Anakan sedikit atau tidak tumbuh.

## Rusak

- Ada bekas tebangan, pembakaran, atau alih fungsi lahan.
- Area terbuka luas yang dulunya ditumbuhi mangrove.
- Abrasi terlihat jelas: akar menggantung dan tanah terkikis.

## Banyak sampah

- Sampah plastik, jaring, atau styrofoam tersangkut di akar.
- Tumpukan sampah menutupi lumpur atau bibit.
- Pilih kondisi ini bila sampah menjadi masalah utama, walaupun pohonnya masih tampak sehat.

## Tips agar laporan berguna

1. Foto dari titik yang sama setiap kali datang, supaya perubahan mudah dibandingkan di halaman Riwayat lokasi.
2. Tuliskan hal yang tidak terlihat di foto, misalnya bau, suara gergaji, atau informasi dari warga.
3. Bila ragu antara dua kondisi, pilih yang lebih membutuhkan tindakan dan jelaskan di catatan.
$body$,
    '/img/web/mangrove-aerial-wetland.jpg',
    '2026-11-17 08:00:00+07'
  ),
  (
    'dari-laporan-ke-aksi',
    'Dari laporan ke aksi: perjalanan satu foto daun di AKAR',
    'Apa yang terjadi setelah kamu menekan tombol kirim? Inilah alur laporan dari prediksi awal, verifikasi, peta publik, sampai kegiatan konservasi.',
    $body$
AKAR dirancang agar setiap laporan masyarakat bisa berujung pada tindakan nyata. Berikut perjalanan sebuah laporan.

## 1. Pindai daun

Kamu memotret satu daun. Pindai AI menganalisis foto dari beberapa sudut pandang, mencatat ciri daun yang terlihat, lalu mencocokkannya dengan katalog spesies. Hasilnya selalu berlabel **Prediksi awal**, bukan kepastian.

## 2. Lengkapi laporan

Kamu menambahkan lokasi, waktu, kondisi, dan catatan. Titik GPS terisi otomatis, dan foto dikompres di perangkat supaya hemat kuota.

## 3. Verifikasi oleh administrator

Administrator memeriksa foto, prediksi, dan catatanmu. Ada tiga kemungkinan keputusan:

- **Terverifikasi**: laporan tampil di peta publik.
- **Perlu revisi**: kamu mendapat catatan dan bisa memperbaiki laporan.
- **Ditolak**: misalnya bila foto tidak berkaitan dengan mangrove.

## 4. Tampil di peta

Laporan terverifikasi muncul di Peta mangrove. Untuk lokasi sensitif, koordinatnya disamarkan agar tidak disalahgunakan.

## 5. Menjadi aktivitas konservasi

Koordinator kelompok konservasi memantau peta dan riwayat lokasi. Dari temuan yang terverifikasi, mereka menyusun aktivitas seperti penanaman bibit atau bersih pesisir, lalu mengumumkannya di AKAR. Kamu bisa ikut serta langsung dari dasbor.

## Mengapa verifikasi penting

Data yang salah bisa mengarahkan tenaga dan dana ke tempat yang keliru. Dengan memadukan bantuan AI dan pemeriksaan manusia, AKAR menjaga agar peta tetap bisa dipercaya oleh masyarakat, pemerintah desa, maupun peneliti.
$body$,
    '/img/web/mangrove-saplings.jpg',
    '2026-11-20 08:00:00+07'
  )
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  cover_path = excluded.cover_path,
  published_at = excluded.published_at;
