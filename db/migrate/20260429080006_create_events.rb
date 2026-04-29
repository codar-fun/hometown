class CreateEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :events, id: :string, force: :cascade do |t|
      t.string :title, null: false
      t.string :kind, null: false
      t.date :date
      t.string :time_label
      t.string :location
      t.string :host_id
      t.text :description
      t.jsonb :tags, default: []
      t.integer :going_count, default: 0
      t.integer :capacity
      t.string :status, null: false, default: "upcoming"
      t.boolean :featured, default: false, null: false
      t.string :color

      t.timestamps
    end

    add_index :events, :status
    add_index :events, :date
    add_index :events, :host_id
    add_index :events, :featured

    add_foreign_key :events, :users, column: :host_id
  end
end
