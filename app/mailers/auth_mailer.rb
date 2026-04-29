class AuthMailer < ApplicationMailer
  def verification_code(user, code)
    @user = user
    @code = code
    mail(to: user.email, subject: "Your Hometown verification code")
  end
end
