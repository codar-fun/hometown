import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["digit", "codeField", "resend", "countdown"]
  static values = { resendIn: { type: Number, default: 60 } }

  connect() {
    this.digitTargets[0]?.focus()
    if (this.resendInValue > 0) this.startCountdown()
  }

  disconnect() {
    clearInterval(this._timer)
  }

  input(e) {
    const input = e.currentTarget
    const idx = this.digitTargets.indexOf(input)

    // Mobile browsers (iOS Safari) dump the full OTP into the first input via autocomplete.
    // Detect multi-char data and redistribute across all digit inputs.
    const raw = (e.data || input.value || "").replace(/\D/g, "")
    if (raw.length > 1) {
      const digits = raw.slice(0, 6)
      this.digitTargets.forEach((el, i) => { el.value = digits[i] || "" })
      this.syncCodeField()
      return
    }

    const digit = raw
    if (digit) {
      input.value = digit
      const next = this.digitTargets[idx + 1]
      if (next) next.focus()
    } else {
      input.value = ""
    }
    this.syncCodeField()
  }

  keydown(e) {
    const input = e.currentTarget
    const idx = this.digitTargets.indexOf(input)

    if (e.key === "Backspace" && !input.value && idx > 0) {
      this.digitTargets[idx - 1].focus()
    } else if (e.key === "ArrowLeft" && idx > 0) {
      this.digitTargets[idx - 1].focus()
    } else if (e.key === "ArrowRight" && idx < 5) {
      this.digitTargets[idx + 1].focus()
    }
  }

  paste(e) {
    e.preventDefault()
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (digits.length > 0) {
      this.digitTargets.forEach((el, i) => { el.value = digits[i] || "" })
      this.syncCodeField()
    }
  }

  syncCodeField() {
    if (this.hasCodeFieldTarget) {
      this.codeFieldTarget.value = this.digitTargets.map(el => el.value).join("")
    }
  }

  resend() {
    this.resendInValue = 60
    this.startCountdown()
    // POST to the identification path to resend — handled by a separate small form if wired up
  }

  startCountdown() {
    clearInterval(this._timer)
    this.updateCountdown()
    this._timer = setInterval(() => {
      this.resendInValue--
      this.updateCountdown()
      if (this.resendInValue <= 0) clearInterval(this._timer)
    }, 1000)
  }

  updateCountdown() {
    if (this.hasCountdownTarget) {
      this.countdownTarget.textContent = this.resendInValue > 0
        ? `${this.resendInValue} 秒后可重新发送`
        : ""
    }
    if (this.hasResendTarget) {
      this.resendTarget.hidden = this.resendInValue > 0
    }
  }
}
