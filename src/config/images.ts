export type SiteImage = {
  src: string
  alt: string
  width: number
  height: number
  credit?: { author: string; url: string }
}

export const images = {
  hero: {
    src: '/img/web/mangrove-shoreline.jpg',
    alt: 'Deretan hutan mangrove hijau lebat di tepi perairan dengan akar yang terlihat dan langit biru berawan',
    width: 2560,
    height: 1709,
  },
  sunsetRoots: {
    src: '/img/web/mangrove-sunset-roots.jpg',
    alt: 'Akar gantung dan dahan mangrove membingkai laut saat matahari terbenam',
    width: 1600,
    height: 900,
  },
  riverReflection: {
    src: '/img/web/mangrove-river-reflection.jpg',
    alt: 'Kanal sungai di antara pepohonan mangrove dengan pantulan hijau di air dan langit biru',
    width: 2560,
    height: 1707,
  },
  propRoots: {
    src: '/img/web/mangrove-prop-roots.jpg',
    alt: 'Akar tunjang mangrove berwarna pucat menjulang dari air dangkal di bawah rimbun daun hijau',
    width: 2000,
    height: 1333,
    credit: {
      author: 'Jimmy Blackwell',
      url: 'https://unsplash.com/photos/mangrove-roots-are-partially-submerged-in-water-JyVPdNe75lg',
    },
  },
  tangledRoots: {
    src: '/img/web/mangrove-tangled-roots.jpg',
    alt: 'Pohon mangrove dengan akar yang saling membelit tumbuh di air tenang berwarna gelap',
    width: 2000,
    height: 1333,
    credit: {
      author: 'Timothy K',
      url: 'https://unsplash.com/photos/mangrove-trees-in-dark-water-1CiE1x4dHIY',
    },
  },
  underwaterRoots: {
    src: '/img/web/mangrove-underwater-roots.jpg',
    alt: 'Pandangan setengah di bawah air: akar mangrove menjuntai ke laut jernih di bawah pohon dan langit cerah',
    width: 2000,
    height: 1500,
    credit: {
      author: 'Kristin Hoel',
      url: 'https://unsplash.com/photos/an-underwater-view-of-a-mangrove-forest-i5kMNyhiw6c',
    },
  },
  shoreline: {
    src: '/img/web/mangrove-prop-root-line.jpg',
    alt: 'Barisan mangrove dengan akar tunjang yang rapat tumbuh di tepi perairan payau',
    width: 2000,
    height: 1333,
    credit: {
      author: 'P Mantha',
      url: 'https://unsplash.com/photos/mangrove-trees-with-their-distinctive-roots-growing-in-calm-water-JFh2p1iy27I',
    },
  },
  loneTree: {
    src: '/img/web/mangrove-lone-tree.jpg',
    alt: 'Sebatang pohon mangrove muda berdiri di atas akarnya di tengah air biru yang tenang',
    width: 2000,
    height: 3000,
    credit: {
      author: 'Bernd Dittrich',
      url: 'https://unsplash.com/photos/mangrove-tree-with-exposed-roots-in-calm-blue-water-UYbtxSM7YPk',
    },
  },
  quietRiver: {
    src: '/img/web/mangrove-quiet-river.jpg',
    alt: 'Sungai tenang mengalir di antara hutan mangrove yang rimbun',
    width: 2000,
    height: 1333,
    credit: {
      author: 'You Le',
      url: 'https://unsplash.com/photos/a-serene-mangrove-forest-with-a-calm-river-flowing-3AEytv8xS0Y',
    },
  },
  handLeaf: {
    src: '/img/web/mangrove-hand-leaf.jpg',
    alt: 'Tangan menyentuh pucuk daun mangrove yang hijau mengilap',
    width: 2000,
    height: 3000,
    credit: {
      author: 'Joylynn Goh',
      url: 'https://unsplash.com/photos/a-person-is-picking-leaves-off-of-a-tree-x6DoI-s7eaI',
    },
  },
  leafRosette: {
    src: '/img/web/leaf-rosette.jpg',
    alt: 'Roset daun hijau segar dengan latar dedaunan gelap',
    width: 2000,
    height: 3000,
    credit: {
      author: 'Patrick Hendry',
      url: 'https://unsplash.com/photos/a-green-leaf-with-drops-of-water-on-it-h1PaT2um6xo',
    },
  },
  saplings: {
    src: '/img/web/mangrove-saplings.jpg',
    alt: 'Bibit mangrove muda tumbuh berjajar di pasir pantai',
    width: 2000,
    height: 1333,
    credit: {
      author: 'Sara Aurora Cimminiello',
      url: 'https://unsplash.com/photos/a-small-lizard-scurries-among-young-mangrove-saplings-FyaIuDIacTs',
    },
  },
  aerialCanopy: {
    src: '/img/web/mangrove-aerial-canopy.jpg',
    alt: 'Foto udara tajuk mangrove hijau berbatasan dengan perairan cokelat keruh',
    width: 2000,
    height: 1500,
    credit: {
      author: 'Waranont (Joe)',
      url: 'https://unsplash.com/photos/birds-eye-photography-of-trees-xIwYx_U9yNU',
    },
  },
  aerialRiver: {
    src: '/img/web/mangrove-aerial-river.jpg',
    alt: 'Foto udara sungai berkelok membelah hutan hijau yang lebat',
    width: 2000,
    height: 1125,
    credit: {
      author: 'Agung Hidayat',
      url: 'https://unsplash.com/photos/a-river-running-through-a-lush-green-forest-jQ6FCly--vI',
    },
  },
  aerialWetland: {
    src: '/img/web/mangrove-aerial-wetland.jpg',
    alt: 'Foto udara perairan dangkal yang dikelilingi rumpun mangrove',
    width: 2000,
    height: 1332,
    credit: {
      author: 'Héctor Mavare',
      url: 'https://unsplash.com/photos/an-aerial-view-of-a-body-of-water-surrounded-by-trees-CYtuAEW1W7g',
    },
  },
  aerialChannel: {
    src: '/img/web/mangrove-aerial-channel.jpg',
    alt: 'Foto udara alur sungai berkelok di tengah hutan mangrove',
    width: 2000,
    height: 1125,
    credit: {
      author: 'Collins Lesulie',
      url: 'https://unsplash.com/photos/a-winding-river-flows-through-a-lush-green-mangrove-forest-ry1N8T-Lbyc',
    },
  },
  aerialDarkWater: {
    src: '/img/web/mangrove-aerial-dark-water.jpg',
    alt: 'Foto udara hutan hijau lebat di tepi perairan gelap',
    width: 2000,
    height: 1124,
    credit: {
      author: 'Hugh Whyte',
      url: 'https://unsplash.com/photos/aerial-view-of-lush-green-forest-bordering-dark-water-h1prnnV1KE4',
    },
  },
} satisfies Record<string, SiteImage>

export type ImageKey = keyof typeof images
