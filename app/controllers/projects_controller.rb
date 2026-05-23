class ProjectsController < ApplicationController
  before_action :require_login, only: [ :new, :create, :edit, :update, :submit, :approve, :reject, :star ]
  before_action :set_project, only: [ :show, :edit, :update, :submit, :approve, :reject ]
  before_action :require_creator, only: [ :edit, :update ]
  before_action :require_creator_for_submit, only: [ :submit ]
  before_action :require_admin, only: [ :approve, :reject ]

  def index
    @projects = Project.all.includes(:project_team_members, :hackathon)
    if params[:track].present?
      @projects = @projects.where("track @> ?", [params[:track]].to_json)
    end
    @projects = case params[:sort]
    when "likes" then @projects.by_likes
    else              @projects.by_newest
    end
    @tracks = []
    Project.pluck(:track).each do |tracks|
      @tracks.concat(Array(tracks))
    end
    @tracks = @tracks.uniq.compact.sort
  end

  def show
    @project = @project.includes(:project_team_members, :project_comments)
    @comments = @project.project_comments.includes(:user).order(:created_at)
    @liked = logged_in? && current_user.project_likes.exists?(project: @project)
    @is_creator = @project.creator?(current_user)
  end

  def new
    @project = Project.new
    @hackathons = Hackathon.where(status: %w[live reviewing]).order(start_date: :desc)
    @teams = logged_in? ? current_user.teams.order(:name) : []
  end

  def create
    @project = Project.new(project_params)

    if @project.save
      @project.project_team_members.create!(user: current_user, role_label: "队长")
      redirect_to project_path(@project), notice: "项目草稿已创建，请准备好后提交"
    else
      @hackathons = Hackathon.where(status: %w[live reviewing]).order(start_date: :desc)
      @teams = current_user.teams.order(:name)
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @hackathons = Hackathon.where(status: %w[live reviewing]).order(start_date: :desc)
  end

  def update
    if @project.update(project_params)
      redirect_to project_path(@project), notice: "项目已更新"
    else
      @hackathons = Hackathon.where(status: %w[live reviewing]).order(start_date: :desc)
      render :edit, status: :unprocessable_entity
    end
  end

  def submit
    if @project.can_submit?(current_user)
      @project.submit!
      redirect_to project_path(@project), notice: "项目已提交"
    else
      redirect_to project_path(@project), alert: "无法提交项目"
    end
  end

  def approve
    if @project.can_approve?(current_user)
      @project.approve!
      redirect_to project_path(@project), notice: "项目已批准"
    else
      redirect_to project_path(@project), alert: "无法批准项目"
    end
  end

  def reject
    if @project.can_reject?(current_user)
      reason = params[:rejection_reason].presence
      @project.reject!(reason)
      redirect_to project_path(@project), notice: "项目已拒绝"
    else
      redirect_to project_path(@project), alert: "无法拒绝项目"
    end
  end

  def star
    @project = Project.find(params[:id])
    like = current_user.project_likes.find_by(project: @project)
    if like
      like.destroy
    else
      current_user.project_likes.create!(project: @project)
    end
    redirect_to project_path(@project)
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def require_creator
    redirect_to project_path(@project), alert: "只有项目创建者才能编辑" unless @project.creator?(current_user)
  end

  def require_creator_for_submit
    redirect_to project_path(@project), alert: "只有项目创建者才能提交" unless @project.creator?(current_user)
  end

  def require_admin
    redirect_to project_path(@project), alert: "只有管理员才能审批项目" unless current_user&.admin?
  end

  def project_params
    params.require(:project).permit(:name, :tagline, :hackathon_id, :team_id,
      :cover_color, :cover_pattern, :description, :demo_url, :github_url,
      :video_url, tech: [], seeking: [], track: [])
  end
end
