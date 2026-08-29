const box = document.querySelector('#context-explainer-box')
const themeSwitch = box.querySelector('.context-explainer-theme-switch')
const themes = ['soft-glass', 'dark-utility', 'transparent-utility']
const themeLabels = ['UI1', 'UI2', 'UI3']

function applyPreviewSurface() {
  const opacity = document.querySelector('#opacity').value
  box.style.background = box.dataset.contextTheme === 'soft-glass'
    ? `rgb(8 8 9 / ${opacity})`
    : ''
}

function setTheme(theme) {
  const index = themes.indexOf(theme)
  box.dataset.contextTheme = theme
  themeSwitch.textContent = themeLabels[index]
  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.theme === theme))
  })
  applyPreviewSurface()
}

function connectRange(id, attribute, suffix = '') {
  const input = document.querySelector(`#${id}`)
  const output = document.querySelector(`#${id}-output`)
  input.addEventListener('input', () => {
    box.setAttribute(attribute, input.value)
    output.value = suffix === '%' ? `${Math.round(input.value * 100)}%` : `${input.value}${suffix}`
  })
}

function connectSurfaceOpacity() {
  const input = document.querySelector('#opacity')
  const output = document.querySelector('#opacity-output')

  function updateSurface() {
    applyPreviewSurface()
    output.value = `${Math.round(input.value * 100)}%`
  }

  input.addEventListener('input', updateSurface)
  updateSurface()
}

document.querySelectorAll('[data-theme]').forEach((button) => {
  button.addEventListener('click', () => setTheme(button.dataset.theme))
})

themeSwitch.addEventListener('click', () => {
  const nextIndex = (themes.indexOf(box.dataset.contextTheme) + 1) % themes.length
  setTheme(themes[nextIndex])
})

const previewSaveButton = box.querySelector('.context-explainer-save-answer')
const previewShelfButton = box.querySelector('.context-explainer-shelf-button')

previewSaveButton.addEventListener('click', () => {
  previewSaveButton.classList.toggle('context-explainer-saved')

  if (!previewSaveButton.classList.contains('context-explainer-saved')) return

  const origin = previewSaveButton.getBoundingClientRect()
  const destination = previewShelfButton.getBoundingClientRect()
  const flyingBookmark = document.createElement('span')
  flyingBookmark.className = 'context-explainer-save-flight'
  flyingBookmark.style.left = `${origin.left + origin.width / 2 - 8}px`
  flyingBookmark.style.top = `${origin.top + origin.height / 2 - 10}px`
  document.body.appendChild(flyingBookmark)

  flyingBookmark.animate([
    { transform: 'translate(0, 0) scale(0.9)', opacity: 0.9 },
    {
      transform: `translate(${destination.left + destination.width / 2 - origin.left - origin.width / 2}px, ${destination.top + destination.height / 2 - origin.top - origin.height / 2}px) scale(0.45)`,
      opacity: 0.15,
    },
  ], {
    duration: 280,
    easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)',
    fill: 'forwards',
  }).finished.finally(() => {
    flyingBookmark.remove()
    previewShelfButton.classList.add('context-explainer-shelf-received')
    window.setTimeout(() => previewShelfButton.classList.remove('context-explainer-shelf-received'), 420)
  })
})

connectSurfaceOpacity()
connectRange('frost', 'frost', '%')
connectRange('scale', 'scale')
setTheme('soft-glass')

if (
  ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
  window.location.port === '4173'
) {
  const reloadEvents = new EventSource('/events')
  reloadEvents.onmessage = (event) => {
    if (event.data === 'reload') window.location.reload()
  }
}
