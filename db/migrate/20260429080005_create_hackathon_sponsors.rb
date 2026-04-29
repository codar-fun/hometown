class CreateHackathonSponsors < ActiveRecord::Migration[8.1]
  def change
    create_table :hackathon_sponsors, id: :string, force: :cascade do |t|
      t.string :hackathon_id, null: false
      t.string :name, null: false
      t.string :logo_url
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :hackathon_sponsors, [ :hackathon_id, :position ]
    add_foreign_key :hackathon_sponsors, :hackathons
  end
end
