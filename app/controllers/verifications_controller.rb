class VerificationsController < ApplicationController
  def new
    @pending_user_id = session[:pending_user_id]
    redirect_to new_identification_path unless @pending_user_id
  end

  def create
    user = User.find_by(id: session[:pending_user_id])
    unless user
      redirect_to new_identification_path, alert: "Session expired. Please try again."
      return
    end

    result = OtpService.verify(user: user, raw_code: params[:code].to_s.strip)

    case result
    when :ok
      session.delete(:pending_user_id)
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
      redirect_to return_to || root_path, notice: "Welcome back, #{user.display_name}!"
    when :invalid
      flash.now[:alert] = "Incorrect code. Please try again."
      render :new, status: :unprocessable_entity
    when :not_found
      flash.now[:alert] = "Code expired or not found. Please request a new one."
      render :new, status: :unprocessable_entity
    end
  end
end
