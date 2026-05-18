class AddAdminMarkerFieldsToHackathon2026 < ActiveRecord::Migration[8.1]
  def change
    # Add three admin-only checkbox fields to hackathon-2026 form for tracking:
    # - 已签到 (checked_in)
    # - 已退款 (refunded)
    # - 项目已提交 (project_submitted)

    reversible do |dir|
      dir.up do
        form = Form.find_by(slug: "hackathon-2026")
        return unless form

        max_position = form.form_fields.maximum(:position) || 0

        [
          { label: "已签到", position: max_position + 1 },
          { label: "已退款", position: max_position + 2 },
          { label: "项目已提交", position: max_position + 3 }
        ].each do |attrs|
          form.form_fields.create!(
            label: attrs[:label],
            field_type: "checkbox",
            for_admin: true,
            position: attrs[:position],
            options: ["是"],
            required: false
          )
        end
      end

      dir.down do
        form = Form.find_by(slug: "hackathon-2026")
        return unless form
        form.form_fields.where(label: ["已签到", "已退款", "项目已提交"]).delete_all
      end
    end
  end
end
