const CLASSIC_V1_POSTER_BASE = 'https://cdn.jsdelivr.net/gh/UnluckyNinja/SBTI-test@main/image'

const CLASSIC_V1_POSTER_FILES = {
  'Dior-s': 'Dior-s.jpg',
  'JOKE-R': 'JOKE-R.jpg',
  'WOC!': 'WOC.png'
}

export function getClassicV1PosterUrl(typeCode) {
  if (!typeCode) {
    return ''
  }

  const fileName = CLASSIC_V1_POSTER_FILES[typeCode] || `${typeCode}.png`
  return `${CLASSIC_V1_POSTER_BASE}/${fileName}`
}
