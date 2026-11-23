import { CloudBank, DriftingClouds } from '@/components/illustrations/cloud-sky'
import { SKY_GRADIENT } from '@/components/illustrations/parts'
import { Parallax } from '@/components/motion/parallax'

import { FeatureBento } from './feature-bento'
import { SectionIntro } from './section-intro'

export function FeaturesSection() {
  return (
    <section id="fitur" aria-labelledby="fitur-title" className="scroll-mt-24 bg-surface">
      <div className="relative isolate overflow-hidden" style={{ background: SKY_GRADIENT }}>
        <Parallax depth={20} className="absolute -inset-6 -z-10">
          <DriftingClouds />
        </Parallax>
        <div className="container-page pt-24 pb-10 sm:pt-32">
          <SectionIntro
            id="fitur-title"
            label="Fitur"
            title="Satu alur, dari pengamatan hingga aksi"
            description="Setiap fitur dirancang untuk kondisi lapangan: sinyal lemah, tangan basah, dan waktu yang singkat."
          />
        </div>
        <CloudBank floorColor="var(--color-surface)" className="h-[clamp(4.5rem,8vw,7.5rem)]" />
      </div>
      <div className="relative container-page -mt-6 pb-24 sm:-mt-10 sm:pb-32">
        <FeatureBento />
      </div>
    </section>
  )
}
