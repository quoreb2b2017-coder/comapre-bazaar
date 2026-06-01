import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import toIco from 'to-ico'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'components', 'favicon.png')
const pub = path.join(root, 'public')

if (!fs.existsSync(src)) {
  console.error('Missing components/favicon.png')
  process.exit(1)
}

fs.mkdirSync(pub, { recursive: true })

const square = sharp(src).resize(192, 192, { fit: 'cover', position: 'centre' })

await square.clone().png().toFile(path.join(pub, 'favicon.png'))
await square.clone().resize(48, 48).png().toFile(path.join(pub, 'favicon-48.png'))
await square.clone().resize(96, 96).png().toFile(path.join(pub, 'favicon-96.png'))
await square.clone().resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'))

const icoSizes = [16, 32, 48]
const icoBuffers = await Promise.all(
  icoSizes.map((size) => square.clone().resize(size, size).png().toBuffer())
)
fs.writeFileSync(path.join(pub, 'favicon.ico'), await toIco(icoBuffers))

console.log(
  'Wrote public/favicon.png, favicon-48.png, favicon-96.png, apple-touch-icon.png, favicon.ico'
)
