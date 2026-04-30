import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["phoneBtn", "emailBtn", "input", "label", "channelField"]
  static values = { method: { type: String, default: "phone" } }

  connect() {
    this.updateUI()
  }

  selectPhone() {
    this.methodValue = "phone"
    this.updateUI()
  }

  selectEmail() {
    this.methodValue = "email"
    this.updateUI()
  }

  updateUI() {
    const isPhone = this.methodValue === "phone"

    if (this.hasPhoneBtnTarget) {
      const btn = this.phoneBtnTarget
      btn.style.background = isPhone ? "var(--bg-elev-2)" : "transparent"
      btn.style.color = isPhone ? "var(--text)" : "var(--text-2)"
    }
    if (this.hasEmailBtnTarget) {
      const btn = this.emailBtnTarget
      btn.style.background = !isPhone ? "var(--bg-elev-2)" : "transparent"
      btn.style.color = !isPhone ? "var(--text)" : "var(--text-2)"
    }
    if (this.hasInputTarget) {
      this.inputTarget.type = isPhone ? "tel" : "email"
      this.inputTarget.placeholder = isPhone ? "138 0000 0000" : "you@example.com"
      this.inputTarget.name = isPhone ? "phone" : "email"
      this.inputTarget.value = ""
      this.inputTarget.focus()
    }
    if (this.hasLabelTarget) {
      this.labelTarget.textContent = isPhone ? "手机号" : "邮箱"
    }
    if (this.hasChannelFieldTarget) {
      this.channelFieldTarget.value = isPhone ? "sms" : "email"
    }
  }
}
