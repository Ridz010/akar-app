import { SITE_CONDITION_LABELS } from '@/config/constants'

import type { Guide, SpeciesProfile } from './types'

export const SPECIES_PROFILES: SpeciesProfile[] = [
  {
    scientificName: 'Rhizophora mucronata',
    localName: 'Bakau hitam',
    family: 'Rhizophoraceae',
    traits: [
      { label: 'Daun', value: 'Lebar dan jorong dengan ujung meruncing seperti duri kecil.' },
      { label: 'Akar', value: 'Akar tunjang melengkung dari batang ke lumpur.' },
      { label: 'Ciri lain', value: 'Sisi bawah daun berbintik cokelat kehitaman.' },
    ],
  },
  {
    scientificName: 'Avicennia marina',
    localName: 'Api-api putih',
    family: 'Acanthaceae',
    traits: [
      { label: 'Daun', value: 'Atas hijau mengilap, bawah keabu-abuan dan berbulu halus.' },
      { label: 'Akar', value: 'Akar napas kecil tegak seperti pensil di sekitar pohon.' },
      { label: 'Ciri lain', value: 'Kristal garam kadang terlihat di permukaan daun.' },
    ],
  },
  {
    scientificName: 'Sonneratia alba',
    localName: 'Pedada',
    family: 'Lythraceae',
    traits: [
      { label: 'Daun', value: 'Membulat, tebal, dan tumbuh berhadapan.' },
      { label: 'Akar', value: 'Akar napas berbentuk kerucut muncul dari lumpur.' },
      { label: 'Ciri lain', value: 'Buah bulat pipih dengan kelopak berbentuk bintang.' },
    ],
  },
  {
    scientificName: 'Bruguiera gymnorrhiza',
    localName: 'Tancang',
    family: 'Rhizophoraceae',
    traits: [
      { label: 'Daun', value: 'Jorong, tebal seperti kulit, ujung meruncing.' },
      { label: 'Akar', value: 'Akar lutut yang menyembul melengkung dari tanah.' },
      { label: 'Ciri lain', value: 'Kelopak bunga merah dengan banyak cuping.' },
    ],
  },
]

export const GUIDES: Guide[] = [
  {
    slug: 'memotret-daun',
    title: 'Memotret daun',
    summary: 'Foto yang jelas membuat prediksi lebih tepat dan verifikasi lebih cepat.',
    steps: [
      'Pilih satu daun utuh yang tidak rusak.',
      'Letakkan di atas latar polos, misalnya kertas atau telapak tangan.',
      'Gunakan cahaya alami dan hindari bayangan keras.',
      'Isi bingkai dengan daun dan pastikan fokusnya tajam.',
      'Ambil juga foto sisi bawah daun bila memungkinkan.',
    ],
  },
  {
    slug: 'aman-di-lapangan',
    title: 'Aman di lapangan',
    summary: 'Kawasan mangrove berlumpur dan dipengaruhi pasang surut.',
    steps: [
      'Periksa jadwal pasang surut sebelum berangkat.',
      'Pergi minimal berdua dan kabari orang lain tujuanmu.',
      'Gunakan alas kaki tertutup yang tidak licin.',
      'Hindari menginjak bibit dan akar napas.',
      'Cukup potret, tidak perlu memetik daun dari pohon.',
    ],
  },
  {
    slug: 'menilai-kondisi',
    title: 'Menilai kondisi lokasi',
    summary: 'Pilih kondisi yang paling menggambarkan lokasi saat kamu datang.',
    steps: [
      `${SITE_CONDITION_LABELS.healthy}: tajuk rapat, daun hijau, banyak anakan.`,
      `${SITE_CONDITION_LABELS.stressed}: daun menguning atau tajuk mulai jarang.`,
      `${SITE_CONDITION_LABELS.damaged}: ada penebangan, pohon tumbang, atau abrasi.`,
      `${SITE_CONDITION_LABELS.littered}: sampah tersangkut di akar atau menumpuk.`,
    ],
  },
]
