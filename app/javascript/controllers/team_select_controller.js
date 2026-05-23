import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["refreshBtn"]

  async refresh(e) {
    e.preventDefault()
    this.refreshBtn.disabled = true
    this.refreshBtn.style.opacity = "0.5"

    try {
      const response = await fetch("/projects/refresh_teams")
      const html = await response.text()
      this.element.innerHTML = html

      // Reconnect controller to new element
      this.application.router.refresh()
    } catch (error) {
      console.error("Failed to refresh teams:", error)
      alert("刷新团队列表失败")
    } finally {
      setTimeout(() => {
        this.refreshBtn.disabled = false
        this.refreshBtn.style.opacity = "1"
      }, 500)
    }
  }
}
