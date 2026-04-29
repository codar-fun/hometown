class NotifyApplicationStatusJob < ApplicationJob
  queue_as :default

  def perform(form_submission_id)
    submission = FormSubmission.find_by(id: form_submission_id)
    return unless submission&.user&.email.present?

    case submission.status
    when "approved"
      ApplicationStatusMailer.approved(submission).deliver_now
    when "rejected"
      ApplicationStatusMailer.rejected(submission).deliver_now
    end
  end
end
