import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["refreshBtn", "teamWrapper"]

  async refresh(e) {
    e.preventDefault()
    this.refreshBtn.disabled = true
    this.refreshBtn.style.opacity = "0.5"

    try {
      const response = await fetch("/projects/refresh_teams")
      const data = await response.json()

      // Update the team wrapper
      const wrapper = this.teamWrapperTarget
      const existingSelect = wrapper.querySelector("select")
      const existingError = wrapper.querySelector("div[style*='FEE2E2']")
      const existingHidden = wrapper.querySelector("input[type='hidden']")

      if (data.teams.length > 0) {
        // We have teams now
        if (existingError) existingError.remove()
        if (existingHidden) existingHidden.remove()

        if (existingSelect) {
          // Update existing select
          existingSelect.innerHTML = '<option value="">选择团队</option>'
          data.teams.forEach(team => {
            const option = document.createElement("option")
            option.value = team.id
            option.textContent = team.name
            existingSelect.appendChild(option)
          })
          existingSelect.required = true
          existingSelect.disabled = false
        } else {
          // Create new select
          const select = document.createElement("select")
          select.name = "project[team_id]"
          select.className = "select"
          select.required = true
          select.innerHTML = '<option value="">选择团队</option>'
          data.teams.forEach(team => {
            const option = document.createElement("option")
            option.value = team.id
            option.textContent = team.name
            select.appendChild(option)
          })
          wrapper.innerHTML = ""
          wrapper.appendChild(select)
        }
      } else {
        // No teams
        if (existingSelect) existingSelect.remove()

        wrapper.innerHTML = '<div style="padding:12px 14px;background:#FEE2E2;border:1px solid #FECACA;border-radius:6px;color:#991B1B;font-size:13px;">还没有加入任何团队。<a href="/teams/new" target="_blank" class="underline">创建团队</a></div>'

        const hidden = document.createElement("input")
        hidden.type = "hidden"
        hidden.name = "project[team_id]"
        hidden.value = ""
        wrapper.appendChild(hidden)
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
