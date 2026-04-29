class AddProfileFieldsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :handle, :string
    add_column :users, :school, :string
    add_column :users, :github, :string
    add_column :users, :city, :string
    add_column :users, :tagline, :string
    add_column :users, :avatar_color, :string
    add_column :users, :skills, :jsonb, default: []

    add_index :users, :handle, unique: true
  end
end
