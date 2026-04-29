class CreateHackathons < ActiveRecord::Migration[8.1]
  def change
    create_table :hackathons, id: :string, force: :cascade do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :status, null: false, default: "draft"
      t.string :theme
      t.string :tagline
      t.text :description
      t.date :start_date
      t.date :end_date
      t.datetime :submit_deadline
      t.datetime :reg_deadline
      t.string :location
      t.string :location_type, default: "onsite"
      t.integer :capacity, default: 0
      t.integer :registered_count, default: 0
      t.integer :approved_count, default: 0
      t.decimal :prize_pool, precision: 12, scale: 2, default: 0
      t.string :currency, default: "CNY"
      t.string :cover_color
      t.string :cover_pattern
      t.string :review_mode, default: "manual"
      t.string :form_id
      t.string :created_by_id

      t.timestamps
    end

    add_index :hackathons, :slug, unique: true
    add_index :hackathons, :status
    add_index :hackathons, :form_id
    add_index :hackathons, :created_by_id

    add_foreign_key :hackathons, :forms, column: :form_id
    add_foreign_key :hackathons, :users, column: :created_by_id
  end
end
