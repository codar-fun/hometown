import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["typeSelect", "optionsSection", "optionsTextarea"]
  static values = { choiceTypes: Array }

  connect() {
    this.toggleOptions()
  }

  toggleOptions() {
    const isChoice = this.choiceTypesValue.includes(this.typeSelectTarget.value)
    this.optionsSectionTarget.style.display = isChoice ? "" : "none"
  }
}
