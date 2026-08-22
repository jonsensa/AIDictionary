const TRIGGER_BUTTON_ID = 'context-explainer-trigger'
const EXPLANATION_BOX_ID = 'context-explainer-box'
const API_URL = 'http://localhost:3000/api/explain'
const UI_THEMES = {
  ui1: 'soft-glass',
  ui2: 'dark-utility',
}
let activeUi = 'ui2'

function applyActiveTheme(element) {
  element.dataset.contextTheme = UI_THEMES[activeUi]
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

async function requestExplanation(action, selectedText, question = '') {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      selectedText,
      question,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'The backend request failed.')
  }

  return data.answer
}
//Injecting to chorme

function removeTriggerButton() {
  document.getElementById(TRIGGER_BUTTON_ID)?.remove()
}

function removeExplanationBox() {
  document.getElementById(EXPLANATION_BOX_ID)?.remove()
}

function isExtensionElement(target) {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(
    target.closest(`#${TRIGGER_BUTTON_ID}, #${EXPLANATION_BOX_ID}`),
  )
}

function createExplanationBox(selectedText, selectionRectangle) {
  removeExplanationBox()

  const box = document.createElement('section')
  box.id = EXPLANATION_BOX_ID
  applyActiveTheme(box)
  box.setAttribute('role', 'dialog')
  box.setAttribute('aria-label', 'Context lookup')

  const header = document.createElement('header')

  const titleGroup = document.createElement('div')
  titleGroup.className = 'context-explainer-title-group'

  const materialIcon = document.createElement('span')
  materialIcon.className = 'context-explainer-material-icon'
  materialIcon.setAttribute('aria-hidden', 'true')

  const heading = document.createElement('strong')
  heading.textContent = 'Look Up'

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
    activeUi = activeUi === 'ui1' ? 'ui2' : 'ui1'
    applyActiveTheme(box)
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

  const summarizeButton = document.createElement('button')
  summarizeButton.type = 'button'
  summarizeButton.className = 'context-explainer-primary'
  summarizeButton.textContent = 'Summarize'

  const questionForm = document.createElement('form')

  const questionLabel = document.createElement('label')
  questionLabel.className = 'context-explainer-label'
  questionLabel.htmlFor = 'context-explainer-question'
  questionLabel.textContent = 'Ask about this text'

  const questionInput = document.createElement('textarea')
  questionInput.id = 'context-explainer-question'
  questionInput.rows = 3
  questionInput.placeholder = 'What does this mean?'

  const askButton = document.createElement('button')
  askButton.type = 'submit'
  askButton.className = 'context-explainer-primary'
  askButton.textContent = 'Ask'

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

  async function showAnswer(action, question = '') {
    summarizeButton.disabled = true
    askButton.disabled = true

    const userMessage =
      action === 'summarize' ? 'Summarize this selection.' : question
    appendMessage('user', userMessage)
    const answerMessage = appendMessage('assistant', 'Thinking…')

    try {
      const answer = await requestExplanation(action, selectedText, question)
      answerMessage.textContent = answer
    } catch (error) {
      answerMessage.textContent = `Error: ${error.message}`
    } finally {
      summarizeButton.disabled = false
      askButton.disabled = false
    }
  }

  summarizeButton.addEventListener('click', () => {
    showAnswer('summarize')
  })

  questionForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const question = questionInput.value.trim()

    if (question === '') {
      appendMessage('assistant', 'Enter a question first.')
      return
    }

    showAnswer('question', question)
    questionInput.value = ''
  })

  questionForm.append(questionLabel, questionInput, askButton)
  box.append(
    header,
    selectionDetails,
    summarizeButton,
    conversation,
    questionForm,
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
  button.textContent = 'Look Up'

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
