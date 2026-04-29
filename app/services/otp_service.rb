class OtpService
  CODE_LENGTH = 6
  EXPIRY_MINUTES = 10

  def self.generate_for(user:, channel:)
    raw_code = SecureRandom.random_number(10**CODE_LENGTH).to_s.rjust(CODE_LENGTH, "0")
    user.verification_codes.create!(
      channel: channel,
      code: raw_code,
      expires_at: EXPIRY_MINUTES.minutes.from_now
    )
    raw_code
  end

  def self.verify(user:, raw_code:)
    vc = user.verification_codes.valid_codes.order(created_at: :desc).first
    return :not_found if vc.nil?
    return :invalid unless vc.authenticate_code(raw_code)
    vc.consume!
    :ok
  end
end
