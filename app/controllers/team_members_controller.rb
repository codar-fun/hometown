class TeamMembersController < ApplicationController
  before_action :require_login
  before_action :set_team

  def create
    unless @team.owner?(current_user)
      return redirect_to team_path(@team), alert: "只有团队创建者才能添加成员"
    end

    user = User.find_by(handle: params[:handle]) ||
           User.find_by(email: params[:handle]) ||
           User.find_by(id: params[:handle])

    if user.nil?
      return redirect_to team_path(@team), alert: "找不到该用户"
    end

    if @team.member?(user)
      return redirect_to team_path(@team), alert: "该用户已是团队成员"
    end

    @team.team_members.create!(user: user, joined_at: Time.current)
    redirect_to team_path(@team), notice: "#{user.display_name} 已加入团队"
  end

  def destroy
    @team_member = @team.team_members.find(params[:id])
    target_user = @team_member.user

    unless @team.owner?(current_user) || target_user == current_user
      return redirect_to team_path(@team), alert: "无权操作"
    end

    if @team.owner?(target_user)
      return redirect_to team_path(@team), alert: "创建者不能被移除"
    end

    @team_member.destroy
    if target_user == current_user
      redirect_to teams_path, notice: "已退出团队"
    else
      redirect_to team_path(@team), notice: "#{target_user.display_name} 已被移出团队"
    end
  end

  private

  def set_team
    @team = Team.find_by!(slug: params[:team_id])
  end
end
