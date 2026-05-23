class ChangeProjectLinksToText < ActiveRecord::Migration[8.1]
  def change
    change_column :projects, :demo_url, :text
    change_column :projects, :github_url, :text
    change_column :projects, :video_url, :text
  end
end
