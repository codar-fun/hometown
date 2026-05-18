class HackathonParticipant < ApplicationRecord
  belongs_to :user
  belongs_to :hackathon

  validates :user_id, :hackathon_id, :role, presence: true
  validates :user_id, uniqueness: { scope: :hackathon_id, message: "can only participate once per hackathon" }
end
