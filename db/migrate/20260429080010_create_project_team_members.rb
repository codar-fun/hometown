class CreateProjectTeamMembers < ActiveRecord::Migration[8.1]
  def change
    create_table :project_team_members, id: :string, force: :cascade do |t|
      t.string :project_id, null: false
      t.string :user_id, null: false
      t.string :role_label

      t.timestamps
    end

    add_index :project_team_members, [ :project_id, :user_id ], unique: true
    add_index :project_team_members, :user_id

    add_foreign_key :project_team_members, :projects
    add_foreign_key :project_team_members, :users
  end
end
