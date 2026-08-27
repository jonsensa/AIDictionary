const TRIGGER_BUTTON_ID = 'context-explainer-trigger'
const EXPLANATION_BOX_ID = 'context-explainer-box'
const FOLLOW_UP_CLASS = 'context-explainer-follow-up'
const LIQUID_GLASS_TAG = 'context-explainer-liquid-glass'
const API_URL = 'http://localhost:3000/api/explain'
const MAX_INPUT_HEIGHT = 112
const UI_THEMES = {
  ui1: 'soft-glass',
  ui2: 'dark-utility',
  ui3: 'classic-glass',
}
const UI_ORDER = ['ui1', 'ui2', 'ui3']
let activeUi = 'ui2'

function applyActiveTheme(element) {
  element.dataset.contextTheme = UI_THEMES[activeUi]

  if (element.localName === LIQUID_GLASS_TAG) {
    configureLiquidGlass(element)
  }
}

function configureLiquidGlass(element) {
  const usesLibraryGlass = activeUi === 'ui1'
  const attributes = usesLibraryGlass
    ? {
        radius: '22',
        frost: '0.22',
        blur: '24',
        saturation: '125',
        displace: '2',
        scale: '42',
        lightness: '48',
        alpha: '0.5',
        lens: 'rim',
        'lens-strength': '0.5',
        'border-color': 'rgba(255, 255, 255, 0.28)',
      }
    : {
      radius: '22',
      frost: '0',
      blur: '0',
      saturation: '100',
      displace: '0',
      scale: '0',
      lightness: '50',
      alpha: '0',
      lens: 'rim',
      'lens-strength': '0',
      'border-color': 'rgba(255, 255, 255, 0)',
    }

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value)
  }
}

function positionNearSelection(element, selectionRectangle, gap = 12) {
  const viewportPadding = 12
  const elementRectangle = element.getBoundingClientRect()
  const centeredLeft =
    selectionRectangle.left +
    selectionRectangle.width / 2 -
    elementRectangle.width / 2

  const maximumLeft =
    window.innerWidth - elementRectangle.width - viewportPadding
  const left = Math.min(
    Math.max(centeredLeft, viewportPadding),
    Math.max(maximumLeft, viewportPadding),
  )

  const fitsAbove =
    selectionRectangle.top - elementRectangle.height - gap >= viewportPadding
  const fitsBelow =
    selectionRectangle.bottom + elementRectangle.height + gap <=
    window.innerHeight - viewportPadding

  let top

  if (fitsAbove) {
    top = selectionRectangle.top - elementRectangle.height - gap
  } else if (fitsBelow) {
    top = selectionRectangle.bottom + gap
  } else {
    top = Math.min(
      Math.max(selectionRectangle.bottom + gap, viewportPadding),
      Math.max(
        window.innerHeight - elementRectangle.height - viewportPadding,
        viewportPadding,
      ),
    )
  }

  element.style.left = `${left}px`
  element.style.top = `${top}px`
}

function positionFollowUp(surface, parentBox, surfaceIndex) {
  const viewportPadding = 8
  const gap = 12
  const offset = 20 * ((surfaceIndex - 1) % 5)
  const parentRectangle = parentBox.getBoundingClientRect()
  const surfaceRectangle = surface.getBoundingClientRect()
  const preferredLeft = parentRectangle.right + gap + offset
  const fallbackLeft = parentRectangle.left + offset
  const left =
    preferredLeft + surfaceRectangle.width <= window.innerWidth - viewportPadding
      ? preferredLeft
      : Math.min(
        Math.max(fallbackLeft, viewportPadding),
        Math.max(
          window.innerWidth - surfaceRectangle.width - viewportPadding,
          viewportPadding,
        ),
      )
  const top = Math.min(
    Math.max(parentRectangle.top + 32 + offset, viewportPadding),
    Math.max(
      window.innerHeight - surfaceRectangle.height - viewportPadding,
      viewportPadding,
    ),
  )

  surface.style.left = `${left}px`
  surface.style.top = `${top}px`
}

function makeDraggable(element, handle) {
  let dragOffsetX = 0
  let dragOffsetY = 0

  handle.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Element && event.target.closest('button')) {
      return
    }

    event.preventDefault()

    const elementRectangle = element.getBoundingClientRect()
    dragOffsetX = event.clientX - elementRectangle.left
    dragOffsetY = event.clientY - elementRectangle.top

    element.style.animation = 'none'
    handle.classList.add('context-explainer-dragging')
    handle.setPointerCapture(event.pointerId)
  })

  handle.addEventListener('pointermove', (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) {
      return
    }

    const viewportPadding = 8
    const maximumLeft = window.innerWidth - element.offsetWidth - viewportPadding
    const maximumTop = window.innerHeight - element.offsetHeight - viewportPadding
    const left = Math.min(
      Math.max(event.clientX - dragOffsetX, viewportPadding),
      Math.max(maximumLeft, viewportPadding),
    )
    const top = Math.min(
      Math.max(event.clientY - dragOffsetY, viewportPadding),
      Math.max(maximumTop, viewportPadding),
    )

    element.style.left = `${left}px`
    element.style.top = `${top}px`
  })

  function finishDragging(event) {
    if (!handle.hasPointerCapture(event.pointerId)) {
      return
    }

    handle.releasePointerCapture(event.pointerId)
    handle.classList.remove('context-explainer-dragging')
  }

  handle.addEventListener('pointerup', finishDragging)
  handle.addEventListener('pointercancel', finishDragging)
}

function createComposer(placeholder, onSubmit) {
  const form = document.createElement('form')
  form.className = 'context-explainer-composer'

  const input = document.createElement('textarea')
  input.rows = 1
  input.placeholder = placeholder
  input.setAttribute('aria-label', placeholder)

  const sendButton = document.createElement('button')
  sendButton.type = 'submit'
  sendButton.className = 'context-explainer-send'
  sendButton.setAttribute('aria-label', 'Send')
  sendButton.textContent = '↑'

  let locked = false

  function resizeInput() {
    input.style.height = '0px'
    const nextHeight = Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)
    input.style.height = `${Math.max(nextHeight, 22)}px`
    input.style.overflowY =
      input.scrollHeight > MAX_INPUT_HEIGHT ? 'auto' : 'hidden'
  }

  function syncSendButton() {
    const hasText = input.value.trim() !== ''
    sendButton.disabled = locked || !hasText
    sendButton.classList.toggle('context-explainer-send-ready', hasText && !locked)
  }

  function submitMessage() {
    const question = input.value.trim()

    if (question === '' || locked) {
      return
    }

    onSubmit(question)
    input.value = ''
    resizeInput()
    syncSendButton()
  }

  input.addEventListener('input', () => {
    resizeInput()
    syncSendButton()
  })

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      form.requestSubmit()
    }
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submitMessage()
  })

  form.append(input, sendButton)
  resizeInput()
  syncSendButton()

  return {
    element: form,
    input,
    setLocked(isLocked) {
      locked = isLocked
      syncSendButton()
    },
  }
}

async function requestExplanation(action, selectedText, question = '', history = []) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      selectedText,
      question,
      history,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'The backend request failed.')
  }

  return data.answer
}

function removeTriggerButton() {
  document.getElementById(TRIGGER_BUTTON_ID)?.remove()
}

function removeExplanationBox() {
  document.getElementById(EXPLANATION_BOX_ID)?.remove()
  document.querySelectorAll(`.${FOLLOW_UP_CLASS}`).forEach((surface) => {
    surface.remove()
  })
}

function isExtensionElement(target) {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(
    target.closest(
      `#${TRIGGER_BUTTON_ID}, #${EXPLANATION_BOX_ID}, .${FOLLOW_UP_CLASS}`,
    ),
  )
}

function createFollowUpSurface(selectedText, parentBox) {
  const surfaceIndex = document.querySelectorAll(`.${FOLLOW_UP_CLASS}`).length + 1
  const surface = document.createElement('section')
  surface.className = FOLLOW_UP_CLASS
  applyActiveTheme(surface)
  surface.setAttribute('aria-label', `Follow-up question ${surfaceIndex}`)

  const header = document.createElement('header')

  const heading = document.createElement('strong')
  heading.textContent = `Follow-up ${surfaceIndex}`

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.className = 'context-explainer-close'
  closeButton.setAttribute('aria-label', 'Close follow-up')
  closeButton.textContent = '×'
  closeButton.addEventListener('click', () => surface.remove())

  header.append(heading, closeButton)

  const answer = document.createElement('div')
  answer.className = 'context-explainer-follow-up-answer'
  answer.setAttribute('aria-live', 'polite')

  let composer
  composer = createComposer('Ask a follow-up…', async (question) => {
    composer.setLocked(true)
    answer.textContent = 'Thinking…'

    try {
      answer.textContent = await requestExplanation(
        'question',
        selectedText,
        question,
      )
    } catch (error) {
      answer.textContent = `Error: ${error.message}`
    } finally {
      composer.setLocked(false)
    }
  })

  surface.append(header, answer, composer.element)
  document.body.appendChild(surface)
  positionFollowUp(surface, parentBox, surfaceIndex)
  makeDraggable(surface, header)
  composer.input.focus()
}

function createExplanationBox(selectedText, selectionRectangle) {
  removeExplanationBox()

  const conversationHistory = []

  const box = document.createElement(LIQUID_GLASS_TAG)
  box.id = EXPLANATION_BOX_ID
  applyActiveTheme(box)
  box.setAttribute('role', 'dialog')
  box.setAttribute('aria-label', 'Context explorer')

  const header = document.createElement('header')

  const titleGroup = document.createElement('div')
  titleGroup.className = 'context-explainer-title-group'

  const materialIcon = document.createElement('span')
  materialIcon.className = 'context-explainer-material-icon'
  materialIcon.setAttribute('aria-hidden', 'true')

  const heading = document.createElement('strong')
  heading.textContent = 'Explore'

  titleGroup.append(materialIcon, heading)

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.className = 'context-explainer-close'
  closeButton.setAttribute('aria-label', 'Close')
  closeButton.textContent = '×'
  closeButton.addEventListener('click', removeExplanationBox)

  const headerActions = document.createElement('div')
  headerActions.className = 'context-explainer-header-actions'

  const themeButton = document.createElement('button')
  themeButton.type = 'button'
  themeButton.className = 'context-explainer-theme-switch'
  themeButton.textContent = activeUi.toUpperCase()
  themeButton.setAttribute('aria-label', 'Switch interface style')
  themeButton.addEventListener('click', () => {
    const activeIndex = UI_ORDER.indexOf(activeUi)
    const nextIndex = (activeIndex + 1) % UI_ORDER.length
    activeUi = UI_ORDER[nextIndex]
    applyActiveTheme(box)
    document.querySelectorAll(`.${FOLLOW_UP_CLASS}`).forEach(applyActiveTheme)
    themeButton.textContent = activeUi.toUpperCase()
  })

  headerActions.append(themeButton, closeButton)
  header.append(titleGroup, headerActions)

  const selectionDetails = document.createElement('details')
  selectionDetails.className = 'context-explainer-selection'

  const selectionSummary = document.createElement('summary')
  selectionSummary.textContent = 'Selected text'

  const selectionCount = document.createElement('span')
  selectionCount.textContent = '1'
  selectionSummary.appendChild(selectionCount)

  const preview = document.createElement('p')
  preview.className = 'context-explainer-preview'
  preview.textContent = selectedText
  selectionDetails.append(selectionSummary, preview)

  const actionBar = document.createElement('div')
  actionBar.className = 'context-explainer-action-bar'

  const summarizeButton = document.createElement('button')
  summarizeButton.type = 'button'
  summarizeButton.className = 'context-explainer-icon-control'
  summarizeButton.setAttribute('aria-label', 'Summarize')
  summarizeButton.dataset.tooltip = 'Summarize'
  summarizeButton.textContent = '✦'

  const followUpButton = document.createElement('button')
  followUpButton.type = 'button'
  followUpButton.className = 'context-explainer-icon-control'
  followUpButton.setAttribute('aria-label', 'Add follow-up')
  followUpButton.dataset.tooltip = 'Add follow-up'
  followUpButton.textContent = '+'

  actionBar.append(summarizeButton, followUpButton)

  const conversation = document.createElement('div')
  conversation.className = 'context-explainer-conversation'
  conversation.setAttribute('aria-live', 'polite')

  const emptyConversation = document.createElement('p')
  emptyConversation.className = 'context-explainer-empty-state'
  emptyConversation.textContent = 'Summarize the selection or ask a question.'
  conversation.appendChild(emptyConversation)

  function appendMessage(role, text) {
    emptyConversation.remove()

    const message = document.createElement('article')
    message.className = `context-explainer-message context-explainer-${role}`

    const messageLabel = document.createElement('span')
    messageLabel.textContent = role === 'user' ? 'You' : 'Lookup'

    const messageText = document.createElement('p')
    messageText.textContent = text

    message.append(messageLabel, messageText)
    conversation.appendChild(message)
    conversation.scrollTop = conversation.scrollHeight

    return messageText
  }

  let composer

  async function showAnswer(action, question = '') {
    summarizeButton.disabled = true
    composer.setLocked(true)

    const userMessage =
      action === 'summarize' ? 'Summarize this selection.' : question
    appendMessage('user', userMessage)
    const answerMessage = appendMessage('assistant', 'Thinking…')

    try {
      const answer = await requestExplanation(
        action,
        selectedText,
        question,
        conversationHistory,
      )
      answerMessage.textContent = answer
      conversationHistory.push(
        { role: 'user', text: userMessage },
        { role: 'model', text: answer },
      )
    } catch (error) {
      answerMessage.textContent = `Error: ${error.message}`
    } finally {
      summarizeButton.disabled = false
      composer.setLocked(false)
    }
  }

  summarizeButton.addEventListener('click', () => {
    showAnswer('summarize')
  })

  followUpButton.addEventListener('click', () => {
    createFollowUpSurface(selectedText, box)
  })

  composer = createComposer('Ask about this text…', (question) => {
    showAnswer('question', question)
  })

  box.append(
    header,
    selectionDetails,
    actionBar,
    conversation,
    composer.element,
  )
  document.body.appendChild(box)
  positionNearSelection(box, selectionRectangle)
  makeDraggable(box, header)
}

function createTriggerButton(selectedText, selectionRectangle) {
  const button = document.createElement('button')
  button.id = TRIGGER_BUTTON_ID
  applyActiveTheme(button)
  button.type = 'button'
  button.textContent = 'Explore'

  button.addEventListener('mousedown', (event) => {
    event.preventDefault()
  })

  button.addEventListener('click', () => {
    removeTriggerButton()
    createExplanationBox(selectedText, selectionRectangle)
  })

  document.body.appendChild(button)
  positionNearSelection(button, selectionRectangle, 8)
}

document.addEventListener('mouseup', (event) => {
  if (isExtensionElement(event.target)) {
    return
  }

  removeTriggerButton()

  const selection = window.getSelection()
  const selectedText = selection?.toString().trim() ?? ''

  if (selectedText === '' || !selection || selection.rangeCount === 0) {
    return
  }

  const selectionRectangle = selection.getRangeAt(0).getBoundingClientRect()
  createTriggerButton(selectedText, selectionRectangle)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    removeTriggerButton()
    removeExplanationBox()
  }
})
