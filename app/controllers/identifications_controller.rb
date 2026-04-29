class IdentificationsController < ApplicationController
  def new
    redirect_to root_path if logged_in?
  end

  def create
    channel    = params[:channel].presence_in(%w[email sms]) || "email"
    identifier = (channel == "email" ? params[:email] : params[:phone]).to_s.strip

    user = find_or_create_user(identifier, channel)
    if user.nil?
      flash.now[:alert] = channel == "email" ? "请输入有效的邮箱地址" : "请输入有效的手机号"
      return render :new, status: :unprocessable_entity
    end

    raw_code = OtpService.generate_for(user: user, channel: channel)

    if channel == "email"
      SendOtpEmailJob.perform_later(user.id, raw_code)
    else
      SendOtpSmsJob.perform_later(user.id, raw_code)
    end

    session[:pending_user_id] = user.id
    session[:otp_identifier]  = identifier
    session[:otp_channel]     = channel
    redirect_to new_verification_path
  end

  private

  def find_or_create_user(identifier, channel)
    if channel == "email"
      return nil unless identifier.match?(URI::MailTo::EMAIL_REGEXP)
      User.find_or_create_by!(email: identifier.downcase) { |u| u.role = "member" }
    else
      parsed = Phonelib.parse(identifier)
      return nil unless parsed.valid?
      User.find_or_create_by!(phone: parsed.e164) { |u| u.role = "member" }
    end
  rescue ActiveRecord::RecordInvalid
    nil
  end
end
