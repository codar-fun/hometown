class ApplicationStatusMailer < ApplicationMailer
  def approved(form_submission)
    @submission = form_submission
    @user = form_submission.user
    @form = form_submission.form

    if @form.submission_image.attached?
      attachments.inline[@form.submission_image.filename.to_s] = @form.submission_image.download
    end

    mail(to: form_submission.recipient_email, subject: "恭喜！你的报名已被批准 — #{@form.title}")
  end

  def rejected(form_submission)
    @submission = form_submission
    @user = form_submission.user
    @form = form_submission.form
    mail(to: @user.email, subject: "Update on your application")
  end
end
