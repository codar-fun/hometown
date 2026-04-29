class CreateProjectLikes < ActiveRecord::Migration[8.1]
  def change
    create_table :project_likes, id: :string, force: :cascade do |t|
      t.string :project_id, null: false
      t.string :user_id, null: false

      t.timestamps
    end

    add_index :project_likes, [ :project_id, :user_id ], unique: true
    add_index :project_likes, :user_id

    add_foreign_key :project_likes, :projects
    add_foreign_key :project_likes, :users
  end
end
