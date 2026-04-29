class FormField < ApplicationRecord
  FIELD_TYPES = %w[short_text long_text email phone url number radio checkbox select date file].freeze

  belongs_to :form
  has_many :form_answers, dependent: :destroy

  acts_as_list scope: :form

  validates :label, presence: true
  validates :field_type, inclusion: { in: FIELD_TYPES }
  validate :options_present_for_choice_fields

  private

  def options_present_for_choice_fields
    if %w[radio checkbox select].include?(field_type) && options.blank?
      errors.add(:options, "must be provided for #{field_type} fields")
    end
  end
end
