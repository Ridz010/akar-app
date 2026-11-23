import { Fragment, type ReactNode } from 'react'

type Block =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }

const BULLET = /^[-*]\s+/
const NUMBERED = /^\d+[.)]\s+/

function parse(markdown: string): Block[] {
  const blocks: Block[] = []
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ kind: 'paragraph', text: paragraph.join(' ') })
    paragraph = []
  }

  for (const raw of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim()
    if (!line) {
      flushParagraph()
      continue
    }
    const heading = /^(#{2,3})\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      blocks.push({ kind: 'heading', level: heading[1].length === 2 ? 2 : 3, text: heading[2] })
      continue
    }
    const ordered = NUMBERED.test(line)
    if (ordered || BULLET.test(line)) {
      flushParagraph()
      const text = line.replace(ordered ? NUMBERED : BULLET, '')
      const last = blocks.at(-1)
      if (last?.kind === 'list' && last.ordered === ordered) last.items.push(text)
      else blocks.push({ kind: 'list', ordered, items: [text] })
      continue
    }
    paragraph.push(line)
  }
  flushParagraph()
  return blocks
}

function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-medium text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  )
}

export function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-relaxed text-ink/90">
      {parse(markdown).map((block, index) => {
        if (block.kind === 'heading') {
          return block.level === 2 ? (
            <h2 key={index} className="pt-6 font-display text-3xl leading-tight text-ink">
              {block.text}
            </h2>
          ) : (
            <h3 key={index} className="pt-2 font-display text-2xl leading-tight text-ink">
              {block.text}
            </h3>
          )
        }
        if (block.kind === 'list') {
          const List = block.ordered ? 'ol' : 'ul'
          return (
            <List
              key={index}
              className={
                block.ordered
                  ? 'list-decimal space-y-2 pl-6 marker:text-sage-700'
                  : 'list-disc space-y-2 pl-6 marker:text-sage-600'
              }
            >
              {block.items.map((item) => (
                <li key={item}>{inline(item)}</li>
              ))}
            </List>
          )
        }
        return <p key={index}>{inline(block.text)}</p>
      })}
    </div>
  )
}
