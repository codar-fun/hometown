import { Controller } from "@hotwired/stimulus"

// Keyboard shortcuts for the Gmail-style review queue:
// J / ArrowDown  — next submission
// K / ArrowUp    — previous submission
// E              — approve selected
// X              — reject selected
// S              — toggle star

export default class extends Controller {
  static targets = ["item", "approveBtn", "rejectBtn", "starBtn"]

  connect() {
    this._onKey = this.onKey.bind(this)
    window.addEventListener("keydown", this._onKey)
  }

  disconnect() {
    window.removeEventListener("keydown", this._onKey)
  }

  select(e) {
    const btn = e.currentTarget
    this.itemTargets.forEach(el => el.classList.remove("active"))
    btn.classList.add("active")
    btn.scrollIntoView({ block: "nearest" })
  }

  onKey(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return
    if (e.metaKey || e.ctrlKey || e.altKey) return

    const items = this.itemTargets
    const active = items.findIndex(el => el.classList.contains("active"))

    switch (e.key) {
      case "j":
      case "ArrowDown": {
        e.preventDefault()
        const next = items[Math.min(items.length - 1, active + 1)]
        next?.click()
        break
      }
      case "k":
      case "ArrowUp": {
        e.preventDefault()
        const prev = items[Math.max(0, active - 1)]
        prev?.click()
        break
      }
      case "e": {
        e.preventDefault()
        const approveBtn = document.querySelector("[data-approve-btn]")
        approveBtn?.click()
        break
      }
      case "x": {
        e.preventDefault()
        const rejectBtn = document.querySelector("[data-reject-btn]")
        rejectBtn?.click()
        break
      }
      case "s": {
        e.preventDefault()
        const starBtn = document.querySelector("[data-star-btn]")
        starBtn?.click()
        break
      }
    }
  }
}
