class HackathonSponsor < ApplicationRecord
  belongs_to :hackathon

  acts_as_list scope: :hackathon

  validates :name, presence: true
end
