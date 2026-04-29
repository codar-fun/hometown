class CreateUserFollows < ActiveRecord::Migration[8.1]
  def change
    create_table :user_follows, id: :string, force: :cascade do |t|
      t.string :follower_id, null: false
      t.string :following_id, null: false

      t.timestamps
    end

    add_index :user_follows, [ :follower_id, :following_id ], unique: true
    add_index :user_follows, :following_id

    add_foreign_key :user_follows, :users, column: :follower_id
    add_foreign_key :user_follows, :users, column: :following_id
  end
end
