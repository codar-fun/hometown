class AddStatusToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :status, :string, default: "draft", null: false
    add_column :projects, :rejection_reason, :text
    add_column :projects, :status_updated_at, :datetime
  end
end
