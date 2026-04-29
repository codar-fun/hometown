class Admin::DashboardController < Admin::BaseController
  def index
    @forms_count = Form.count
    @submissions_count = FormSubmission.count
    @pending_count = FormSubmission.pending.count
    @users_count = User.count
  end
end
