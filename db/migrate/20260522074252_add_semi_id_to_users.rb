class AddSemiIdToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :semi_id, :string
    add_index :users, :semi_id, unique: true
  end
end
