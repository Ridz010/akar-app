import { Reveal } from '@/components/motion/reveal'

import { GUIDES } from '../content'

export function GuideList() {
  return (
    <Reveal stagger={0.1} className="grid gap-12 lg:grid-cols-3 lg:gap-8">
      {GUIDES.map((guide) => (
        <article key={guide.slug} id={guide.slug} className="scroll-mt-28 border-t border-ink pt-6">
          <h3 className="text-3xl leading-tight text-ink">{guide.title}</h3>
          <p className="mt-2 text-slate">{guide.summary}</p>
          <ol className="mt-6 space-y-3 text-sm text-ink">
            {guide.steps.map((step) => (
              <li key={step} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-sage-600" />
                {step}
              </li>
            ))}
          </ol>
        </article>
      ))}
    </Reveal>
  )
}
