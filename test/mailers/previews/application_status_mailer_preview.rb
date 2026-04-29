class ApplicationStatusMailerPreview < ActionMailer::Preview
  def approved
    submission = FormSubmission.first || build_preview_submission
    ApplicationStatusMailer.approved(submission)
  end

  def rejected
    submission = FormSubmission.first || build_preview_submission
    ApplicationStatusMailer.rejected(submission)
  end

  private

  def build_preview_submission
    user = User.new(email: "preview@example.com", name: "Preview User")
    form = Form.new(title: "Hackathon 2026 Registration")
    FormSubmission.new(user: user, form: form, status: "approved")
  end
end
