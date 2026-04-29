class CreateEventAttendees < ActiveRecord::Migration[8.1]
  def change
    create_table :event_attendees, id: :string, force: :cascade do |t|
      t.string :event_id, null: false
      t.string :user_id, null: false

      t.timestamps
    end

    add_index :event_attendees, [ :event_id, :user_id ], unique: true
    add_index :event_attendees, :user_id

    add_foreign_key :event_attendees, :events
    add_foreign_key :event_attendees, :users
  end
end
