class NotifyApplicationStatusJob < ApplicationJob
  queue_as :default

  def perform(form_submission_id)
    submission = FormSubmission.find_by(id: form_submission_id)
    return unless submission&.recipient_email.present?

    case submission.status
    when "approved"
      ApplicationStatusMailer.approved(submission).deliver_now
    when "rejected"
      ApplicationStatusMailer.rejected(submission).deliver_now
    end
  rescue => e
    Rails.logger.error "[NotifyApplicationStatusJob] Failed to send email for submission #{form_submission_id}: #{e.message}"
  end
end
