const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const outputDirectory = path.join(projectRoot, 'dist-pages')

fs.rmSync(outputDirectory, { recursive: true, force: true })
fs.mkdirSync(path.join(outputDirectory, 'vendor'), { recursive: true })

const previewHtmlPath = path.join(projectRoot, 'preview', 'index.html')
const previewHtml = fs
  .readFileSync(previewHtmlPath, 'utf8')
  .replace('href="/content.css"', 'href="./content.css"')
  .replace('href="/preview/preview.css"', 'href="./preview.css"')
  .replace(
    'src="/vendor/liquid-glass.js?v=aidick-2"',
    'src="./vendor/liquid-glass.js?v=aidick-2"',
  )
  .replace('src="/preview/preview.js"', 'src="./preview.js"')

fs.writeFileSync(path.join(outputDirectory, 'index.html'), previewHtml)
fs.writeFileSync(path.join(outputDirectory, '.nojekyll'), '')

const publicFiles = [
  ['content.css', 'content.css'],
  ['preview/preview.css', 'preview.css'],
  ['preview/preview.js', 'preview.js'],
  ['vendor/liquid-glass.js', 'vendor/liquid-glass.js'],
]

for (const [source, destination] of publicFiles) {
  fs.copyFileSync(
    path.join(projectRoot, source),
    path.join(outputDirectory, destination),
  )
}

console.log(`GitHub Pages demo built in ${outputDirectory}`)
