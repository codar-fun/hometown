class CreateFormSubmissions < ActiveRecord::Migration[8.1]
  def change
    create_table :form_submissions do |t|
      t.references :form, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :status, null: false, default: "pending"
      t.text :admin_note
      t.datetime :submitted_at, null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.timestamps
    end

    add_index :form_submissions, [ :form_id, :user_id ], unique: true
    add_index :form_submissions, [ :form_id, :status ]
  end
end
