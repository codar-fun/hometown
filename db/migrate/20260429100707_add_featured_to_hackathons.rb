class AddFeaturedToHackathons < ActiveRecord::Migration[8.1]
  def change
    add_column :hackathons, :featured, :boolean, default: false, null: false
  end
end
