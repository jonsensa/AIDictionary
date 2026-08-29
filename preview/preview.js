const box = document.querySelector('#context-explainer-box')
const themeSwitch = box.querySelector('.context-explainer-theme-switch')
const closeButton = box.querySelector('.context-explainer-close')
const shelfButton = box.querySelector('.context-explainer-shelf-button')
const summarizeButton = box.querySelector('[aria-label="Summarize"]')
const followUpButton = box.querySelector('[aria-label="Add follow-up"]')
const selectionPreview = box.querySelector('.context-explainer-preview')
const selectionCount = box.querySelector('.context-explainer-selection summary span')
const conversation = box.querySelector('.context-explainer-conversation')
const composer = box.querySelector('.context-explainer-composer')
const composerInput = composer.querySelector('textarea')
const themes = ['soft-glass', 'dark-utility', 'transparent-utility']
const themeLabels = ['UI1', 'UI2', 'UI3']
const opacityByTheme = {
  'soft-glass': 0.38,
  'dark-utility': 0.32,
  'transparent-utility': 0,
}
const savedDemoInsights = []
let selectedDemoText = selectionPreview.textContent.trim()

function configurePreviewGlass(theme) {
  const ui1 = theme === 'soft-glass'
  const attributes = ui1
    ? { frost: '0.22', blur: '24', scale: '42', alpha: '0.5', 'lens-strength': '0.5' }
    : { frost: '0', blur: '0', scale: '0', alpha: '0', 'lens-strength': '0' }

  Object.entries(attributes).forEach(([name, value]) => box.setAttribute(name, value))
}

function applyPreviewSurface() {
  const opacity = opacityByTheme[box.dataset.contextTheme]
  box.style.background = `rgb(8 8 9 / ${opacity})`
}

function syncOpacityControl() {
  const input = document.querySelector('#opacity')
  const output = document.querySelector('#opacity-output')
  const opacity = opacityByTheme[box.dataset.contextTheme]
  input.value = String(opacity)
  output.value = `${Math.round(opacity * 100)}%`
}

function applyThemeToDemoSurfaces(theme) {
  document
    .querySelectorAll('.context-explainer-follow-up, #context-explainer-study-shelf')
    .forEach((surface) => {
      surface.dataset.contextTheme = theme
    })
}

function setTheme(theme) {
  const index = themes.indexOf(theme)
  box.dataset.contextTheme = theme
  themeSwitch.textContent = themeLabels[index]
  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.theme === theme))
  })
  configurePreviewGlass(theme)
  syncOpacityControl()
  applyPreviewSurface()
  applyThemeToDemoSurfaces(theme)
}

function connectSurfaceOpacity() {
  const input = document.querySelector('#opacity')
  const output = document.querySelector('#opacity-output')

  input.addEventListener('input', () => {
    opacityByTheme[box.dataset.contextTheme] = Number(input.value)
    output.value = `${Math.round(Number(input.value) * 100)}%`
    applyPreviewSurface()
  })
}

function makeDraggable(element, handle) {
  let dragOffsetX = 0
  let dragOffsetY = 0
  let draggedPointerId = null

  handle.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Element && event.target.closest('button')) return

    event.preventDefault()
    const rectangle = element.getBoundingClientRect()
    dragOffsetX = event.clientX - rectangle.left
    dragOffsetY = event.clientY - rectangle.top
    element.style.animation = 'none'
    handle.classList.add('context-explainer-dragging')
    draggedPointerId = event.pointerId
  })

  document.addEventListener('pointermove', (event) => {
    if (event.pointerId !== draggedPointerId) return

    const viewportPadding = 8
    const maximumLeft = window.innerWidth - element.offsetWidth - viewportPadding
    const maximumTop = window.innerHeight - element.offsetHeight - viewportPadding
    element.style.left = `${Math.min(Math.max(event.clientX - dragOffsetX, viewportPadding), Math.max(maximumLeft, viewportPadding))}px`
    element.style.right = 'auto'
    element.style.top = `${Math.min(Math.max(event.clientY - dragOffsetY, viewportPadding), Math.max(maximumTop, viewportPadding))}px`
  })

  function stopDragging(event) {
    if (event.pointerId !== draggedPointerId) return
    draggedPointerId = null
    handle.classList.remove('context-explainer-dragging')
  }

  document.addEventListener('pointerup', stopDragging)
  document.addEventListener('pointercancel', stopDragging)
}

function positionNear(element, rectangle, gap = 10) {
  const padding = 10
  const elementRectangle = element.getBoundingClientRect()
  const maximumLeft = window.innerWidth - elementRectangle.width - padding
  const left = Math.min(
    Math.max(rectangle.left + rectangle.width / 2 - elementRectangle.width / 2, padding),
    Math.max(maximumLeft, padding),
  )
  const above = rectangle.top - elementRectangle.height - gap
  const top = above >= padding ? above : rectangle.bottom + gap
  element.style.left = `${left}px`
  element.style.right = 'auto'
  element.style.top = `${Math.min(top, window.innerHeight - elementRectangle.height - padding)}px`
}

function showSelectionTrigger(rectangle) {
  document.querySelector('#context-explainer-trigger')?.remove()
  const trigger = document.createElement('button')
  trigger.id = 'context-explainer-trigger'
  trigger.type = 'button'
  trigger.textContent = 'Explore'
  trigger.dataset.contextTheme = box.dataset.contextTheme
  trigger.addEventListener('mousedown', (event) => event.preventDefault())
  trigger.addEventListener('click', () => {
    trigger.remove()
    selectionPreview.textContent = selectedDemoText
    selectionCount.textContent = '1'
    resetConversation()
    box.style.display = ''
    positionNear(box, rectangle, 14)
  })
  document.body.appendChild(trigger)
  positionNear(trigger, rectangle, 8)
}

function resetConversation() {
  conversation.replaceChildren()
  const emptyState = document.createElement('p')
  emptyState.className = 'context-explainer-empty-state'
  emptyState.textContent = 'Summarize the selection or ask a question.'
  conversation.appendChild(emptyState)
}

function appendMessage(role, text) {
  conversation.querySelector('.context-explainer-empty-state')?.remove()
  const message = document.createElement('article')
  message.className = `context-explainer-message context-explainer-${role}`
  const label = document.createElement('span')
  label.textContent = role === 'user' ? 'You' : 'Explore'
  const messageText = document.createElement('p')
  messageText.textContent = text
  message.append(label, messageText)
  conversation.appendChild(message)
  conversation.scrollTop = conversation.scrollHeight
  return { message, messageText }
}

function showThinking(messageText, response, message) {
  messageText.textContent = ''
  messageText.classList.add('context-explainer-thinking')
  messageText.setAttribute('aria-label', 'Thinking')
  messageText.append(document.createElement('span'), document.createElement('span'), document.createElement('span'))

  window.setTimeout(() => {
    messageText.classList.remove('context-explainer-thinking')
    messageText.removeAttribute('aria-label')
    messageText.textContent = response
    attachSaveButton(message, response)
    conversation.scrollTop = conversation.scrollHeight
  }, 650)
}

function mockAnswer(question) {
  const normalizedQuestion = question.toLowerCase()
  if (normalizedQuestion.includes('example')) {
    return 'For example, connect a new idea to a project, memory, or problem you already understand.'
  }
  return 'This is a simulated study response. The installed extension sends your selected text and question to the local AI backend.'
}

function animateBookmark(originElement) {
  const destination = shelfButton.getBoundingClientRect()
  const origin = originElement.getBoundingClientRect()
  const flyingBookmark = document.createElement('span')
  flyingBookmark.className = 'context-explainer-save-flight'
  flyingBookmark.style.left = `${origin.left + origin.width / 2 - 8}px`
  flyingBookmark.style.top = `${origin.top + origin.height / 2 - 10}px`
  document.body.appendChild(flyingBookmark)
  flyingBookmark
    .animate(
      [
        { transform: 'translate(0, 0) scale(0.9)', opacity: 0.9 },
        {
          transform: `translate(${destination.left + destination.width / 2 - origin.left - origin.width / 2}px, ${destination.top + destination.height / 2 - origin.top - origin.height / 2}px) scale(0.45)`,
          opacity: 0.15,
        },
      ],
      { duration: 280, easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)', fill: 'forwards' },
    )
    .finished.finally(() => {
      flyingBookmark.remove()
      shelfButton.classList.add('context-explainer-shelf-received')
      window.setTimeout(() => shelfButton.classList.remove('context-explainer-shelf-received'), 420)
    })
}

function attachSaveButton(message, answer) {
  if (message.querySelector('.context-explainer-answer-actions')) return
  const actions = document.createElement('div')
  actions.className = 'context-explainer-answer-actions'
  const saveButton = document.createElement('button')
  saveButton.type = 'button'
  saveButton.className = 'context-explainer-save-answer'
  saveButton.setAttribute('aria-label', 'Save answer')
  saveButton.addEventListener('click', () => {
    const saved = saveButton.classList.toggle('context-explainer-saved')
    if (saved) {
      savedDemoInsights.unshift(answer)
      animateBookmark(saveButton)
    } else {
      const index = savedDemoInsights.indexOf(answer)
      if (index >= 0) savedDemoInsights.splice(index, 1)
    }
    renderShelfContents()
  })
  actions.appendChild(saveButton)
  message.appendChild(actions)
}

function renderShelfContents() {
  const shelf = document.querySelector('#context-explainer-study-shelf')
  if (!shelf) return
  const list = shelf.querySelector('.context-explainer-shelf-list')
  const count = shelf.querySelector('.context-explainer-shelf-title span')
  count.textContent = String(savedDemoInsights.length)
  list.replaceChildren()

  if (savedDemoInsights.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'context-explainer-shelf-empty'
    empty.textContent = 'Save a demo answer and it will appear here.'
    list.appendChild(empty)
    return
  }

  savedDemoInsights.forEach((text) => {
    const card = document.createElement('article')
    card.className = 'context-explainer-shelf-card'
    const cardHeader = document.createElement('div')
    cardHeader.className = 'context-explainer-shelf-card-header'
    cardHeader.innerHTML = '<span>Answer</span><time>Demo</time>'
    const paragraph = document.createElement('p')
    paragraph.className = 'context-explainer-shelf-text'
    paragraph.textContent = text
    card.append(cardHeader, paragraph)
    list.appendChild(card)
  })
}

function toggleShelf() {
  const existing = document.querySelector('#context-explainer-study-shelf')
  if (existing) {
    existing.remove()
    return
  }

  const shelf = document.createElement('section')
  shelf.id = 'context-explainer-study-shelf'
  shelf.dataset.contextTheme = box.dataset.contextTheme
  const header = document.createElement('header')
  const title = document.createElement('div')
  title.className = 'context-explainer-shelf-title'
  title.innerHTML = '<strong>Study Shelf</strong><span>0</span>'
  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'context-explainer-close'
  close.textContent = '×'
  close.setAttribute('aria-label', 'Close Study Shelf')
  close.addEventListener('click', () => shelf.remove())
  const list = document.createElement('div')
  list.className = 'context-explainer-shelf-list'
  header.append(title, close)
  shelf.append(header, list)
  document.body.appendChild(shelf)
  const boxRectangle = box.getBoundingClientRect()
  shelf.style.left = `${Math.max(8, boxRectangle.left - 345)}px`
  shelf.style.top = `${Math.min(boxRectangle.top + 26, window.innerHeight - shelf.offsetHeight - 8)}px`
  makeDraggable(shelf, header)
  renderShelfContents()
}

function openFollowUp() {
  const surface = document.createElement('section')
  surface.className = 'context-explainer-follow-up'
  surface.dataset.contextTheme = box.dataset.contextTheme
  const header = document.createElement('header')
  const title = document.createElement('strong')
  title.textContent = 'Another thought'
  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'context-explainer-close'
  close.textContent = '×'
  close.setAttribute('aria-label', 'Close follow-up')
  close.addEventListener('click', () => surface.remove())
  const form = document.createElement('form')
  form.className = 'context-explainer-composer'
  const input = document.createElement('textarea')
  input.rows = 1
  input.placeholder = 'Ask a follow-up…'
  const send = document.createElement('button')
  send.type = 'submit'
  send.className = 'context-explainer-send'
  send.textContent = '↑'
  const answer = document.createElement('p')
  answer.className = 'context-explainer-follow-up-answer'
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!input.value.trim()) return
    answer.textContent = mockAnswer(input.value.trim())
    input.value = ''
  })
  header.append(title, close)
  form.append(input, send)
  surface.append(header, answer, form)
  document.body.appendChild(surface)
  const rectangle = box.getBoundingClientRect()
  surface.style.left = `${Math.min(rectangle.right + 12, window.innerWidth - 308)}px`
  surface.style.top = `${Math.min(rectangle.top + 42, window.innerHeight - surface.offsetHeight - 8)}px`
  makeDraggable(surface, header)
  input.focus()
}

document.querySelectorAll('[data-theme]').forEach((button) => {
  button.addEventListener('click', () => setTheme(button.dataset.theme))
})

themeSwitch.addEventListener('click', () => {
  const nextIndex = (themes.indexOf(box.dataset.contextTheme) + 1) % themes.length
  setTheme(themes[nextIndex])
})

closeButton.addEventListener('click', () => {
  box.style.display = 'none'
  document.querySelectorAll('.context-explainer-follow-up, #context-explainer-study-shelf').forEach((surface) => surface.remove())
})

shelfButton.addEventListener('click', toggleShelf)
summarizeButton.addEventListener('click', () => {
  appendMessage('user', 'Summarize this selection.')
  const { message, messageText } = appendMessage('assistant', '')
  showThinking(messageText, 'The passage explains that AIDictionary lets you study selected text without leaving its original webpage.', message)
})
followUpButton.addEventListener('click', openFollowUp)

composer.addEventListener('submit', (event) => {
  event.preventDefault()
  const question = composerInput.value.trim()
  if (!question) return
  composerInput.value = ''
  appendMessage('user', question)
  const { message, messageText } = appendMessage('assistant', '')
  showThinking(messageText, mockAnswer(question), message)
})

composerInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    composer.requestSubmit()
  }
})

document.addEventListener('mouseup', (event) => {
  if (!(event.target instanceof Element) || !event.target.closest('.preview-page')) return
  const selection = window.getSelection()
  const text = selection?.toString().trim() || ''
  if (!selection || !selection.rangeCount || !text) return
  selectedDemoText = text
  showSelectionTrigger(selection.getRangeAt(0).getBoundingClientRect())
})

connectSurfaceOpacity()
makeDraggable(box, box.querySelector('header'))
attachSaveButton(box.querySelector('.context-explainer-assistant'), box.querySelector('.context-explainer-assistant p').textContent)
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
