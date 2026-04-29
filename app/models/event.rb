class Event < ApplicationRecord
  STATUSES = %w[upcoming past].freeze
  KINDS = ["分享会", "Meetup", "读书会", "工作坊", "Hackathon", "Office Hours"].freeze

  belongs_to :host, class_name: "User", optional: true
  has_many :event_attendees, dependent: :destroy
  has_many :attendees, through: :event_attendees, source: :user

  validates :title, presence: true
  validates :kind, presence: true
  validates :status, inclusion: { in: STATUSES }

  scope :upcoming, -> { where(status: "upcoming").order(:date) }
  scope :past,     -> { where(status: "past").order(date: :desc) }
  scope :featured, -> { where(featured: true) }
end
