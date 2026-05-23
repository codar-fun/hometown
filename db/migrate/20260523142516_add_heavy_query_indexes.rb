class AddHeavyQueryIndexes < ActiveRecord::Migration[8.1]
  def change
    # projects index page: default sort and likes sort
    add_index :projects, :submitted_at
    add_index :projects, :likes_count
    # projects index page: track filter uses jsonb containment (@>), requires GIN
    add_index :projects, :track, using: :gin
    # home page: Form.published runs on every page load
    add_index :forms, :published
    # admin submissions list: ORDER BY submitted_at DESC on large table
    add_index :form_submissions, :submitted_at
    # admin dashboard: 3–4 status count queries per page load
    add_index :form_submissions, :status
  end
end
