const box = document.querySelector('#context-explainer-box')
const themeSwitch = box.querySelector('.context-explainer-theme-switch')
const themes = ['soft-glass', 'dark-utility', 'classic-glass']
const themeLabels = ['UI1', 'UI2', 'UI3']

function setTheme(theme) {
  const index = themes.indexOf(theme)
  box.dataset.contextTheme = theme
  themeSwitch.textContent = themeLabels[index]
  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.theme === theme))
  })
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
    box.style.background = `rgb(8 8 9 / ${input.value})`
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

connectSurfaceOpacity()
connectRange('frost', 'frost', '%')
connectRange('scale', 'scale')
setTheme('soft-glass')

const reloadEvents = new EventSource('/events')
reloadEvents.onmessage = (event) => {
  if (event.data === 'reload') window.location.reload()
}
