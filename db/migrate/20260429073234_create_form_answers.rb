class CreateFormAnswers < ActiveRecord::Migration[8.1]
  def change
    create_table :form_answers do |t|
      t.references :form_submission, null: false, foreign_key: true
      t.references :form_field, null: false, foreign_key: true
      t.text :value

      t.timestamps
    end
  end
end
