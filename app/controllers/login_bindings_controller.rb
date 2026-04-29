class LoginBindingsController < ApplicationController
  before_action :require_login

  def new
    @type = params[:type].presence_in(%w[email phone]) || "email"
  end

  def create
    type  = params[:type].presence_in(%w[email phone]) || "email"
    value = params[:value].to_s.strip

    error = validate_contact(type, value)
    return redirect_to new_login_binding_path(type: type), alert: error if error

    value = normalized_phone(value) if type == "phone"

    code    = OtpService.generate_for(user: current_user, channel: type == "email" ? "email" : "sms")
    channel = type == "email" ? "邮箱" : "手机号"

    if type == "email"
      AuthMailer.bind_login(current_user, code, value).deliver_later
    else
      SmsService.send_otp(phone: value, code: code)
    end

    session[:pending_bind_type]  = type
    session[:pending_bind_value] = value

    redirect_to verify_login_bindings_path, notice: "验证码已发送至 #{channel} #{value}"
  end

  def verify
    @type  = session[:pending_bind_type]
    @value = session[:pending_bind_value]

    unless @type.present? && @value.present?
      return redirect_to edit_profile_path(current_user), alert: "会话已过期，请重新操作。"
    end

    return render :verify if request.get?

    code   = params[:code].to_s.gsub(/\D/, "")
    result = OtpService.verify(user: current_user, raw_code: code)

    case result
    when :ok
      attr = @type == "email" ? { email: @value } : { phone: @value }
      current_user.update!(attr)
      session.delete(:pending_bind_type)
      session.delete(:pending_bind_value)
      redirect_to edit_profile_path(current_user),
        notice: "#{@type == 'email' ? '邮箱' : '手机号'}绑定成功。"
    when :not_found
      @error = "验证码不存在或已过期，请重新获取。"
      render :verify, status: :unprocessable_entity
    else
      @error = "验证码错误，请重试。"
      render :verify, status: :unprocessable_entity
    end
  end

  private

  def validate_contact(type, value)
    return "请输入#{type == 'email' ? '邮箱' : '手机号'}" if value.blank?

    if type == "email"
      return "邮箱格式不正确" unless value.match?(URI::MailTo::EMAIL_REGEXP)
      return "该邮箱已被其他账号使用" if User.where("lower(email) = ?", value.downcase).where.not(id: current_user.id).exists?
    else
      e164 = normalized_phone(value)
      return "手机号格式不正确" unless Phonelib.valid?(e164)
      return "该手机号已被其他账号使用" if User.where(phone: e164).where.not(id: current_user.id).exists?
    end

    nil
  end

  def normalized_phone(value)
    parsed = Phonelib.parse(value)
    parsed.e164.presence || value
  end
end
