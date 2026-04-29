class SessionsController < ApplicationController
  def destroy
    token = cookies.signed[:session_token]
    if token
      session_record = Session.find_by_token(token)
      session_record&.destroy
    end
    cookies.delete(:session_token)
    redirect_to root_path, notice: "You have been signed out."
  end
end
