class Team < ApplicationRecord
  belongs_to :owner, class_name: "User"
  has_many :team_members, dependent: :destroy
  has_many :members, through: :team_members, source: :user
  has_many :projects, dependent: :nullify

  validates :name, presence: true, length: { maximum: 60 }
  validates :slug, presence: true, uniqueness: true, length: { minimum: 2, maximum: 30 },
            format: { with: /\A[a-z0-9\-]+\z/, message: "只允许小写字母、数字和连字符" }

  before_validation :generate_slug, on: :create, if: -> { slug.blank? }
  after_create :add_owner_as_member

  def to_param = slug

  def member?(user)
    return false unless user
    team_members.exists?(user: user)
  end

  def owner?(user)
    owner_id == user&.id
  end

  private

  def generate_slug
    base = name.to_s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")[0..50]
    self.slug = base
    n = 1
    while Team.where(slug: slug).exists?
      self.slug = "#{base}-#{n}"
      n += 1
    end
  end

  def add_owner_as_member
    team_members.create!(user: owner, joined_at: Time.current)
  end
end
