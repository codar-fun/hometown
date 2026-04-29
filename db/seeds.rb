admin = User.find_or_create_by!(email: "admin@hometown.dev") do |u|
  u.name = "Admin"
  u.role = "admin"
end
puts "Admin user: #{admin.email}"

hackathon = Form.find_or_create_by!(slug: "hackathon-2026") do |f|
  f.title = "Hackathon 2026 Registration"
  f.description = "Join us for our annual hackathon! Apply below to secure your spot."
  f.published = true
  f.created_by = admin
end
puts "Hackathon form: #{hackathon.slug}"

unless hackathon.form_fields.exists?
  [
    { label: "Full Name", field_type: "text", required: true, position: 1 },
    { label: "Team Name", field_type: "text", required: false, position: 2 },
    { label: "Project Idea", field_type: "textarea", required: true, position: 3 },
    {
      label: "Your Skills",
      field_type: "checkbox",
      required: false,
      position: 4,
      options: [
        { "label" => "Frontend", "value" => "frontend" },
        { "label" => "Backend",  "value" => "backend" },
        { "label" => "Design",   "value" => "design" },
        { "label" => "ML/AI",    "value" => "ml_ai" },
        { "label" => "DevOps",   "value" => "devops" }
      ]
    },
    {
      label: "T-Shirt Size",
      field_type: "dropdown",
      required: true,
      position: 5,
      options: [
        { "label" => "XS", "value" => "xs" },
        { "label" => "S",  "value" => "s" },
        { "label" => "M",  "value" => "m" },
        { "label" => "L",  "value" => "l" },
        { "label" => "XL", "value" => "xl" }
      ]
    },
    { label: "Portfolio / GitHub URL", field_type: "text", required: false, position: 6 }
  ].each do |attrs|
    hackathon.form_fields.create!(attrs)
  end
  puts "Created #{hackathon.form_fields.count} fields for hackathon form"
end
