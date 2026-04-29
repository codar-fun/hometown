class CreateHackathonTracks < ActiveRecord::Migration[8.1]
  def change
    create_table :hackathon_tracks, id: :string, force: :cascade do |t|
      t.string :hackathon_id, null: false
      t.string :label, null: false
      t.string :color
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :hackathon_tracks, [ :hackathon_id, :position ]
    add_foreign_key :hackathon_tracks, :hackathons
  end
end
