class ProjectsController < ApplicationController
  before_action :require_login, only: [ :new, :create ]

  def index
    @projects = Project.all.includes(:project_team_members, :hackathon)
    @projects = @projects.where(track: params[:track]) if params[:track].present?
    @projects = case params[:sort]
    when "likes" then @projects.by_likes
    else              @projects.by_newest
    end
    @tracks = Project.distinct.pluck(:track).compact
  end

  def show
    @project = Project.includes(:project_team_members, :project_comments).find(params[:id])
    @comments = @project.project_comments.includes(:user).order(:created_at)
    @liked = logged_in? && current_user.project_likes.exists?(project: @project)
  end

  def new
    @project = Project.new
    @hackathons = Hackathon.where(status: %w[live reviewing]).order(start_date: :desc)
  end

  def create
    @project = Project.new(project_params)
    @project.submitted_at = Time.current

    if @project.save
      @project.project_team_members.create!(user: current_user, role_label: "队长")
      redirect_to project_path(@project), notice: "项目已提交"
    else
      @hackathons = Hackathon.where(status: %w[live reviewing]).order(start_date: :desc)
      render :new, status: :unprocessable_entity
    end
  end

  private

  def project_params
    params.require(:project).permit(:name, :tagline, :hackathon_id, :track,
      :cover_color, :cover_pattern, :description, :demo_url, :github_url,
      :video_url, tech: [], seeking: [])
  end
end
