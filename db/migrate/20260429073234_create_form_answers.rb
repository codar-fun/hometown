class CreateFormAnswers < ActiveRecord::Migration[8.1]
  def change
    create_table :form_answers, id: :string, force: :cascade do |t|
      t.string :form_submission_id, null: false
      t.string :form_field_id, null: false
      t.text :value

      t.timestamps
    end

    add_index :form_answers, :form_submission_id
    add_index :form_answers, :form_field_id
    add_foreign_key :form_answers, :form_submissions
    add_foreign_key :form_answers, :form_fields
  end
end
