class HackathonTrack < ApplicationRecord
  belongs_to :hackathon

  acts_as_list scope: :hackathon

  validates :label, presence: true
end
