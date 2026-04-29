class User < ApplicationRecord
  ROLES = %w[member admin].freeze

  has_many :verification_codes, dependent: :destroy
  has_many :sessions, dependent: :destroy
  has_many :form_submissions, dependent: :destroy
  has_many :created_forms, class_name: "Form", foreign_key: :created_by_id, dependent: :nullify
  has_many :hosted_events, class_name: "Event", foreign_key: :host_id, dependent: :nullify
  has_many :event_attendees, dependent: :destroy
  has_many :attended_events, through: :event_attendees, source: :event
  has_many :project_team_members, dependent: :destroy
  has_many :projects, through: :project_team_members
  has_many :project_likes, dependent: :destroy
  has_many :liked_projects, through: :project_likes, source: :project
  has_many :project_comments, dependent: :destroy
  has_many :follows_as_follower, class_name: "UserFollow", foreign_key: :follower_id, dependent: :destroy
  has_many :follows_as_following, class_name: "UserFollow", foreign_key: :following_id, dependent: :destroy
  has_many :following, through: :follows_as_follower, source: :following
  has_many :followers, through: :follows_as_following, source: :follower
  has_many :owned_teams, class_name: "Team", foreign_key: :owner_id, dependent: :destroy
  has_many :team_memberships, class_name: "TeamMember", dependent: :destroy
  has_many :teams, through: :team_memberships
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
