class CreateForms < ActiveRecord::Migration[8.1]
  def change
    create_table :forms do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.text :description
      t.boolean :published, null: false, default: false
      t.bigint :created_by_id

      t.timestamps
    end

    add_index :forms, :slug, unique: true
    add_foreign_key :forms, :users, column: :created_by_id
  end
end
