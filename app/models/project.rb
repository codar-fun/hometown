class Project < ApplicationRecord
  belongs_to :hackathon, optional: true
  has_many :project_team_members, dependent: :destroy
  has_many :team_members, through: :project_team_members, source: :user
  has_many :project_likes, dependent: :destroy
  has_many :liked_by, through: :project_likes, source: :user
  has_many :project_comments, -> { order(:created_at) }, dependent: :destroy

  validates :name, presence: true

  scope :by_likes, -> { order(likes_count: :desc) }
  scope :by_newest, -> { order(submitted_at: :desc) }
  scope :winners, -> { where.not(winner: nil) }
end
