class SendOtpEmailJob < ApplicationJob
  queue_as :default

  def perform(user_id, code)
    user = User.find_by(id: user_id)
    return unless user&.email.present?
    AuthMailer.verification_code(user, code).deliver_now
  end
end
