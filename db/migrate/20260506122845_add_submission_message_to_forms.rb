class AddSubmissionMessageToForms < ActiveRecord::Migration[8.1]
  def change
    add_column :forms, :submission_message, :text
  end
end
