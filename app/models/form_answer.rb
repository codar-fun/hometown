class FormAnswer < ApplicationRecord
  belongs_to :form_submission
  belongs_to :form_field
  has_one_attached :file_attachment
end
