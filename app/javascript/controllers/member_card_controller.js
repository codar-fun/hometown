import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["card", "profileLink"]

  click(e) {
    // If click is on the follow button, let it handle itself
    if (e.target.closest("button") || e.target.closest("a[href*='/identification']")) {
      return
    }

    // Otherwise, navigate to the member's profile
    if (this.hasProfileLinkTarget) {
      window.location.href = this.profileLinkTarget.href
    }
  }
}
