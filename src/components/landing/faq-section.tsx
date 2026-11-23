import { CloudCluster } from '@/components/illustrations/cloud-cluster'
import { Parallax } from '@/components/motion/parallax'
import { Reveal } from '@/components/motion/reveal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { INITIAL_SUPPORTED_SPECIES } from '@/config/constants'
import { siteConfig } from '@/config/site'

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'Apakah hasil identifikasi selalu benar?',
    answer:
      'Tidak. Hasil dari model adalah prediksi awal yang disertai tingkat keyakinan. Setiap laporan tetap diperiksa pengelola. Bila model kurang yakin, hasilnya ditandai perlu pemeriksaan, dan bila daun tidak cocok dengan spesies yang dikenal, hasilnya ditandai tidak dikenali.',
  },
  {
    question: 'Spesies apa saja yang bisa dikenali?',
    answer: `Pada tahap awal, model mengenali minimal ${INITIAL_SUPPORTED_SPECIES} spesies mangrove. Jumlahnya bertambah seiring terkumpulnya foto yang sudah diverifikasi.`,
  },
  {
    question: 'Apakah lokasi saya ditampilkan untuk publik?',
    answer:
      'Hanya laporan terverifikasi yang tampil di peta publik. Lokasi sensitif disamarkan, dan identitas kontributor tidak ditampilkan tanpa persetujuanmu.',
  },
  {
    question: 'Siapa yang memverifikasi laporan?',
    answer:
      'Administrator AKAR memeriksa setiap laporan. Koordinator kelompok konservasi menindaklanjuti temuan yang sudah terverifikasi menjadi aktivitas di lapangan.',
  },
  {
    question: 'Apakah AKAR gratis untuk masyarakat?',
    answer:
      'AKAR dikembangkan untuk mendukung masyarakat pesisir dan kelompok konservasi. Ketentuan penggunaan lengkap diumumkan menjelang peluncuran.',
  },
]

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative isolate scroll-mt-24 overflow-hidden bg-surface py-24 sm:py-32"
    >
      <Parallax depth={14} className="absolute top-8 -left-12 -z-10 w-[clamp(12rem,22vw,20rem)]">
        <CloudCluster tone="white" />
      </Parallax>
      <div className="container-page grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <Reveal className="space-y-6">
          <p className="text-sm text-sage-700">Tanya jawab</p>
          <h2 id="faq-title" className="type-title text-ink">
            Yang sering ditanyakan
          </h2>
          <p className="max-w-sm text-slate">
            {siteConfig.contactEmail ? (
              <>
                Pertanyaan lain? Tulis ke{' '}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-sage-700 underline underline-offset-4"
                >
                  {siteConfig.contactEmail}
                </a>
                .
              </>
            ) : (
              'Kontak resmi tim AKAR akan diumumkan menjelang peluncuran.'
            )}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion className="border-t border-line">
            {FAQS.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="border-line">
                <AccordionTrigger className="py-6 text-lg font-normal text-ink hover:no-underline sm:text-xl">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base text-slate">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
