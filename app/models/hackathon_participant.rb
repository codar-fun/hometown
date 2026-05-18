class HackathonParticipant < ApplicationRecord
  belongs_to :user
  belongs_to :hackathon

  validates :user_id, :hackathon_id, :role, presence: true
  validates :user_id, uniqueness: { scope: :hackathon_id, message: "can only participate once per hackathon" }

  after_create :update_hackathon_count
  after_destroy :update_hackathon_count

  private

  def update_hackathon_count
    hackathon.update_registered_count
  end
end
