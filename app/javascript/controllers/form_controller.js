import { Controller } from "@hotwired/stimulus"

// Prevents pressing Enter inside single-line inputs from submitting the form.
// Attach with data-controller="form" on the <form> element.
export default class extends Controller {
  preventEnter(e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      e.preventDefault()
    }
  }
}
