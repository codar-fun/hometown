import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["field"]

  autoSubmit() {
    const field = this.fieldTarget
    if (field.value.replace(/\D/g, "").length >= 6) {
      field.closest("form").requestSubmit()
    }
  }
}
