desc "Deduplicate user handles: keep earliest user, suffix others with _2, _3, etc."
task dedup_handles: :environment do
  # Group users by handle (case-insensitive), excluding nil handles
  handle_groups = User.where.not(handle: nil)
    .group_by { |u| u.handle.downcase }

  changed = 0
  handle_groups.each do |lower_handle, users|
    next if users.size == 1

    # Sort by created_at to keep earliest unchanged
    users.sort_by(&:created_at).each_with_index do |user, index|
      next if index == 0  # Keep the first (earliest) one

      # Find next available suffix
      suffix = 2
      loop do
        new_handle = "#{lower_handle}_#{suffix}"
        break unless User.where.not(id: user.id).exists?(handle: new_handle)
        suffix += 1
      end

      old_handle = user.handle
      user.update_column(:handle, "#{lower_handle}_#{suffix}")
      puts "✓ #{old_handle} → #{lower_handle}_#{suffix} (user_id: #{user.id})"
      changed += 1
    end
  end

  puts "\nTotal deduplicated: #{changed} handles"
end
