class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects, id: :string, force: :cascade do |t|
      t.string :name, null: false
      t.string :tagline
      t.string :hackathon_id
      t.string :track
      t.string :cover_color
      t.string :cover_pattern
      t.text :description
      t.jsonb :tech, default: []
      t.jsonb :seeking, default: []
      t.string :demo_url
      t.string :github_url
      t.string :video_url
      t.integer :likes_count, default: 0
      t.string :winner
      t.datetime :submitted_at

      t.timestamps
    end

    add_index :projects, :hackathon_id
    add_index :projects, :track

    add_foreign_key :projects, :hackathons
  end
end
