/**
 * Karibase Enhanced Modal System
 * Advanced modal component with validation, accessibility, and animations
 * @version 2.0.0
 */

class KaribaseModal {
  constructor(options = {}) {
    this.options = {
      id: options.id || 'karibase-modal-' + Date.now(),
      title: options.title || 'Modal',
      content: options.content || '',
      size: options.size || 'medium', // small, medium, large, fullscreen
      backdrop: options.backdrop !== undefined ? options.backdrop : true,
      keyboard: options.keyboard !== undefined ? options.keyboard : true,
      showClose: options.showClose !== undefined ? options.showClose : true,
      centered: options.centered !== undefined ? options.centered : true,
      scrollable: options.scrollable !== undefined ? options.scrollable : false,
      animation: options.animation !== undefined ? options.animation : true,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      showConfirm: options.showConfirm !== undefined ? options.showConfirm : false,
      showCancel: options.showCancel !== undefined ? options.showCancel : true,
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
      onOpen: options.onOpen || null,
      onClose: options.onClose || null,
      validate: options.validate || null,
      ...options
    }

    this.isOpen = false
    this.element = null
    this.backdropElement = null
    this.validators = new Map()
    
    this.init()
  }

  init() {
    this.createModal()
    this.bindEvents()
    this.addValidators()
  }

  createModal() {
    // Create backdrop
    if (this.options.backdrop) {
      this.backdropElement = document.createElement('div')
      this.backdropElement.className = 'kb-modal-backdrop'
      this.backdropElement.setAttribute('data-modal-backdrop', this.options.id)
      this.backdropElement.style.display = 'none'
    }

    // Create modal
    this.element = document.createElement('div')
    this.element.className = `kb-modal kb-modal-${this.options.size}`
    this.element.id = this.options.id
    this.element.setAttribute('role', 'dialog')
    this.element.setAttribute('aria-modal', 'true')
    this.element.setAttribute('aria-labelledby', `${this.options.id}-title`)
    this.element.setAttribute('aria-hidden', 'true')
    this.element.style.display = 'none'

    // Modal content
    const modalDialog = document.createElement('div')
    modalDialog.className = 'kb-modal-dialog'
    
    if (this.options.centered) {
      modalDialog.classList.add('kb-modal-centered')
    }

    const modalContent = document.createElement('div')
    modalContent.className = 'kb-modal-content'

    // Header
    const modalHeader = document.createElement('div')
    modalHeader.className = 'kb-modal-header'
    
    const modalTitle = document.createElement('h5')
    modalTitle.className = 'kb-modal-title'
    modalTitle.id = `${this.options.id}-title`
    modalTitle.textContent = this.options.title

    modalHeader.appendChild(modalTitle)

    if (this.options.showClose) {
      const closeButton = document.createElement('button')
      closeButton.className = 'kb-modal-close'
      closeButton.setAttribute('type', 'button')
      closeButton.setAttribute('aria-label', 'Close')
      closeButton.innerHTML = '&times;'
      closeButton.addEventListener('click', () => this.close())
      modalHeader.appendChild(closeButton)
    }

    // Body
    const modalBody = document.createElement('div')
    modalBody.className = 'kb-modal-body'
    
    if (typeof this.options.content === 'string') {
      modalBody.innerHTML = this.options.content
    } else if (this.options.content instanceof HTMLElement) {
      modalBody.appendChild(this.options.content)
    }

    if (this.options.scrollable) {
      modalBody.classList.add('kb-modal-scrollable')
    }

    // Footer
    const modalFooter = document.createElement('div')
    modalFooter.className = 'kb-modal-footer'

    if (this.options.showCancel) {
      const cancelButton = document.createElement('button')
      cancelButton.className = 'kb-btn kb-btn-secondary'
      cancelButton.textContent = this.options.cancelText
      cancelButton.addEventListener('click', () => this.handleCancel())
      modalFooter.appendChild(cancelButton)
    }

    if (this.options.showConfirm) {
      const confirmButton = document.createElement('button')
      confirmButton.className = 'kb-btn kb-btn-primary'
      confirmButton.textContent = this.options.confirmText
      confirmButton.addEventListener('click', () => this.handleConfirm())
      modalFooter.appendChild(confirmButton)
    }

    // Assemble
    modalContent.appendChild(modalHeader)
    modalContent.appendChild(modalBody)
    modalContent.appendChild(modalFooter)
    modalDialog.appendChild(modalContent)
    this.element.appendChild(modalDialog)

    // Append to body
    document.body.appendChild(this.element)
    if (this.backdropElement) {
      document.body.appendChild(this.backdropElement)
    }
  }

  bindEvents() {
    // Keyboard events
    if (this.options.keyboard) {
      document.addEventListener('keydown', (e) => {
        if (this.isOpen && e.key === 'Escape') {
          this.close()
        }
      })
    }

    // Backdrop click
    if (this.backdropElement) {
      this.backdropElement.addEventListener('click', (e) => {
        if (e.target === this.backdropElement) {
          this.close()
        }
      })
    }

    // Focus trap
    this.element.addEventListener('keydown', (e) => this.trapFocus(e))
  }

  trapFocus(e) {
    if (e.key !== 'Tab') return

    const focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus()
        e.preventDefault()
      }
    }
  }

  addValidators() {
    // Add default validators for form inputs
    const inputs = this.element.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      const rules = this.parseValidationRules(input)
      if (rules.length > 0) {
        this.validators.set(input, rules)
        input.addEventListener('blur', () => this.validateField(input))
        input.addEventListener('input', () => this.clearFieldError(input))
      }
    })
  }

  parseValidationRules(input) {
    const rules = []
    
    if (input.required) {
      rules.push({
        type: 'required',
        message: 'This field is required',
        validate: (value) => value.trim().length > 0
      })
    }

    if (input.type === 'email') {
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address',
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      })
    }

    if (input.type === 'url') {
      rules.push({
        type: 'url',
        message: 'Please enter a valid URL',
        validate: (value) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)
      })
    }

    if (input.minLength) {
      rules.push({
        type: 'minlength',
        message: `Minimum ${input.minLength} characters required`,
        validate: (value) => value.length >= input.minLength
      })
    }

    if (input.maxLength) {
      rules.push({
        type: 'maxlength',
        message: `Maximum ${input.maxLength} characters allowed`,
        validate: (value) => value.length <= input.maxLength
      })
    }

    if (input.pattern) {
      rules.push({
        type: 'pattern',
        message: 'Invalid format',
        validate: (value) => new RegExp(input.pattern).test(value)
      })
    }

    if (input.min) {
      rules.push({
        type: 'min',
        message: `Minimum value is ${input.min}`,
        validate: (value) => parseFloat(value) >= parseFloat(input.min)
      })
    }

    if (input.max) {
      rules.push({
        type: 'max',
        message: `Maximum value is ${input.max}`,
        validate: (value) => parseFloat(value) <= parseFloat(input.max)
      })
    }

    return rules
  }

  validateField(input) {
    const rules = this.validators.get(input)
    if (!rules) return true

    const value = input.value
    let isValid = true
    let errorMessage = ''

    for (const rule of rules) {
      if (!rule.validate(value)) {
        isValid = false
        errorMessage = rule.message
        break
      }
    }

    if (!isValid) {
      this.showFieldError(input, errorMessage)
    } else {
      this.clearFieldError(input)
    }

    return isValid
  }

  showFieldError(input, message) {
    input.classList.add('kb-is-invalid')
    
    let errorElement = input.parentElement.querySelector('.kb-invalid-feedback')
    if (!errorElement) {
      errorElement = document.createElement('div')
      errorElement.className = 'kb-invalid-feedback'
      input.parentElement.appendChild(errorElement)
    }
    errorElement.textContent = message
  }

  clearFieldError(input) {
    input.classList.remove('kb-is-invalid')
    const errorElement = input.parentElement.querySelector('.kb-invalid-feedback')
    if (errorElement) {
      errorElement.remove()
    }
  }

  validateAll() {
    const inputs = this.element.querySelectorAll('input, select, textarea')
    let isValid = true

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false
      }
    })

    // Run custom validation if provided
    if (this.options.validate && typeof this.options.validate === 'function') {
      const customValid = this.options.validate(this.element)
      if (!customValid) {
        isValid = false
      }
    }

    return isValid
  }

  open() {
    if (this.isOpen) return

    // Show backdrop
    if (this.backdropElement) {
      this.backdropElement.style.display = 'block'
      if (this.options.animation) {
        this.backdropElement.classList.add('kb-fade-in')
      }
    }

    // Show modal
    this.element.style.display = 'block'
    this.element.setAttribute('aria-hidden', 'false')
    
    if (this.options.animation) {
      this.element.classList.add('kb-fade-in', 'kb-slide-in')
    }

    // Disable body scroll
    document.body.style.overflow = 'hidden'

    // Focus first focusable element
    setTimeout(() => {
      const firstFocusable = this.element.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }, 100)

    this.isOpen = true

    // Call onOpen callback
    if (this.options.onOpen) {
      this.options.onOpen(this.element)
    }
  }

  close() {
    if (!this.isOpen) return

    // Hide backdrop
    if (this.backdropElement) {
      if (this.options.animation) {
        this.backdropElement.classList.remove('kb-fade-in')
        this.backdropElement.classList.add('kb-fade-out')
        setTimeout(() => {
          this.backdropElement.style.display = 'none'
          this.backdropElement.classList.remove('kb-fade-out')
        }, 300)
      } else {
        this.backdropElement.style.display = 'none'
      }
    }

    // Hide modal
    if (this.options.animation) {
      this.element.classList.remove('kb-fade-in', 'kb-slide-in')
      this.element.classList.add('kb-fade-out', 'kb-slide-out')
      setTimeout(() => {
        this.element.style.display = 'none'
        this.element.classList.remove('kb-fade-out', 'kb-slide-out')
      }, 300)
    } else {
      this.element.style.display = 'none'
    }

    this.element.setAttribute('aria-hidden', 'true')

    // Enable body scroll
    document.body.style.overflow = ''

    this.isOpen = false

    // Call onClose callback
    if (this.options.onClose) {
      this.options.onClose(this.element)
    }
  }

  handleConfirm() {
    if (this.validateAll()) {
      if (this.options.onConfirm) {
        this.options.onConfirm(this.element)
      } else {
        this.close()
      }
    }
  }

  handleCancel() {
    if (this.options.onCancel) {
      this.options.onCancel(this.element)
    } else {
      this.close()
    }
  }

  setContent(content) {
    const modalBody = this.element.querySelector('.kb-modal-body')
    if (typeof content === 'string') {
      modalBody.innerHTML = content
    } else if (content instanceof HTMLElement) {
      modalBody.innerHTML = ''
      modalBody.appendChild(content)
    }
    
    // Re-add validators for new content
    this.addValidators()
  }

  setTitle(title) {
    const modalTitle = this.element.querySelector('.kb-modal-title')
    if (modalTitle) {
      modalTitle.textContent = title
    }
  }

  destroy() {
    this.close()
    if (this.element) {
      this.element.remove()
    }
    if (this.backdropElement) {
      this.backdropElement.remove()
    }
    this.validators.clear()
  }
}

// Static methods for quick modals
KaribaseModal.alert = (message, title = 'Alert', options = {}) => {
  const modal = new KaribaseModal({
    title,
    content: message,
    showCancel: false,
    showConfirm: true,
    confirmText: 'OK',
    ...options
  })
  modal.open()
  return modal
}

KaribaseModal.confirm = (message, title = 'Confirm', options = {}) => {
  return new Promise((resolve) => {
    const modal = new KaribaseModal({
      title,
      content: message,
      showConfirm: true,
      showCancel: true,
      onConfirm: () => {
        modal.close()
        resolve(true)
      },
      onCancel: () => {
        modal.close()
        resolve(false)
      },
      ...options
    })
    modal.open()
  })
}

KaribaseModal.prompt = (message, defaultValue = '', title = 'Prompt', options = {}) => {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'kb-form-control'
    input.value = defaultValue
    input.style.width = '100%'

    const modal = new KaribaseModal({
      title,
      content: `<p>${message}</p>`,
      showConfirm: true,
      showCancel: true,
      onConfirm: () => {
        modal.close()
        resolve(input.value)
      },
      onCancel: () => {
        modal.close()
        resolve(null)
      },
      onOpen: () => {
        const modalBody = modal.element.querySelector('.kb-modal-body')
        modalBody.appendChild(input)
        input.focus()
      },
      ...options
    })
    modal.open()
  })
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KaribaseModal
}
