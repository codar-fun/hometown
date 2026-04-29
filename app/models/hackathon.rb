class Hackathon < ApplicationRecord
  STATUSES = %w[draft live reviewing ended].freeze
  LOCATION_TYPES = %w[onsite online hybrid].freeze
  REVIEW_MODES = %w[manual auto].freeze

  belongs_to :form, optional: true
  belongs_to :created_by, class_name: "User", optional: true
  has_many :hackathon_tracks, -> { order(:position) }, dependent: :destroy
  has_many :hackathon_sponsors, -> { order(:position) }, dependent: :destroy
  has_many :projects, dependent: :nullify

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :status, inclusion: { in: STATUSES }
  validates :location_type, inclusion: { in: LOCATION_TYPES }, allow_nil: true
  validates :review_mode, inclusion: { in: REVIEW_MODES }

  before_validation :generate_slug, on: :create, if: -> { slug.blank? && name.present? }

  scope :published, -> { where.not(status: "draft") }
  scope :live,      -> { where(status: "live") }
  scope :featured,  -> { where(featured: true) }

  private

  def generate_slug
    self.slug = name.parameterize
  end
end
