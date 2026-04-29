class FormsController < ApplicationController
  def show
    @form = Form.includes(:form_fields).find_by!(slug: params[:slug])
    unless @form.published? || current_user&.admin?
      return redirect_to root_path, alert: "该表单暂未开放。"
    end

    if logged_in?
      existing = FormSubmission.find_by(form: @form, user: current_user)
      return redirect_to form_submission_path(existing), notice: "你已提交过报名，以下是你的报名详情。" if existing
      redirect_to new_form_form_submission_path(@form)
    end
    # not logged in — render the landing page
  end
end
