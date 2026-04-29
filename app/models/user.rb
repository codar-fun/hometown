class User < ApplicationRecord
  ROLES = %w[member admin].freeze

  has_many :verification_codes, dependent: :destroy
  has_many :sessions, dependent: :destroy
  has_many :form_submissions, dependent: :destroy
  has_many :created_forms, class_name: "Form", foreign_key: :created_by_id, dependent: :nullify
  has_one_attached :avatar

  validates :email,
    uniqueness: { case_sensitive: false },
    format: { with: URI::MailTo::EMAIL_REGEXP },
    allow_nil: true
  validates :phone, uniqueness: true, allow_nil: true
  validates :role, inclusion: { in: ROLES }
  validates :name, length: { maximum: 100 }
  validate :email_or_phone_present

  normalizes :email, with: ->(e) { e.strip.downcase }

  before_validation :normalize_phone

  def admin?
    role == "admin"
  end

  def display_name
    name.presence || email&.split("@")&.first || phone
  end

  private

  def email_or_phone_present
    errors.add(:base, "Email or phone number must be provided") if email.blank? && phone.blank?
  end

  def normalize_phone
    return if phone.blank?
    parsed = Phonelib.parse(phone)
    self.phone = parsed.e164.presence || phone
  end
end
