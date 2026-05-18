namespace :hackathon do
  desc "Sync registered_count with actual participant counts"
  task sync_counts: :environment do
    Hackathon.find_each do |h|
      old_count = h.registered_count
      h.update_registered_count
      new_count = h.registered_count
      if old_count != new_count
        puts "Updated #{h.name}: #{old_count} → #{new_count}"
      end
    end
    puts "✓ All hackathon counts synced"
  end
end
