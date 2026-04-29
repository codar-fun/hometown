class SubmissionProcessor
  attr_reader :errors

  def initialize(form:, user:, params:)
    @form = form
    @user = user
    @params = params
    @errors = []
  end

  def call
    submission = nil
    ActiveRecord::Base.transaction do
      submission = FormSubmission.create!(
        form: @form,
        user: @user,
        submitted_at: Time.current
      )
      @form.form_fields.each do |field|
        value = @params[field.id.to_s]
        answer = FormAnswer.create!(
          form_submission: submission,
          form_field: field,
          value: value.is_a?(Array) ? value.to_json : value.to_s
        )
        if field.field_type == "file" && @params["file_#{field.id}"].present?
          answer.file_attachment.attach(@params["file_#{field.id}"])
        end
      end
    end
    submission
  rescue ActiveRecord::RecordInvalid => e
    @errors << e.message
    nil
  end
end
