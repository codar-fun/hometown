class FormSubmissionsController < ApplicationController
  before_action :require_login
  before_action :set_form, only: [ :new, :create ]
  before_action :set_submission, only: [ :show, :edit, :update ]

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
  end

  def edit
    unless @submission.status == "pending"
      redirect_to form_submission_path(@submission), alert: "只有审核中的报名才可以修改。"
    end
  end

  def update
    unless @submission.status == "pending"
      redirect_to form_submission_path(@submission), alert: "只有审核中的报名才可以修改。"
      return
    end

    answer_params = params.permit!.to_h.slice(
      *@submission.form.form_fields.map { |f| f.id.to_s },
      *@submission.form.form_fields.select { |f| f.field_type == "file" }.map { |f| "file_#{f.id}" }
    )

    ActiveRecord::Base.transaction do
      @submission.form.form_fields.each do |field|
        answer = @submission.form_answers.find_by!(form_field: field)
        value  = answer_params[field.id.to_s]
        answer.update!(value: value.is_a?(Array) ? value.to_json : value.to_s)
        if field.field_type == "file" && answer_params["file_#{field.id}"].present?
          answer.file_attachment.attach(answer_params["file_#{field.id}"])
        end
      end
      @submission.touch
    end

    redirect_to form_submission_path(@submission), notice: "报名信息已更新。"
  rescue ActiveRecord::RecordInvalid => e
    flash.now[:alert] = e.message
    render :edit, status: :unprocessable_entity
  end

  private

  def set_submission
    @submission = FormSubmission.includes(form: :form_fields, form_answers: [ :form_field, :file_attachment_attachment ]).find(params[:id])
    unless @submission.user == current_user || current_user&.admin?
      redirect_to root_path, alert: "Access denied."
    end
  end

  def set_form
    @form = Form.find_by!(slug: params[:form_slug])
  end

  def submission_answer_params
    params.permit!.to_h.slice(*@form.form_fields.map { |f| f.id.to_s },
                               *@form.form_fields.select { |f| f.field_type == "file" }.map { |f| "file_#{f.id}" })
  end
end
