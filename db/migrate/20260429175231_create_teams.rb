class CreateTeams < ActiveRecord::Migration[8.1]
  def change
    create_table :teams, id: :string do |t|
      t.string   :name,        null: false
      t.string   :slug,        null: false
      t.text     :description
      t.string   :owner_id,    null: false
      t.string   :avatar_color

      t.timestamps
    end
    add_index :teams, :slug, unique: true
    add_index :teams, :owner_id
    add_foreign_key :teams, :users, column: :owner_id
  end
end
