import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["digit", "codeField", "resend", "countdown"]
  static values = { resendIn: { type: Number, default: 60 } }

  connect() {
    this._submitted = false
    this.digitTargets[0]?.focus()
    if (this.resendInValue > 0) this.startCountdown()
  }

  disconnect() {
    clearInterval(this._timer)
  }

  input(e) {
    const input = e.currentTarget
    const idx = this.digitTargets.indexOf(input)
    const digit = e.data?.replace(/\D/g, "") || ""

    if (digit) {
      input.value = digit
      const next = this.digitTargets[idx + 1]
      if (next) next.focus()
      else this.maybeSubmit()
    } else {
      input.value = ""
    }
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
    if (digits.length === 6) {
      // Set values without triggering input events
      this.digitTargets.forEach((el, i) => { el.value = digits[i] || "" })
      this.maybeSubmit()
    }
  }

  maybeSubmit() {
    const code = this.digitTargets.map(el => el.value).join("")
    if (code.length !== 6) return
    if (this._submitted) return
    this._submitted = true
    if (this.hasCodeFieldTarget) this.codeFieldTarget.value = code
    setTimeout(() => this.element.closest("form")?.requestSubmit(), 150)
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
