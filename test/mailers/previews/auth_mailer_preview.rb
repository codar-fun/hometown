class AuthMailerPreview < ActionMailer::Preview
  def verification_code
    user = User.first || User.new(email: "preview@example.com", name: "Preview User")
    AuthMailer.verification_code(user, "123456")
  end
end
