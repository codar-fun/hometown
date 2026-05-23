import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["refreshBtn", "select"]

  async refresh(e) {
    e.preventDefault()
    this.refreshBtn.disabled = true
    this.refreshBtn.style.opacity = "0.5"

    try {
      const response = await fetch("/projects/refresh_teams")
      const data = await response.json()

      // Update select options
      const select = this.element.querySelector("select")
      if (select) {
        select.innerHTML = '<option value="">选择团队</option>'
        data.teams.forEach(team => {
          const option = document.createElement("option")
          option.value = team.id
          option.textContent = team.name
          select.appendChild(option)
        })
      }
    } catch (error) {
      console.error("Failed to refresh teams:", error)
      alert("刷新团队列表失败")
    } finally {
      this.refreshBtn.disabled = false
      this.refreshBtn.style.opacity = "1"
    }
  }
}
