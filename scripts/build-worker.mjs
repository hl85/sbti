import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const workerPath = path.join(rootDir, 'sbti-app-worker.js')

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.xml',
])

const mimeTypes = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.mjs', 'application/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
])

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath))
      continue
    }
    files.push(fullPath)
  }

  return files.sort()
}

function toAssetKey(filePath) {
  const relativePath = path.relative(distDir, filePath).split(path.sep).join('/')
  return `/${relativePath}`
}

function getMimeType(filePath) {
  return mimeTypes.get(path.extname(filePath).toLowerCase()) ?? 'application/octet-stream'
}

function isTextFile(filePath) {
  return textExtensions.has(path.extname(filePath).toLowerCase())
}

function getCacheControl(assetPath) {
  if (assetPath === '/' || assetPath.endsWith('.html')) {
    return 'no-cache'
  }

  return 'public, max-age=31536000, immutable'
}

async function buildAssetEntries() {
  const files = await collectFiles(distDir)
  const assets = []

  for (const filePath of files) {
    const key = toAssetKey(filePath)
    const buffer = await readFile(filePath)
    const textFile = isTextFile(filePath)
    const content = textFile ? buffer.toString('utf8') : buffer.toString('base64')

    assets.push([
      key,
      {
        content,
        contentType: getMimeType(filePath),
        isBase64: !textFile,
      },
    ])

    if (key === '/index.html') {
      assets.push([
        '/',
        {
          content,
          contentType: getMimeType(filePath),
          isBase64: false,
        },
      ])
    }
  }

  return assets
}

function buildWorkerSource(assetEntries) {
  const serializedAssets = assetEntries
    .map(([assetPath, asset]) => {
      const body = JSON.stringify(asset, null, 2)
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n')

      return `  ${JSON.stringify(assetPath)}: ${body}`
    })
    .join(',\n')

  return `const assets = {\n${serializedAssets}\n};\n\nfunction getCacheControl(pathname) {\n  if (pathname === '/' || pathname.endsWith('.html')) {\n    return 'no-cache';\n  }\n\n  return 'public, max-age=31536000, immutable';\n}\n\nfunction serveAsset(pathname, asset) {\n  const headers = new Headers({\n    'Content-Type': asset.contentType,\n    'Cache-Control': getCacheControl(pathname),\n  });\n\n  if (asset.isBase64) {\n    const binaryString = atob(asset.content);\n    const bytes = Uint8Array.from(binaryString, (character) => character.charCodeAt(0));\n    return new Response(bytes, { headers });\n  }\n\n  return new Response(asset.content, { headers });\n}\n\nexport default {\n  async fetch(request) {\n    const url = new URL(request.url);\n    const pathname = url.pathname || '/';\n    const directAsset = assets[pathname];\n\n    if (directAsset) {\n      return serveAsset(pathname, directAsset);\n    }\n\n    const spaEntry = assets['/index.html'];\n\n    if (spaEntry) {\n      return serveAsset('/index.html', spaEntry);\n    }\n\n    return new Response('Missing /index.html asset', { status: 500 });\n  },\n};\n`
}

const assetEntries = await buildAssetEntries()
const workerSource = buildWorkerSource(assetEntries)

await writeFile(workerPath, workerSource)
console.log(`Generated ${path.relative(rootDir, workerPath)} with ${assetEntries.length} embedded assets.`)
