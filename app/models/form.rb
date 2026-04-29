class Form < ApplicationRecord
  belongs_to :created_by, class_name: "User", optional: true
  has_many :form_fields, -> { order(:position) }, dependent: :destroy
  has_many :form_submissions, dependent: :destroy

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/, message: "only lowercase letters, numbers and hyphens" }

  before_validation :generate_slug, on: :create

  scope :published, -> { where(published: true) }

  def to_param
    slug
  end

  def publish!
    update!(published: true)
  end

  def unpublish!
    update!(published: false)
  end

  private

  def generate_slug
    return if slug.present?
    self.slug = title.to_s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")[0..60]
    base = slug
    n = 1
    while Form.where(slug: slug).exists?
      self.slug = "#{base}-#{n}"
      n += 1
    end
  end
end
