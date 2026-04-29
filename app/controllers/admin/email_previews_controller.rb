class Admin::EmailPreviewsController < Admin::BaseController
  def show
    @approved_submission = FormSubmission.approved.includes(:user, :form).last
    @form = Form.order(created_at: :desc).first
  end
end
