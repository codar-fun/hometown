class CreateFormSubmissions < ActiveRecord::Migration[8.1]
  def change
    create_table :form_submissions, id: :string, force: :cascade do |t|
      t.string :form_id, null: false
      t.string :user_id, null: false
      t.string :status, null: false, default: "pending"
      t.text :admin_note
      t.datetime :submitted_at, null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.timestamps
    end

    add_index :form_submissions, [ :form_id, :user_id ], unique: true
    add_index :form_submissions, [ :form_id, :status ]
    add_index :form_submissions, :user_id
    add_foreign_key :form_submissions, :forms
    add_foreign_key :form_submissions, :users
  end
end
