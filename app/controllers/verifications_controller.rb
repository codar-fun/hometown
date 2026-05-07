class VerificationsController < ApplicationController
  def new
    redirect_to new_identification_path unless session[:pending_user_id]
  end

  def create
    user = User.find_by(id: session[:pending_user_id])
    unless user
      redirect_to new_identification_path, alert: "会话已过期，请重新发送验证码。"
      return
    end

    # Accept either a single `code` param (hidden field filled by JS) or
    # individual digit params `digit_0`..`digit_5` as fallback.
    code = if params[:code].present?
      params[:code].to_s.gsub(/\D/, "")
    else
      6.times.map { |i| params["digit_#{i}"].to_s }.join
    end

    result = OtpService.verify(user: user, raw_code: code)

    case result
    when :ok
      session.delete(:pending_user_id)
      session.delete(:otp_identifier)
      session.delete(:otp_channel)
      session_record = Session.create!(
        user: user,
        user_agent: request.user_agent,
        ip_address: request.remote_ip
      )
      cookies.signed[:session_token] = {
        value: session_record.raw_token,
        httponly: true,
        same_site: :lax,
        expires: 30.days.from_now
      }
      return_to = session.delete(:return_to)

      # Check if handle setup is required (controlled by ENFORCE_HANDLE_SETUP env var)
      enforce_handle = ENV.fetch("ENFORCE_HANDLE_SETUP", "false").downcase == "true"

      if enforce_handle && user.handle.blank?
        session[:return_to] = return_to
        redirect_to new_handle_path, notice: "请先设置用户名"
      else
        redirect_to return_to || root_path, notice: "欢迎回来，#{user.display_name}！"
      end
    when :invalid
      flash.now[:alert] = "验证码错误，请重试。"
      render :new, status: :unprocessable_entity
    when :expired
      flash.now[:alert] = "验证码已过期，请重新发送。"
      render :new, status: :unprocessable_entity
    when :used
      flash.now[:alert] = "验证码已使用，请重新发送。"
      render :new, status: :unprocessable_entity
    when :not_found
      flash.now[:alert] = "未找到验证码，请先发送。"
      render :new, status: :unprocessable_entity
    end
  end
end
