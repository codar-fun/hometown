class FormSubmissionsController < ApplicationController
  before_action :require_login
  before_action :set_form, only: [ :new, :create ]

  def new
    @existing = FormSubmission.find_by(form: @form, user: current_user)
    if @existing
      redirect_to form_submission_path(@existing), notice: "You have already submitted this form."
    end
  end

  def create
    processor = SubmissionProcessor.new(
      form: @form,
      user: current_user,
      params: submission_answer_params
    )
    @submission = processor.call

    if @submission
      redirect_to form_submission_path(@submission), notice: "Application submitted successfully!"
    else
      flash.now[:alert] = processor.errors.join(", ")
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @submission = FormSubmission.includes(form_answers: [ :form_field, :file_attachment_attachment ]).find(params[:id])
    unless @submission.user == current_user || current_user&.admin?
      redirect_to root_path, alert: "Access denied."
    end
  end

  private

  def set_form
    @form = Form.find_by!(slug: params[:form_slug])
  end

  def submission_answer_params
    params.permit!.to_h.slice(*@form.form_fields.map { |f| f.id.to_s },
                               *@form.form_fields.select { |f| f.field_type == "file" }.map { |f| "file_#{f.id}" })
  end
end
