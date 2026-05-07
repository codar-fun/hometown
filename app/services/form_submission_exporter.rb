require "csv"

class FormSubmissionExporter
  def self.call(submissions)
    new(submissions).export
  end

  def initialize(submissions)
    @submissions = submissions
  end

  def export
    form = @submissions.first&.form
    return "" unless form

    CSV.generate(encoding: "UTF-8") do |csv|
      csv << build_headers(form)

      @submissions.each do |submission|
        csv << build_row(submission, form)
      end
    end
  end

  private

  def build_headers(form)
    headers = [
      "申请者名称",
      "申请者邮箱",
      "申请状态",
      "星标",
      "提交时间",
      "管理员备注"
    ]

    form.form_fields.each do |field|
      headers << field.label
    end

    headers
  end

  def build_row(submission, form)
    row = [
      submission.user.name,
      submission.user.email,
      submission.status,
      submission.starred? ? "是" : "否",
      submission.submitted_at&.strftime("%Y-%m-%d %H:%M:%S") || "",
      submission.admin_note || ""
    ]

    answers_map = submission.form_answers.index_by(&:form_field_id)

    form.form_fields.each do |field|
      answer = answers_map[field.id]
      row << format_answer(answer, field)
    end

    row
  end

  def format_answer(answer, field)
    return "" unless answer

    case field.field_type
    when "checkbox", "file"
      if field.field_type == "checkbox"
        value = parse_json_value(answer.value)
        value.is_a?(Array) ? value.join(", ") : value.to_s
      else
        answer.file_attachment.attached? ? answer.file_attachment.filename.to_s : ""
      end
    else
      answer.value.to_s
    end
  end

  def parse_json_value(value)
    return value unless value.is_a?(String)
    JSON.parse(value) rescue value
  end
end
