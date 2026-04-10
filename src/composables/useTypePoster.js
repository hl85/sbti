const CLASSIC_V1_POSTER_BASE = 'https://cdn.jsdelivr.net/gh/hl85/sbti@v0.5.0/src/assets'

const CLASSIC_V1_POSTER_FILES = {
  'WOC!': 'WOC.png'
}

export function getClassicV1PosterUrl(typeCode) {
  if (!typeCode) {
    return ''
  }

  const fileName = CLASSIC_V1_POSTER_FILES[typeCode] || `${typeCode}.png`
  return `${CLASSIC_V1_POSTER_BASE}/${fileName}`
}
