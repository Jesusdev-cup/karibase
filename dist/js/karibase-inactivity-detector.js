/**
 * Karibase Inactivity Detector
 * Detects user inactivity and performs configurable actions
 * @version 2.0.0
 */

class InactivityDetector {
  constructor(options = {}) {
    this.options = {
      timeout: options.timeout || 30 * 60 * 1000, // 30 minutes default
      warningTime: options.warningTime || 5 * 60 * 1000, // 5 minutes before timeout
      events: options.events || ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'],
      onWarning: options.onWarning || null,
      onTimeout: options.onTimeout || null,
      onActivity: options.onActivity || null,
      showWarning: options.showWarning !== undefined ? options.showWarning : true,
      autoLogout: options.autoLogout !== undefined ? options.autoLogout : false,
      redirectUrl: options.redirectUrl || '/login',
      resetOnActivity: options.resetOnActivity !== undefined ? options.resetOnActivity : true,
      debug: options.debug || false,
      ...options
    }

    this.timer = null
    this.warningTimer = null
    this.lastActivity = Date.now()
    this.isWarningShown = false
    this.isActive = true

    this.init()
  }

  init() {
    this.bindEvents()
    this.startTimer()
    this.log('Inactivity detector initialized with timeout:', this.options.timeout)
  }

  bindEvents() {
    this.options.events.forEach(event => {
      document.addEventListener(event, () => this.handleActivity(), { passive: true })
    })

    // Visibility change detection
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.log('Tab hidden, pausing timer')
        this.pauseTimer()
      } else {
        this.log('Tab visible, resuming timer')
        this.resumeTimer()
      }
    })
  }

  handleActivity() {
    this.lastActivity = Date.now()
    
    if (!this.isActive) {
      this.isActive = true
      this.log('Activity detected, resuming')
    }

    if (this.options.resetOnActivity) {
      this.resetTimer()
    }

    if (this.options.onActivity) {
      this.options.onActivity()
    }
  }

  startTimer() {
    this.clearTimers()
    
    // Warning timer
    if (this.options.showWarning && this.options.warningTime > 0) {
      this.warningTimer = setTimeout(() => {
        this.showWarning()
      }, this.options.timeout - this.options.warningTime)
    }

    // Main timeout timer
    this.timer = setTimeout(() => {
      this.handleTimeout()
    }, this.options.timeout)

    this.log('Timer started')
  }

  resetTimer() {
    this.clearTimers()
    this.isWarningShown = false
    this.startTimer()
    this.log('Timer reset')
  }

  pauseTimer() {
    this.clearTimers()
    this.log('Timer paused')
  }

  resumeTimer() {
    const elapsed = Date.now() - this.lastActivity
    const remaining = this.options.timeout - elapsed

    if (remaining > 0) {
      this.clearTimers()
      
      if (this.options.showWarning && this.options.warningTime > 0 && remaining > this.options.warningTime) {
        this.warningTimer = setTimeout(() => {
          this.showWarning()
        }, remaining - this.options.warningTime)
      }

      this.timer = setTimeout(() => {
        this.handleTimeout()
      }, remaining)

      this.log('Timer resumed with', remaining, 'ms remaining')
    } else {
      this.handleTimeout()
    }
  }

  clearTimers() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer)
      this.warningTimer = null
    }
  }

  showWarning() {
    if (this.isWarningShown) return

    this.isWarningShown = true
    this.log('Warning shown')

    if (this.options.showWarning) {
      this.createWarningModal()
    }

    if (this.options.onWarning) {
      this.options.onWarning()
    }
  }

  createWarningModal() {
    // Remove existing warning
    const existingWarning = document.getElementById('karibase-inactivity-warning')
    if (existingWarning) {
      existingWarning.remove()
    }

    // Create warning modal
    const modal = document.createElement('div')
    modal.id = 'karibase-inactivity-warning'
    modal.className = 'kb-inactivity-warning'
    modal.innerHTML = `
      <div class="kb-inactivity-warning-content">
        <div class="kb-inactivity-warning-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="kb-inactivity-warning-title">Session Expiring Soon</h3>
        <p class="kb-inactivity-warning-message">
          Your session will expire in ${this.formatTime(this.options.warningTime)} due to inactivity.
        </p>
        <div class="kb-inactivity-warning-actions">
          <button class="kb-btn kb-btn-primary" id="kb-extend-session">Continue Session</button>
          <button class="kb-btn kb-btn-secondary" id="kb-logout-now">Logout Now</button>
        </div>
        <div class="kb-inactivity-countdown">
          <span id="kb-countdown-timer">${this.formatTime(this.options.warningTime)}</span>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Bind events
    document.getElementById('kb-extend-session').addEventListener('click', () => {
      this.handleActivity()
      modal.remove()
    })

    document.getElementById('kb-logout-now').addEventListener('click', () => {
      this.handleTimeout()
    })

    // Start countdown
    this.startCountdown(modal)
  }

  startCountdown(modal) {
    let remaining = this.options.warningTime
    const countdownElement = modal.querySelector('#kb-countdown-timer')

    const countdownInterval = setInterval(() => {
      remaining -= 1000
      countdownElement.textContent = this.formatTime(remaining)

      if (remaining <= 0) {
        clearInterval(countdownInterval)
        this.handleTimeout()
      }
    }, 1000)

    // Store interval on modal for cleanup
    modal.dataset.countdownInterval = countdownInterval
  }

  handleTimeout() {
    this.clearTimers()
    this.isActive = false
    this.log('Timeout reached')

    // Remove warning modal if exists
    const warningModal = document.getElementById('karibase-inactivity-warning')
    if (warningModal) {
      const countdownInterval = warningModal.dataset.countdownInterval
      if (countdownInterval) {
        clearInterval(parseInt(countdownInterval))
      }
      warningModal.remove()
    }

    if (this.options.autoLogout) {
      this.logout()
    }

    if (this.options.onTimeout) {
      this.options.onTimeout()
    }
  }

  logout() {
    this.log('Logging out due to inactivity')
    
    // Clear session storage
    sessionStorage.clear()
    
    // Clear local storage (optional - can be configured)
    // localStorage.clear()
    
    // Redirect
    if (this.options.redirectUrl) {
      window.location.href = this.options.redirectUrl
    }
  }

  formatTime(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  getRemainingTime() {
    const elapsed = Date.now() - this.lastActivity
    const remaining = this.options.timeout - elapsed
    return Math.max(0, remaining)
  }

  getLastActivity() {
    return this.lastActivity
  }

  isActiveSession() {
    return this.isActive
  }

  destroy() {
    this.clearTimers()
    this.options.events.forEach(event => {
      document.removeEventListener(event, () => this.handleActivity())
    })
    
    const warningModal = document.getElementById('karibase-inactivity-warning')
    if (warningModal) {
      const countdownInterval = warningModal.dataset.countdownInterval
      if (countdownInterval) {
        clearInterval(parseInt(countdownInterval))
      }
      warningModal.remove()
    }

    this.log('Inactivity detector destroyed')
  }

  log(...args) {
    if (this.options.debug) {
      console.log('[InactivityDetector]', ...args)
    }
  }
}

// Auto-initialization with data attributes
document.addEventListener('DOMContentLoaded', () => {
  const detectorElement = document.querySelector('[data-inactivity-detector]')
  if (detectorElement) {
    const options = {
      timeout: parseInt(detectorElement.dataset.timeout) || 30 * 60 * 1000,
      warningTime: parseInt(detectorElement.dataset.warningTime) || 5 * 60 * 1000,
      autoLogout: detectorElement.dataset.autoLogout === 'true',
      redirectUrl: detectorElement.dataset.redirectUrl || '/login',
      showWarning: detectorElement.dataset.showWarning !== 'false',
      debug: detectorElement.dataset.debug === 'true'
    }

    window.inactivityDetector = new InactivityDetector(options)
  }
})

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InactivityDetector
}
