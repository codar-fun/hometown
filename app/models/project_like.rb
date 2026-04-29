class ProjectLike < ApplicationRecord
  belongs_to :project
  belongs_to :user

  validates :user_id, uniqueness: { scope: :project_id }

  after_create  :increment_likes
  after_destroy :decrement_likes

  private

  def increment_likes
    project.increment!(:likes_count)
  end

  def decrement_likes
    project.decrement!(:likes_count)
  end
end
