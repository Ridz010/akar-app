import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY
const password = process.env.DEMO_PASSWORD ?? 'AkarDemo#2026'
const bucket = 'observation-photos'
const reset = process.argv.includes('--reset')

if (!url || !secretKey) {
  console.error(
    'Butuh SUPABASE_URL (atau NEXT_PUBLIC_SUPABASE_URL) dan SUPABASE_SECRET_KEY.\n' +
      'Contoh: node --env-file=backend/.env scripts/seed-demo.mjs',
  )
  process.exit(1)
}

const db = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const ACCOUNTS = [
  { key: 'admin', email: 'demo-admin@example.com', name: 'Admin AKAR (demo)', role: 'admin' },
  {
    key: 'coordinator',
    email: 'demo-koordinator@example.com',
    name: 'Koordinator Pesisir (demo)',
    role: 'coordinator',
    group: 'balikpapan',
  },
  {
    key: 'volunteer',
    email: 'demo-relawan@example.com',
    name: 'Relawan Pesisir (demo)',
    role: 'community',
    group: 'balikpapan',
  },
  {
    key: 'volunteer2',
    email: 'demo-relawan2@example.com',
    name: 'Relawan Teluk (demo)',
    role: 'community',
    group: 'teluk',
  },
]

const GROUPS = [
  {
    key: 'balikpapan',
    name: 'Kelompok Pesisir Balikpapan (demo)',
    region: 'Balikpapan, Kalimantan Timur',
  },
  {
    key: 'teluk',
    name: 'Komunitas Mangrove Teluk (demo)',
    region: 'Penajam Paser Utara, Kalimantan Timur',
  },
]

const LOCATIONS = [
  {
    key: 'graha',
    name: 'Pesisir Graha Indah',
    latitude: -1.1975,
    longitude: 116.859,
    group: 'balikpapan',
  },
  {
    key: 'margasari',
    name: 'Kampung atas air Margasari',
    latitude: -1.2575,
    longitude: 116.8135,
    group: 'balikpapan',
  },
  {
    key: 'manggar',
    name: 'Muara Sungai Manggar',
    latitude: -1.2105,
    longitude: 116.9805,
    group: 'balikpapan',
  },
  {
    key: 'penajam',
    name: 'Teluk Balikpapan sisi Penajam',
    latitude: -1.243,
    longitude: 116.772,
    group: 'teluk',
    sensitive: true,
  },
  {
    key: 'tahura',
    name: 'Tepi Tahura Ngurah Rai, Bali',
    latitude: -8.735,
    longitude: 115.205,
    group: 'teluk',
  },
  {
    key: 'wonorejo',
    name: 'Pesisir Wonorejo, Surabaya',
    latitude: -7.307,
    longitude: 112.824,
    group: 'teluk',
  },
]

const OBSERVATIONS = [
  {
    by: 'volunteer',
    at: 'graha',
    days: 3,
    condition: 'healthy',
    species: 'Rhizophora mucronata',
    photo: 'mangrove-prop-roots.jpg',
    decision: 'verified',
    notes: 'Banyak anakan tumbuh di sekitar pohon induk.',
    traits: [
      'Ujung daun berduri kecil',
      'Daun tebal seperti kulit',
      'Bintik hitam di permukaan bawah',
    ],
  },
  {
    by: 'volunteer',
    at: 'graha',
    days: 34,
    condition: 'stressed',
    species: 'Rhizophora mucronata',
    photo: 'mangrove-tangled-roots.jpg',
    decision: 'verified',
    notes: 'Sebagian daun menguning setelah air keruh beberapa hari.',
    traits: ['Daun jorong lebar', 'Ujung daun berduri kecil'],
  },
  {
    by: 'volunteer',
    at: 'margasari',
    days: 6,
    condition: 'littered',
    species: 'Avicennia marina',
    photo: 'mangrove-sunset-roots.jpg',
    decision: 'verified',
    notes: 'Sampah plastik tersangkut di akar napas setelah pasang tinggi.',
    traits: ['Permukaan bawah keputihan', 'Ujung daun agak runcing'],
  },
  {
    by: 'volunteer2',
    at: 'margasari',
    days: 41,
    condition: 'littered',
    species: 'Avicennia marina',
    photo: 'mangrove-river-reflection.jpg',
    decision: 'verified',
    notes: 'Jaring bekas menutupi sebagian bibit.',
    traits: ['Permukaan bawah keputihan'],
  },
  {
    by: 'volunteer2',
    at: 'manggar',
    days: 9,
    condition: 'damaged',
    species: 'Sonneratia alba',
    photo: 'mangrove-quiet-river.jpg',
    decision: 'verified',
    notes: 'Ada bekas tebangan di tepi muara.',
    traits: ['Daun berdaging', 'Ujung daun membundar'],
  },
  {
    by: 'volunteer',
    at: 'penajam',
    days: 12,
    condition: 'healthy',
    species: 'Bruguiera gymnorrhiza',
    photo: 'mangrove-prop-root-line.jpg',
    decision: 'verified',
    notes: 'Tajuk rapat, kepiting mudah dijumpai.',
    traits: ['Ujung daun runcing tanpa duri', 'Tangkai daun kemerahan'],
  },
  {
    by: 'volunteer2',
    at: 'tahura',
    days: 15,
    condition: 'healthy',
    species: 'Rhizophora apiculata',
    photo: 'mangrove-underwater-roots.jpg',
    decision: 'verified',
    notes: 'Akar tunjang rapat di sepanjang kanal.',
    traits: ['Daun ramping', 'Tangkai kemerahan', 'Mukro pendek di ujung daun'],
  },
  {
    by: 'volunteer2',
    at: 'wonorejo',
    days: 20,
    condition: 'stressed',
    species: 'Avicennia marina',
    photo: 'mangrove-aerial-wetland.jpg',
    decision: 'verified',
    notes: 'Genangan tidak surut di bagian belakang tanggul.',
    traits: ['Permukaan bawah keputihan'],
  },
  {
    by: 'coordinator',
    at: 'graha',
    days: 1,
    condition: 'healthy',
    species: 'Ceriops tagal',
    photo: 'mangrove-saplings.jpg',
    decision: 'verified',
    notes: 'Bibit hasil penanaman bulan lalu tumbuh baik.',
    traits: ['Ujung daun membundar', 'Hijau kekuningan mengilap'],
  },
  {
    by: 'volunteer',
    at: 'manggar',
    days: 2,
    condition: 'damaged',
    species: null,
    photo: 'mangrove-lone-tree.jpg',
    decision: 'revision_required',
    note: 'Tambahkan foto daun dari dekat agar spesiesnya bisa dipastikan.',
    notes: 'Pohon tersisa sedikit di sisi timur.',
    traits: [],
  },
  {
    by: 'volunteer2',
    at: 'penajam',
    days: 1,
    condition: 'healthy',
    species: 'Sonneratia alba',
    photo: 'mangrove-hand-leaf.jpg',
    decision: null,
    notes: 'Pohon besar dengan akar napas kerucut.',
    traits: ['Daun tebal berdaging', 'Ujung daun membundar'],
  },
  {
    by: 'volunteer',
    at: 'margasari',
    days: 0,
    condition: 'littered',
    species: 'Rhizophora mucronata',
    photo: 'leaf-rosette.jpg',
    decision: null,
    notes: 'Sampah kembali menumpuk di dekat dermaga.',
    traits: ['Daun jorong', 'Ujung daun runcing'],
  },
]

const ACTIVITIES = [
  {
    title: 'Bersih pesisir Margasari',
    group: 'balikpapan',
    at: 'margasari',
    days: 5,
    hours: 3,
    status: 'planned',
    description:
      'Memungut sampah plastik dan jaring yang tersangkut di akar. Bawa sarung tangan dan sepatu bot. Titik kumpul di dermaga.',
    from: 2,
  },
  {
    title: 'Penanaman bibit bakau di Graha Indah',
    group: 'balikpapan',
    at: 'graha',
    days: 12,
    hours: 4,
    status: 'planned',
    description:
      'Menanam bibit Rhizophora di area yang terbuka. Bibit disiapkan kelompok, peserta cukup membawa air minum.',
    from: 0,
  },
  {
    title: 'Pemantauan bersama Muara Manggar',
    group: 'balikpapan',
    at: 'manggar',
    days: 0,
    hours: 3,
    status: 'ongoing',
    description: 'Mendata bekas tebangan dan memotret ulang titik yang sama untuk riwayat lokasi.',
    from: 4,
  },
  {
    title: 'Penanaman Ceriops di Graha Indah',
    group: 'teluk',
    at: 'graha',
    days: -30,
    hours: 4,
    status: 'completed',
    description: 'Kegiatan penanaman bersama warga dan pelajar.',
    from: 8,
  },
]

function daysFromNow(days, hour = 8) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + days)
  date.setUTCHours(hour - 7, 0, 0, 0)
  return date.toISOString()
}

function check(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function findUserByEmail(email) {
  for (let page = 1; page < 20; page += 1) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const found = data.users.find((user) => user.email === email)
    if (found) return found
    if (data.users.length < 200) return null
  }
  return null
}

async function ensureUser(account) {
  const existing = await findUserByEmail(account.email)
  if (existing) return existing.id
  const { data, error } = await db.auth.admin.createUser({
    email: account.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: account.name },
  })
  if (error) throw new Error(`Akun ${account.email}: ${error.message}`)
  return data.user.id
}

async function ensureRow(table, match, values) {
  let query = db.from(table).select('id')
  for (const [column, value] of Object.entries(match)) query = query.eq(column, value)
  const found = check(await query.limit(1), `Cari ${table}`)
  if (found.length > 0) return found[0].id
  const inserted = check(
    await db
      .from(table)
      .insert({ ...match, ...values })
      .select('id')
      .single(),
    `Tambah ${table}`,
  )
  return inserted.id
}

async function seed() {
  const species = check(
    await db.from('species').select('id, scientific_name, model_label, local_name'),
    'Spesies',
  )
  if (species.length === 0)
    throw new Error('Tabel species kosong. Jalankan supabase/seed.sql lebih dulu.')
  const speciesByName = Object.fromEntries(species.map((row) => [row.scientific_name, row]))

  const groups = {}
  for (const group of GROUPS) {
    groups[group.key] = await ensureRow(
      'conservation_groups',
      { name: group.name },
      { region: group.region },
    )
  }

  const users = {}
  for (const account of ACCOUNTS) {
    const id = await ensureUser(account)
    users[account.key] = id
    check(
      await db
        .from('profiles')
        .update({
          full_name: account.name,
          role: account.role,
          group_id: account.group ? groups[account.group] : null,
          show_name_publicly: false,
        })
        .eq('id', id),
      `Profil ${account.email}`,
    )
  }

  const locations = {}
  for (const location of LOCATIONS) {
    locations[location.key] = await ensureRow(
      'locations',
      { name: location.name },
      {
        latitude: location.latitude,
        longitude: location.longitude,
        is_sensitive: Boolean(location.sensitive),
        group_id: groups[location.group],
        created_by: users.coordinator,
      },
    )
  }

  const demoUserIds = Object.values(users)
  const existingObservations = check(
    await db.from('observations').select('id', { count: 'exact' }).in('user_id', demoUserIds),
    'Cek laporan demo',
  )

  const observationIds = []
  if (existingObservations.length === 0) {
    for (const item of OBSERVATIONS) {
      const userId = users[item.by]
      const path = `${userId}/${randomUUID()}.jpg`
      const file = await readFile(join('public', 'img', 'web', item.photo))
      check(
        await db.storage
          .from(bucket)
          .upload(path, file, { contentType: 'image/jpeg', upsert: false }),
        `Unggah ${item.photo}`,
      )

      const location = LOCATIONS.find((entry) => entry.key === item.at)
      const jitter = (observationIds.length % 5) * 0.0006
      const target = item.species ? speciesByName[item.species] : null
      const observation = check(
        await db
          .from('observations')
          .insert({
            user_id: userId,
            location_id: locations[item.at],
            latitude: location.latitude + jitter,
            longitude: location.longitude - jitter,
            observed_at: daysFromNow(-item.days, 9),
            photo_path: path,
            condition: item.condition,
            notes: item.notes,
          })
          .select('id')
          .single(),
        'Tambah laporan',
      )
      observationIds.push(observation.id)

      const confidence = target ? 0.86 - (observationIds.length % 4) * 0.08 : 0
      check(
        await db.from('predictions').insert({
          user_id: userId,
          observation_id: observation.id,
          photo_path: path,
          prediction_status: !target
            ? 'unrecognized'
            : confidence >= 0.8
              ? 'confident'
              : 'needs_review',
          predicted_label: target?.model_label ?? null,
          species_id: target?.id ?? null,
          confidence,
          top_k: target
            ? [{ label: target.scientific_name, local_name: target.local_name, confidence }]
            : [],
          observed_traits: item.traits,
          photo_quality: target ? 'good' : 'fair',
          photo_feedback: target ? null : 'Dekatkan kamera ke satu daun dengan latar polos.',
          agreement: target ? 1 : 0.67,
          model_version: 'demo-seed',
        }),
        'Tambah prediksi',
      )

      if (item.decision) {
        check(
          await db.from('verifications').insert({
            observation_id: observation.id,
            verifier_id: users.admin,
            decision: item.decision,
            species_id: target?.id ?? null,
            note: item.note ?? null,
          }),
          'Tambah verifikasi',
        )
      }
    }
  } else {
    console.log('Laporan demo sudah ada, langkah laporan dilewati.')
  }

  for (const activity of ACTIVITIES) {
    const id = await ensureRow(
      'activities',
      { title: activity.title },
      {
        description: activity.description,
        location_id: locations[activity.at],
        group_id: groups[activity.group],
        source_observation_id: observationIds[activity.from] ?? null,
        starts_at: daysFromNow(activity.days, 8),
        ends_at: daysFromNow(activity.days, 8 + activity.hours),
        status: activity.status,
        created_by: users.coordinator,
      },
    )
    for (const key of ['volunteer', 'volunteer2']) {
      if (activity.status === 'cancelled') continue
      check(
        await db.from('activity_participants').upsert({ activity_id: id, user_id: users[key] }),
        'Tambah peserta',
      )
    }
  }

  console.log('\nData demo siap. Masuk dengan kata sandi yang sama untuk semua akun:')
  for (const account of ACCOUNTS) console.log(`  ${account.role.padEnd(12)} ${account.email}`)
  console.log(`  kata sandi    ${password}`)
}

async function removeDemo() {
  for (const account of ACCOUNTS) {
    const user = await findUserByEmail(account.email)
    if (!user) continue
    const files = check(await db.storage.from(bucket).list(user.id, { limit: 1000 }), 'Daftar foto')
    if (files.length > 0) {
      check(
        await db.storage.from(bucket).remove(files.map((file) => `${user.id}/${file.name}`)),
        'Hapus foto',
      )
    }
    const { error } = await db.auth.admin.deleteUser(user.id)
    if (error) throw new Error(`Hapus ${account.email}: ${error.message}`)
  }
  check(
    await db
      .from('activities')
      .delete()
      .in(
        'title',
        ACTIVITIES.map((a) => a.title),
      ),
    'Hapus kegiatan',
  )
  check(
    await db
      .from('locations')
      .delete()
      .in(
        'name',
        LOCATIONS.map((l) => l.name),
      ),
    'Hapus lokasi',
  )
  check(
    await db
      .from('conservation_groups')
      .delete()
      .in(
        'name',
        GROUPS.map((g) => g.name),
      ),
    'Hapus kelompok',
  )
  console.log('Data demo dihapus.')
}

try {
  await (reset ? removeDemo() : seed())
} catch (error) {
  console.error(`Gagal: ${error.message}`)
  process.exit(1)
}
