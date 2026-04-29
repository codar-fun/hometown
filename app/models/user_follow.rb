class UserFollow < ApplicationRecord
  belongs_to :follower, class_name: "User"
  belongs_to :following, class_name: "User"

  validates :following_id, uniqueness: { scope: :follower_id }
  validate :cannot_follow_self

  private

  def cannot_follow_self
    errors.add(:following_id, "cannot follow yourself") if follower_id == following_id
  end
end
