class CreateTeamMembers < ActiveRecord::Migration[8.1]
  def change
    create_table :team_members, id: :string do |t|
      t.string   :team_id, null: false
      t.string   :user_id, null: false
      t.datetime :joined_at

      t.timestamps
    end
    add_index :team_members, [ :team_id, :user_id ], unique: true
    add_index :team_members, :user_id
    add_foreign_key :team_members, :teams
    add_foreign_key :team_members, :users
  end
end
