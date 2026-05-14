class Admin::EmailPreviewsController < Admin::BaseController
  def show
    hackathon = Hackathon.find_by!(slug: "hackathon-2026")
    @form = hackathon.form
    @submission = FormSubmission.approved.where(form: @form).includes(:user, :form, :form_answers).first
    @hackathon = hackathon
  end
end
