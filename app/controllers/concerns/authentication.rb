module Authentication
  extend ActiveSupport::Concern

  included do
    helper_method :current_user, :logged_in?
  end

  def current_user
    @current_user ||= find_user_from_session_cookie
  end

  def logged_in?
    current_user.present?
  end

  def require_login
    unless logged_in?
      session[:return_to] = request.fullpath
      redirect_to new_identification_path, alert: "Please sign in to continue."
    end
  end

  def require_admin
    unless current_user&.admin?
      redirect_to root_path, alert: "Access denied."
    end
  end

  private

  def find_user_from_session_cookie
    token = cookies.signed[:session_token]
    return nil unless token
    session_record = Session.find_by_token(token)
    return nil unless session_record
    session_record.update_column(:last_active_at, Time.current)
    session_record.user
  end
end
