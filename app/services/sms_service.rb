class SmsService
  def self.send_otp(phone:, code:)
    adapter.deliver(to: phone, body: "Your Hometown code is #{code}. Valid for 10 minutes.")
  end

  def self.adapter
    if Rails.env.production? && ENV["TWILIO_ACCOUNT_SID"].present?
      TwilioAdapter.new
    else
      LogAdapter.new
    end
  end

  class LogAdapter
    def deliver(to:, body:)
      Rails.logger.info "[SmsService] To: #{to} | #{body}"
    end
  end

  class TwilioAdapter
    def deliver(to:, body:)
      client = Twilio::REST::Client.new(ENV["TWILIO_ACCOUNT_SID"], ENV["TWILIO_AUTH_TOKEN"])
      client.messages.create(
        from: ENV["TWILIO_PHONE_NUMBER"],
        to: to,
        body: body
      )
    end
  end
end
