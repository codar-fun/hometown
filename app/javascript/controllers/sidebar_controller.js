import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "backdrop"]

  open() {
    this.panelTarget.classList.add("open")
    this.backdropTarget.classList.add("open")
    document.body.style.overflow = "hidden"
  }

  close() {
    this.panelTarget.classList.remove("open")
    this.backdropTarget.classList.remove("open")
    document.body.style.overflow = ""
  }

  // Close only on mobile (after nav link click, Turbo keeps the page)
  closeOnMobile() {
    if (window.innerWidth <= 768) this.close()
  }
}
