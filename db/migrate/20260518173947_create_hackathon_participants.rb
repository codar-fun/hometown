class CreateHackathonParticipants < ActiveRecord::Migration[8.1]
  def change
    create_table :hackathon_participants, id: :string do |t|
      t.string :user_id, null: false
      t.string :hackathon_id, null: false
      t.string :role, null: false
      t.string :status, default: "pending"
      t.datetime :registered_at, default: -> { "CURRENT_TIMESTAMP" }
      t.datetime :checked_in_at

      t.timestamps
    end

    add_index :hackathon_participants, [:user_id, :hackathon_id], unique: true
    add_index :hackathon_participants, :hackathon_id
    add_index :hackathon_participants, :status
    add_foreign_key :hackathon_participants, :users
    add_foreign_key :hackathon_participants, :hackathons
  end
end
