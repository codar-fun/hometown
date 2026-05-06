class HandlesController < ApplicationController
  before_action :require_login

  def new
    redirect_to profile_path(current_user) if current_user.handle.present?
  end

  def create
    if current_user.update(handle: params[:handle].to_s.strip.downcase)
      redirect_to profile_path(current_user), notice: "用户名设置成功！"
    else
      render :new, status: :unprocessable_entity
    end
  end
end
