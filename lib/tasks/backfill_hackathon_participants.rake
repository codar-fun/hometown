namespace :hackathon do
  desc "Backfill hackathon_participants from form_submissions"
  task backfill_participants: :environment do
    form = Form.find_by(slug: "hackathon-2026")
    raise "Hackathon form not found" unless form

    hackathon = Hackathon.find_by(form_id: form.id)
    raise "Hackathon not found" unless hackathon

    # Find the "参与方式" field
    role_field = form.form_fields.find_by(label: "参与方式")
    raise "参与方式 field not found" unless role_field

    count = 0
    FormSubmission.where(form: form).find_each do |submission|
      # Find the answer for the role field
      answer = submission.form_answers.find_by(form_field: role_field)
      role = answer&.value || "参赛者"  # default to "参赛者"

      # Create or update hackathon_participant
      participant = HackathonParticipant.find_or_create_by(
        user_id: submission.user_id,
        hackathon_id: hackathon.id
      ) do |p|
        p.role = role
        p.status = submission.status == "approved" ? "approved" : "pending"
        p.registered_at = submission.submitted_at
      end

      # Update if it already exists (shouldn't happen with find_or_create_by)
      if participant.saved_change_to_id?
        count += 1
        puts "Created: #{submission.user.display_name} - #{role}"
      end
    end

    puts "\nBackfill complete! Created #{count} new participants."
    puts "Total participants for #{hackathon.name}: #{hackathon.participants.count}"
  end
end
