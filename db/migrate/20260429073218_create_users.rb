class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users, id: :string, force: :cascade do |t|
      t.string :email
      t.string :phone
      t.string :name
      t.text :bio
      t.string :role, null: false, default: "member"

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :phone, unique: true
  end
end
