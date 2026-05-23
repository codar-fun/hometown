class AddCreatedAtIndexesToHackathonsAndTeams < ActiveRecord::Migration[8.1]
  def change
    add_index :hackathons, :created_at
    add_index :teams, :created_at
  end
end
