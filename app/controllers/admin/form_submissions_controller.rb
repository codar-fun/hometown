class Admin::FormSubmissionsController < Admin::BaseController
  before_action :set_form
  before_action :set_submission, only: [ :show, :approve, :reject ]

  def index
    scope = @form.form_submissions.includes(:user)
    scope = scope.where(status: params[:status]) if params[:status].present?
    @pagy, @submissions = pagy(scope.order(created_at: :desc), limit: 20)
  end

  def show
    @answers = @submission.form_answers.includes(:form_field, :file_attachment_attachment)
  end

  def approve
    note = params[:admin_note]
    @submission.approve!(note: note)
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("submission_status_#{@submission.id}",
            partial: "admin/form_submissions/status_badge",
            locals: { submission: @submission }),
          turbo_stream.replace("submission_actions_#{@submission.id}",
            partial: "admin/form_submissions/actions",
            locals: { submission: @submission, form: @form })
        ]
      end
      format.html { redirect_to admin_form_form_submission_path(@form, @submission), notice: "Application approved." }
    end
  end

  def reject
    note = params[:admin_note]
    @submission.reject!(note: note)
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("submission_status_#{@submission.id}",
            partial: "admin/form_submissions/status_badge",
            locals: { submission: @submission }),
          turbo_stream.replace("submission_actions_#{@submission.id}",
            partial: "admin/form_submissions/actions",
            locals: { submission: @submission, form: @form })
        ]
      end
      format.html { redirect_to admin_form_form_submission_path(@form, @submission), notice: "Application rejected." }
    end
  end

  private

  def set_form
    @form = Form.find(params[:form_id])
  end

  def set_submission
    @submission = @form.form_submissions.find(params[:id])
  end
end
