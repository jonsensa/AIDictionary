const path = require('path')
const { buildSync } = require('esbuild')

const projectRoot = path.resolve(__dirname, '..')

buildSync({
  bundle: true,
  entryPoints: [path.join(projectRoot, 'src', 'liquid-glass-entry.js')],
  format: 'iife',
  outfile: path.join(projectRoot, 'vendor', 'liquid-glass.js'),
  target: 'chrome120',
})
