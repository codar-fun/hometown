class FormsController < ApplicationController
  def show
    @form = Form.includes(:form_fields).find_by!(slug: params[:slug])

    # Check if user has already submitted this form
    existing_submission = logged_in? ? FormSubmission.find_by(form: @form, user: current_user) : nil

    # Allow access if: form is published OR user is admin OR user has already submitted
    unless @form.published? || current_user&.admin? || existing_submission.present?
      return redirect_to root_path, alert: "该表单暂未开放。"
    end

    # If user has already submitted, show their submission
    if existing_submission.present?
      return redirect_to form_submission_path(existing_submission), notice: "你已提交过报名，以下是你的报名详情。"
    end

    # If logged in but form is not published, don't allow new submissions
    if logged_in? && !@form.published?
      return redirect_to root_path, alert: "该表单暂未开放，无法提交新报名。"
    end

    # If logged in and form is published, redirect to submission form
    if logged_in?
      redirect_to new_form_form_submission_path(@form)
    end
    # not logged in — render the landing page
  end
end
