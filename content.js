const TRIGGER_BUTTON_ID = 'context-explainer-trigger'
const EXPLANATION_BOX_ID = 'context-explainer-box'
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

function createExplanationBox(selectedText) {
  removeExplanationBox()

  const box = document.createElement('section')
  box.id = EXPLANATION_BOX_ID

  const header = document.createElement('header')

  const heading = document.createElement('strong')
  heading.textContent = 'Context Explainer'

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.className = 'context-explainer-close'
  closeButton.textContent = 'Close'
  closeButton.addEventListener('click', removeExplanationBox)

  header.append(heading, closeButton)

  const previewLabel = document.createElement('span')
  previewLabel.className = 'context-explainer-label'
  previewLabel.textContent = 'Selected text'

  const preview = document.createElement('p')
  preview.className = 'context-explainer-preview'
  preview.textContent = selectedText

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

  const response = document.createElement('div')
  response.className = 'context-explainer-response'
  response.setAttribute('aria-live', 'polite')
  response.textContent = 'Choose Summarize or ask a question.'

  summarizeButton.addEventListener('click', () => {
    response.textContent =
      'Summary request captured. The AI connection is our next backend milestone.'
  })

  questionForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const question = questionInput.value.trim()

    if (question === '') {
      response.textContent = 'Enter a question first.'
      return
    }

    response.textContent = `Question captured: ${question}`
  })

  questionForm.append(questionLabel, questionInput, askButton)
  box.append(
    header,
    previewLabel,
    preview,
    summarizeButton,
    questionForm,
    response,
  )
  document.body.appendChild(box)
}

function createTriggerButton(selectedText, selectionRectangle) {
  const button = document.createElement('button')
  button.id = TRIGGER_BUTTON_ID
  button.type = 'button'
  button.textContent = 'Ask AI'
  button.style.left = `${selectionRectangle.left}px`
  button.style.top = `${selectionRectangle.bottom + 8}px`

  button.addEventListener('mousedown', (event) => {
    event.preventDefault()
  })

  button.addEventListener('click', () => {
    removeTriggerButton()
    createExplanationBox(selectedText)
  })

  document.body.appendChild(button)
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
