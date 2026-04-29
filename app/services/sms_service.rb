require_relative "../../lib/send_sms"

class SmsService
  def self.send_otp(phone:, code:)
    SendSms.send_sms_aliyun(phone, code)
    Rails.logger.info "[SmsService] To: #{phone} | Code: #{code}"
    # if Rails.env.production?
    #   SendSms.send_sms_aliyun(phone, code)
    #   Rails.logger.info "[SmsService] To: #{phone} | Code: #{code}"
    # else
    #   Rails.logger.info "[SmsService] To: #{phone} | Code: #{code}"
    # end
  end
end
