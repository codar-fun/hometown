class ApplicationMailer < ActionMailer::Base
  default from: "Hometown <notify@app.sola.day>"
  layout "mailer"
end
