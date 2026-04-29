class ApplicationStatusMailer < ApplicationMailer
  def approved(form_submission)
    @submission = form_submission
    @user = form_submission.user
    @form = form_submission.form
    mail(to: @user.email, subject: "Congratulations! Your application has been approved")
  end

  def rejected(form_submission)
    @submission = form_submission
    @user = form_submission.user
    @form = form_submission.form
    mail(to: @user.email, subject: "Update on your application")
  end
end
