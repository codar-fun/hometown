class AuthMailer < ApplicationMailer
  def verification_code(user, code)
    @user = user
    @code = code
    mail(to: user.email, subject: "Your Hometown verification code")
  end

  def bind_login(user, code, to_address)
    @user = user
    @code = code
    mail(to: to_address, subject: "验证你的联系方式 — Hometown")
  end
end
