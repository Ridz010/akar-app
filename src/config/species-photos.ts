export type SpeciesPhoto = {
  src: string
  alt: string
  width: number
  height: number
  credit: {
    author: string
    license: string
    sourceUrl: string
  }
}

export const SPECIES_PHOTOS: Record<string, SpeciesPhoto> = {
  rhizophora_mucronata: {
    src: '/img/species/rhizophora_mucronata.jpg',
    alt: 'Ranting bakau hitam dengan daun lebar dan propagul panjang yang menggantung',
    width: 750,
    height: 1000,
    credit: {
      author: 'Anonymous Powered',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rhizophora_mucronata_Propagules.jpg',
    },
  },
  rhizophora_apiculata: {
    src: '/img/species/rhizophora_apiculata.jpg',
    alt: 'Daun bakau minyak yang ramping dengan stipula kemerahan di pucuk ranting',
    width: 1000,
    height: 750,
    credit: {
      author: 'Judgefloro',
      license: 'CC BY-SA 4.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Reddish_stipules_of_Rhizophora_apiculata.JPG',
    },
  },
  bruguiera_gymnorrhiza: {
    src: '/img/species/bruguiera_gymnorrhiza.jpg',
    alt: 'Daun tancang yang tebal mengilap dengan bunga merah kecil',
    width: 640,
    height: 640,
    credit: {
      author: 'Ulf Mehlig',
      license: 'CC BY-SA 2.5',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bruguiera_gymnorrhiza.jpg',
    },
  },
  ceriops_tagal: {
    src: '/img/species/ceriops_tagal.jpg',
    alt: 'Daun tengar bulat telur terbalik yang bergerombol di ujung ranting',
    width: 1000,
    height: 750,
    credit: {
      author: 'Dinesh Valke from Thane, India',
      license: 'CC BY-SA 2.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Ceriops_tagal_(Perr.)_C.B.Rob._(48149768851).jpg',
    },
  },
  avicennia_marina: {
    src: '/img/species/avicennia_marina.jpg',
    alt: 'Permukaan bawah daun api-api putih yang pucat keputihan',
    width: 960,
    height: 720,
    credit: {
      author: 'Dinesh Valke from Thane, India',
      license: 'CC BY-SA 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Avicennia_marina_(3602583285).jpg',
    },
  },
  sonneratia_alba: {
    src: '/img/species/sonneratia_alba.jpg',
    alt: 'Buah pedada yang bulat dikelilingi daun tebal membundar',
    width: 1000,
    height: 938,
    credit: {
      author: 'Ton Rulkens from Mozambique',
      license: 'CC BY-SA 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sonneratia_alba_-_fruit_(8349980264).jpg',
    },
  },
  xylocarpus_granatum: {
    src: '/img/species/xylocarpus_granatum.jpg',
    alt: 'Buah nyirih yang bulat besar menggantung di antara daun',
    width: 800,
    height: 1000,
    credit: {
      author: 'Toby Hudson',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Xylocarpus_granatum.jpg',
    },
  },
  lumnitzera_racemosa: {
    src: '/img/species/lumnitzera_racemosa.jpg',
    alt: 'Semak teruntum dengan daun kecil berdaging yang bergerombol',
    width: 1000,
    height: 750,
    credit: {
      author: 'Sean.hoyland',
      license: 'Public domain',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Lumnitzera_racemosa_(flowering)_-_Kung_Krabaen,_Chantaburi_province,_Thailand.JPG',
    },
  },
  aegiceras_corniculatum: {
    src: '/img/species/aegiceras_corniculatum.jpg',
    alt: 'Ranting gedangan dengan daun bulat telur terbalik dan bunga putih',
    width: 960,
    height: 720,
    credit: {
      author: 'John Robert McPherson',
      license: 'CC BY-SA 4.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Aegiceras_corniculatum_inflorescence_and_buds_Oxley_Creek_Graceville_P1410884.jpg',
    },
  },
  excoecaria_agallocha: {
    src: '/img/species/excoecaria_agallocha.jpg',
    alt: 'Daun buta-buta yang menguning di ujung ranting',
    width: 519,
    height: 600,
    credit: {
      author: 'J.M.Garg',
      license: 'CC BY-SA 4.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Excoecaria_agallocha_(Blind_Your_Eye)_W_IMG_6929.jpg',
    },
  },
  nypa_fruticans: {
    src: '/img/species/nypa_fruticans.jpg',
    alt: 'Rumpun nipah dengan daun menyirip panjang di tepi sungai',
    width: 960,
    height: 720,
    credit: {
      author: 'Qaalvin',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nipa_palms.jpg',
    },
  },
}
