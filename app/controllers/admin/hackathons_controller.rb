class Admin::HackathonsController < Admin::BaseController
  before_action :set_hackathon, only: [ :show, :edit, :update, :destroy, :publish, :unpublish ]

  def index
    @hackathons = Hackathon.includes(:created_by, :hackathon_tracks, :hackathon_sponsors)
                           .order(updated_at: :desc)
    @stats = {
      live:  @hackathons.count { |h| h.status == "live" },
      draft: @hackathons.count { |h| h.status == "draft" },
      ended: @hackathons.count { |h| h.status == "ended" },
      total_registered: @hackathons.sum(&:registered_count),
    }
  end

  def show
    redirect_to edit_admin_hackathon_path(@hackathon)
  end

  def new
    @hackathon = Hackathon.new(status: "draft", currency: "CNY", review_mode: "manual",
                               location_type: "onsite", capacity: 100)
  end

  def create
    @hackathon = Hackathon.new(hackathon_params)
    @hackathon.created_by = current_user
    if @hackathon.save
      redirect_to edit_admin_hackathon_path(@hackathon), notice: "黑客松已创建"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @forms = Form.order(created_at: :desc)
  end

  def update
    if @hackathon.update(hackathon_params)
      redirect_to edit_admin_hackathon_path(@hackathon), notice: "已保存"
    else
      @forms = Form.order(created_at: :desc)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @hackathon.destroy
    redirect_to admin_hackathons_path, notice: "已删除"
  end

  def publish
    @hackathon.update!(status: "live")
    redirect_to edit_admin_hackathon_path(@hackathon), notice: "已发布"
  end

  def unpublish
    @hackathon.update!(status: "draft")
    redirect_to edit_admin_hackathon_path(@hackathon), notice: "已下线"
  end

  private

  def set_hackathon
    @hackathon = Hackathon.find(params[:id])
  end

  def hackathon_params
    params.require(:hackathon).permit(
      :name, :slug, :status, :theme, :tagline, :description,
      :start_date, :end_date, :submit_deadline, :reg_deadline,
      :location, :location_type, :capacity, :prize_pool, :currency,
      :cover_color, :cover_pattern, :review_mode, :form_id
    )
  end
end
