class Project < ApplicationRecord
  belongs_to :hackathon, optional: true
  belongs_to :team, optional: true
  has_many :project_team_members, dependent: :destroy
  has_many :team_members, through: :project_team_members, source: :user
  has_many :project_likes, dependent: :destroy
  has_many :liked_by, through: :project_likes, source: :user
  has_many :project_comments, -> { order(:created_at) }, dependent: :destroy

  validates :name, presence: true
  validates :track, presence: true
  validate :team_required_on_submit, if: -> { status == "submitted" }

  scope :by_likes, -> { order(likes_count: :desc) }
  scope :by_newest, -> { order(submitted_at: :desc) }
  scope :winners, -> { where.not(winner: nil) }
  scope :approved, -> { where(status: "approved") }
  scope :submitted, -> { where(status: "submitted") }
  scope :draft, -> { where(status: "draft") }

  STATUSES = %w[draft submitted approved rejected].freeze
  VALID_TRANSITIONS = {
    "draft" => ["submitted"],
    "submitted" => ["approved", "rejected"],
    "approved" => [],
    "rejected" => ["submitted"]
  }.freeze

  def creator?(user)
    return false unless user
    project_team_members.exists?(user: user, role_label: "队长")
  end

  def can_submit?(user)
    creator?(user) && (status == "draft" || status == "rejected") && team_id.present?
  end

  def can_approve?(user)
    user&.admin? && status == "submitted"
  end

  def can_reject?(user)
    user&.admin? && status == "submitted"
  end

  def submit!
    update!(status: "submitted", status_updated_at: Time.current, submitted_at: Time.current)
  end

  def approve!
    update!(status: "approved", status_updated_at: Time.current, rejection_reason: nil)
  end

  def reject!(reason = nil)
    update!(status: "rejected", status_updated_at: Time.current, rejection_reason: reason)
  end

  def reopen!
    update!(status: "draft", status_updated_at: Time.current, rejection_reason: nil)
  end

  private

  def team_required_on_submit
    errors.add(:team_id, "提交项目必须选择一个团队") if team_id.blank?
  end
end
