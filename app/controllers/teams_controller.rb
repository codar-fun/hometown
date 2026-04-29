class TeamsController < ApplicationController
  before_action :require_login, except: [ :index, :show ]
  before_action :set_team, only: [ :show, :edit, :update ]
  before_action :require_owner, only: [ :edit, :update ]

  def index
    @teams = Team.includes(:owner, :team_members).order(created_at: :desc)
  end

  def show
    @team_members = @team.team_members.includes(:user).order(:joined_at)
    @is_owner = @team.owner?(current_user)
    @is_member = @team.member?(current_user)
  end

  def new
    @team = Team.new
  end

  def create
    @team = Team.new(team_params)
    @team.owner = current_user

    if @team.save
      redirect_to team_path(@team), notice: "团队已创建"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @team.update(team_params)
      redirect_to team_path(@team), notice: "团队信息已更新"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_team
    @team = Team.find_by!(slug: params[:id])
  end

  def require_owner
    redirect_to team_path(@team), alert: "只有团队创建者才能编辑" unless @team.owner?(current_user)
  end

  def team_params
    params.require(:team).permit(:name, :slug, :description, :avatar_color)
  end
end
