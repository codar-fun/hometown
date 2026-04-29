class IdentificationsController < ApplicationController
  def new
    redirect_to root_path if logged_in?
  end

  def create
    identifier = params[:identifier].to_s.strip
    channel    = identifier.include?("@") ? "email" : "sms"

    user = find_or_create_user(identifier, channel)
    if user.nil?
      flash.now[:alert] = "Invalid email or phone number."
      return render :new, status: :unprocessable_entity
    end

    raw_code = OtpService.generate_for(user: user, channel: channel)

    if channel == "email"
      SendOtpEmailJob.perform_later(user.id, raw_code)
    else
      SendOtpSmsJob.perform_later(user.id, raw_code)
    end

    session[:pending_user_id] = user.id
    redirect_to new_verification_path, notice: "We sent a verification code to #{identifier}."
  end

  private

  def find_or_create_user(identifier, channel)
    if channel == "email"
      return nil unless identifier.match?(URI::MailTo::EMAIL_REGEXP)
      User.find_or_create_by!(email: identifier.downcase) { |u| u.role = "member" }
    else
      parsed = Phonelib.parse(identifier)
      return nil unless parsed.valid?
      e164 = parsed.e164
      User.find_or_create_by!(phone: e164) { |u| u.role = "member" }
    end
  rescue ActiveRecord::RecordInvalid
    nil
  end
end
