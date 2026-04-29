class FormSubmission < ApplicationRecord
  STATUSES = %w[pending approved rejected].freeze

  belongs_to :form
  belongs_to :user
  has_many :form_answers, dependent: :destroy

  validates :status, inclusion: { in: STATUSES }
  validate :one_submission_per_user, on: :create

  after_update :notify_on_status_change, if: :saved_change_to_status?

  scope :pending,  -> { where(status: "pending") }
  scope :approved, -> { where(status: "approved") }
  scope :rejected, -> { where(status: "rejected") }

  def approve!(note: nil)
    update!(status: "approved", admin_note: note)
  end

  def reject!(note: nil)
    update!(status: "rejected", admin_note: note)
  end

  private

  def one_submission_per_user
    if FormSubmission.exists?(form_id: form_id, user_id: user_id)
      errors.add(:base, "You have already submitted this form")
    end
  end

  def notify_on_status_change
    NotifyApplicationStatusJob.perform_later(id)
  end
end
