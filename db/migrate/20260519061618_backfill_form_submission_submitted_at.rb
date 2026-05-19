class BackfillFormSubmissionSubmittedAt < ActiveRecord::Migration[8.1]
  def change
    execute "UPDATE form_submissions SET submitted_at = created_at WHERE submitted_at IS NULL"
  end
end
