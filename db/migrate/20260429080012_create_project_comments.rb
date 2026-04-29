class CreateProjectComments < ActiveRecord::Migration[8.1]
  def change
    create_table :project_comments, id: :string, force: :cascade do |t|
      t.string :project_id, null: false
      t.string :user_id, null: false
      t.text :body, null: false

      t.timestamps
    end

    add_index :project_comments, [ :project_id, :created_at ]
    add_index :project_comments, :user_id

    add_foreign_key :project_comments, :projects
    add_foreign_key :project_comments, :users
  end
end
