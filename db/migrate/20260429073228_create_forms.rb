class CreateForms < ActiveRecord::Migration[8.1]
  def change
    create_table :forms, id: :string, force: :cascade do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.text :description
      t.boolean :published, null: false, default: false
      t.string :created_by_id

      t.timestamps
    end

    add_index :forms, :slug, unique: true
    add_index :forms, :created_by_id
    add_foreign_key :forms, :users, column: :created_by_id
  end
end
