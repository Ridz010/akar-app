import { Suspense } from 'react'

import { CloudCluster } from '@/components/illustrations/cloud-cluster'
import { AboutSection } from '@/components/landing/about-section'
import { CtaSection } from '@/components/landing/cta-section'
import { FaqSection } from '@/components/landing/faq-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { RolesSection } from '@/components/landing/roles-section'
import { Parallax } from '@/components/motion/parallax'
import { CommunityHighlight, listFeaturedGroups } from '@/features/groups'
import { MapPreview, listPublicMapPoints } from '@/features/map'

async function MapPreviewData() {
  const points = await listPublicMapPoints()
  return <MapPreview points={points} />
}

async function CommunityHighlightData() {
  const groups = await listFeaturedGroups()
  return <CommunityHighlight groups={groups} />
}

function MapPreviewSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
      <div className="h-64 animate-pulse rounded-[1.25rem] bg-surface" />
      <div className="h-[26rem] animate-pulse rounded-[1.75rem] bg-surface sm:h-[32rem]" />
    </div>
  )
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <section
        id="peta"
        aria-labelledby="peta-title"
        className="relative isolate scroll-mt-24 overflow-hidden py-24 sm:py-32"
      >
        <Parallax depth={18} className="absolute top-6 -right-10 -z-10 w-[clamp(14rem,26vw,22rem)]">
          <CloudCluster />
        </Parallax>
        <Parallax
          depth={10}
          className="absolute bottom-10 -left-16 -z-10 w-[clamp(12rem,20vw,18rem)]"
        >
          <CloudCluster mirrored />
        </Parallax>
        <div className="container-page">
          <Suspense fallback={<MapPreviewSkeleton />}>
            <MapPreviewData />
          </Suspense>
        </div>
      </section>
      <HowItWorksSection />
      <RolesSection />
      <FaqSection />
      <CtaSection
        aside={
          <Suspense fallback={<div className="h-80 animate-pulse rounded-[1.25rem] bg-white/10" />}>
            <CommunityHighlightData />
          </Suspense>
        }
      />
    </>
  )
}
