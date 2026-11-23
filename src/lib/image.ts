export type OptimizedWidth = 640 | 750 | 828 | 1080 | 1200 | 1920

export function optimizedImage(src: string, width: OptimizedWidth = 828, quality = 75) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}
