class ProfilesController < ApplicationController
  before_action :require_login, only: [ :edit, :update ]
  before_action :set_user

  def show
    @submissions = @user.form_submissions.includes(:form)
    @hackathons = @user.participated_hackathons.order(created_at: :desc)
    @teams = @user.teams.includes(:owner, :team_members).order(created_at: :desc)
  end

  def edit
    redirect_to profile_path(current_user) unless @user == current_user
  end

  def update
    unless @user == current_user
      redirect_to profile_path(current_user)
      return
    end

    if @user.update(profile_params)
      redirect_to profile_path(@user), notice: "Profile updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def profile_params
    params.require(:user).permit(:name, :handle, :tagline, :bio, :city, :school, :github, :avatar, :avatar_color)
  end
end
