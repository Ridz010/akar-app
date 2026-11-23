import { FallingLeaves, NightForest } from '@/components/illustrations/night-forest'
import AccordionGallery from '@/components/motion/AccordionGallery'
import { Reveal } from '@/components/motion/reveal'
import { images, type SiteImage } from '@/config/images'
import { optimizedImage } from '@/lib/image'

import { SectionIntro } from './section-intro'

const STEPS: { title: string; body: string; image: SiteImage }[] = [
  {
    title: 'Potret daun',
    body: 'Ambil foto satu daun dengan latar polos. Model memberi prediksi awal spesiesnya.',
    image: images.handLeaf,
  },
  {
    title: 'Lengkapi laporan',
    body: 'Titik lokasi, waktu, dan kondisi lapangan terisi dalam satu formulir singkat.',
    image: images.propRoots,
  },
  {
    title: 'Diverifikasi pengelola',
    body: 'Administrator memeriksa foto dan prediksi, lalu titiknya tampil di peta publik.',
    image: images.aerialChannel,
  },
  {
    title: 'Ditindaklanjuti',
    body: 'Temuan dijadikan kegiatan bersama, seperti penanaman atau bersih pesisir.',
    image: images.saplings,
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="cara-kerja"
      aria-labelledby="cara-kerja-title"
      className="relative isolate scroll-mt-24 overflow-hidden bg-sage-900 pt-24 pb-[clamp(8rem,16vw,13rem)] text-white sm:pt-32"
    >
      <NightForest className="absolute inset-x-0 bottom-0 -z-10 h-[clamp(12rem,24vw,21rem)]" />
      <FallingLeaves className="-z-10" />
      <div className="container-page">
        <SectionIntro
          id="cara-kerja-title"
          label="Cara kerja"
          tone="dark"
          title="Dari satu foto daun hingga aksi di pesisir"
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <Reveal
            stagger={0.08}
            className="flex flex-col divide-y divide-white/15 border-y border-white/15"
          >
            {STEPS.map((step) => (
              <div key={step.title} className="py-6">
                <h3 className="font-display text-2xl text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/75">{step.body}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <AccordionGallery
              ariaLabel="Foto langkah cara kerja AKAR"
              items={STEPS.map((step) => ({
                image: optimizedImage(step.image.src, 1080),
                label: step.title,
                alt: step.image.alt,
              }))}
              defaultIndex={0}
              height={520}
              gap={10}
              radius={22}
              expandRatio={0.55}
              accentColor="#cfea5e"
              overlayColor="#1c261d"
              textColor="#ffffff"
              duration={0.55}
              tilt={4}
              grayscale={false}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
