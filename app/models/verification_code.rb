class VerificationCode < ApplicationRecord
  belongs_to :user

  EXPIRY_MINUTES = 10
  CHANNELS = %w[email sms].freeze

  has_secure_password :code, validations: false

  validates :channel, inclusion: { in: CHANNELS }
  validates :expires_at, presence: true

  scope :valid_codes, -> { where(used_at: nil).where("expires_at > ?", Time.current) }

  def expired?
    expires_at < Time.current
  end

  def used?
    used_at.present?
  end

  def consume!
    update!(used_at: Time.current)
  end
end
