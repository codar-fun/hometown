require_relative "../../lib/send_sms"

class SmsService
  def self.send_otp(phone:, code:)
    if Rails.env.production?
      SendSms.send_sms(phone, code)
    else
      Rails.logger.info "[SmsService] To: #{phone} | Code: #{code}"
    end
  end
end
