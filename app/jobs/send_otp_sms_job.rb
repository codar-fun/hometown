class SendOtpSmsJob < ApplicationJob
  queue_as :default

  def perform(user_id, code)
    user = User.find_by(id: user_id)
    return unless user&.phone.present?
    SmsService.send_otp(phone: user.phone, code: code)
  end
end
