class Admin::FormSubmissionsController < Admin::BaseController
  before_action :set_submission, only: [ :show, :approve, :reject, :star, :resend_approval_email ]

  def index
    scope = FormSubmission.includes(:user, :form)
    scope = scope.where(status: params[:status]) if params[:status].present? && params[:status] != "all"
    if params[:q].present?
      q = "%#{params[:q]}%"
      scope = scope.joins(:user).where("users.name ILIKE ? OR users.email ILIKE ?", q, q)
    end
    @pagy, @submissions = pagy(scope.order(submitted_at: :desc), limit: 50)
    @counts = {
      all:      FormSubmission.count,
      pending:  FormSubmission.pending.count,
      approved: FormSubmission.approved.count,
      rejected: FormSubmission.rejected.count,
    }
    @selected = @submissions.first if params[:id].blank?
    @selected = FormSubmission.find(params[:id]) if params[:id].present?
  end

  def show
    @answers = @submission.form_answers.includes(:form_field)
  end

  def approve
    @submission.approve!(note: params[:admin_note])
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("submission_#{@submission.id}",
            partial: "admin/form_submissions/submission_row",
            locals: { submission: @submission }),
          turbo_stream.update("detail_panel",
            partial: "admin/form_submissions/detail",
            locals: { submission: @submission })
        ]
      end
      format.html { redirect_to admin_form_submissions_path, notice: "已批准 · 通知邮件已发送" }
    end
  end

  def reject
    @submission.reject!(note: params[:admin_note])
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("submission_#{@submission.id}",
            partial: "admin/form_submissions/submission_row",
            locals: { submission: @submission }),
          turbo_stream.update("detail_panel",
            partial: "admin/form_submissions/detail",
            locals: { submission: @submission })
        ]
      end
      format.html { redirect_to admin_form_submissions_path, notice: "已拒绝" }
    end
  end

  def resend_approval_email
    unless @submission.status == "approved"
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.update("flash", html: '<p class="alert">只能对已批准的报名重发邮件。</p>') }
        format.html { redirect_to admin_form_submissions_path, alert: "只能对已批准的报名重发邮件。" }
      end
      return
    end
    ApplicationStatusMailer.approved(@submission).deliver_later
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update("detail_panel",
          partial: "admin/form_submissions/detail",
          locals: { submission: @submission, notice: "确认邮件已重新发送给 #{@submission.user.display_name}。" })
      end
      format.html { redirect_to admin_form_submissions_path(id: @submission.id), notice: "确认邮件已重新发送给 #{@submission.user.display_name}。" }
    end
  end

  def star
    @submission.update!(starred: !@submission.starred)
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("submission_#{@submission.id}",
            partial: "admin/form_submissions/submission_row",
            locals: { submission: @submission }),
          turbo_stream.update("detail_panel",
            partial: "admin/form_submissions/detail",
            locals: { submission: @submission })
        ]
      end
      format.html { redirect_to admin_form_submissions_path }
    end
  end

  private

  def set_submission
    @submission = FormSubmission.find(params[:id])
  end
end
