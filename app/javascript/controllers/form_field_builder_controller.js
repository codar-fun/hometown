import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["fieldType", "optionsContainer"]

  connect() {
    this.toggleOptions()
  }

  toggleOptions() {
    if (!this.hasFieldTypeTarget || !this.hasOptionsContainerTarget) return
    const choiceTypes = ["radio", "checkbox", "dropdown"]
    const isChoice = choiceTypes.includes(this.fieldTypeTarget.value)
    this.optionsContainerTarget.style.display = isChoice ? "block" : "none"
  }
}
