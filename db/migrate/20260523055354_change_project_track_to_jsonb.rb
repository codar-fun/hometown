class ChangeProjectTrackToJsonb < ActiveRecord::Migration[8.1]
  def up
    # Convert existing track strings to arrays
    add_column :projects, :track_new, :jsonb, default: []

    Project.all.each do |project|
      if project.track.present?
        project.update_column(:track_new, [project.track])
      end
    end

    remove_column :projects, :track
    rename_column :projects, :track_new, :track
    change_column_default :projects, :track, []
  end

  def down
    add_column :projects, :track_old, :string

    Project.all.each do |project|
      if project.track.is_a?(Array) && project.track.any?
        project.update_column(:track_old, project.track.first)
      end
    end

    remove_column :projects, :track
    rename_column :projects, :track_old, :track
  end
end
