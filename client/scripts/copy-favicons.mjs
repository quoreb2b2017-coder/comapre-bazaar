import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'components', 'favicon.png')
const pub = path.join(root, 'public')

if (!fs.existsSync(src)) {
  console.error('Missing components/favicon.png')
  process.exit(1)
}

fs.mkdirSync(pub, { recursive: true })
fs.copyFileSync(src, path.join(pub, 'favicon.png'))

await sharp(src).resize(48, 48).png().toFile(path.join(pub, 'favicon-48.png'))
await sharp(src).resize(96, 96).png().toFile(path.join(pub, 'favicon-96.png'))

console.log('Copied favicon.png, favicon-48.png, favicon-96.png → public/')
