import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { TYPE_LIBRARY } from '../src/data/sbtiData.js'
import { TYPE_LIBRARY_EN } from '../src/data/sbtiDataEN.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')

const siteUrl = 'https://sbti.funmbti.com'
const versions = ['cn', 'en']
const localizedRoutes = ['', '/test', '/result', '/gallery']
const staticRoutes = ['/what-is-sbti']

function normalizeUrl(routePath) {
  return new URL(routePath, `${siteUrl}/`).toString()
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function buildSitemapEntries() {
  const zhTypeCodes = Object.keys(TYPE_LIBRARY)
  const enTypeCodes = Object.keys(TYPE_LIBRARY_EN)

  if (zhTypeCodes.length !== enTypeCodes.length) {
    throw new Error(`Type library mismatch: zh=${zhTypeCodes.length}, en=${enTypeCodes.length}`)
  }

  const missingInEn = zhTypeCodes.filter((code) => !TYPE_LIBRARY_EN[code])
  if (missingInEn.length > 0) {
    throw new Error(`Missing EN type definitions for: ${missingInEn.join(', ')}`)
  }

  const urls = new Set()

  urls.add(normalizeUrl('/'))

  for (const routePath of staticRoutes) {
    urls.add(normalizeUrl(routePath))
  }

  for (const version of versions) {
    for (const routePath of localizedRoutes) {
      urls.add(normalizeUrl(`/${version}${routePath}`))
    }

    for (const code of zhTypeCodes) {
      urls.add(normalizeUrl(`/${version}/share/${code}`))
    }
  }

  return Array.from(urls).sort()
}

function buildSitemapXml(urls) {
  const items = urls
    .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`
}

function buildRobotsTxt() {
  return [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${normalizeUrl('/sitemap.xml')}`, ``].join('\n')
}

await mkdir(publicDir, { recursive: true })

const sitemapUrls = buildSitemapEntries()
const sitemapXml = buildSitemapXml(sitemapUrls)
const robotsTxt = buildRobotsTxt()

await Promise.all([
  writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml),
  writeFile(path.join(publicDir, 'robots.txt'), robotsTxt),
])

console.log(`Generated sitemap.xml with ${sitemapUrls.length} URLs and robots.txt in public/.`)
