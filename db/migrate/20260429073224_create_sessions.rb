class CreateSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :sessions, id: :string, force: :cascade do |t|
      t.string :user_id, null: false
      t.string :token_digest, null: false
      t.string :user_agent
      t.string :ip_address
      t.datetime :last_active_at

      t.timestamps
    end

    add_index :sessions, :user_id
    add_index :sessions, :token_digest, unique: true
    add_foreign_key :sessions, :users
  end
end
