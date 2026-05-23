class MembersController < ApplicationController
  def index
    scope = User.includes(:avatar_attachment).order(created_at: :desc)

    if params[:role].present? && params[:role] != "all"
      scope = scope.where(role: params[:role])
    end
    if params[:city].present? && params[:city] != "all"
      scope = scope.where(city: params[:city])
    end
    if params[:q].present?
      q = "%#{params[:q]}%"
      scope = scope.where("name ILIKE ? OR handle ILIKE ? OR tagline ILIKE ?", q, q, q)
    end

    @following_ids = current_user&.following&.ids&.to_set || Set.new

    @total_count = User.count
    @cities = User.where.not(city: nil).distinct.pluck(:city).sort

    respond_to do |format|
      format.html do
        @pagy, @members = pagy(scope, limit: 50)
      end
      format.csv do
        authorize_admin!
        csv_content = generate_members_csv(scope)
        send_data csv_content, filename: "members_#{Time.current.to_date}.csv", type: "text/csv"
      end
    end
  end

  private

  def send_member_csv(members)
    authorize_admin!
    csv_content = generate_members_csv(members)
    send_data csv_content, filename: "members_#{Time.current.to_date}.csv", type: "text/csv"
  end

  def generate_members_csv(members)
    require "csv"
    CSV.generate(headers: true) do |csv|
      csv << ["姓名", "用户名", "邮箱", "手机", "角色", "城市", "标签", "注册时间"]
      members.each do |m|
        csv << [
          m.name,
          m.handle,
          m.email,
          m.phone,
          m.role,
          m.city,
          m.tagline,
          m.created_at.strftime("%Y-%m-%d %H:%M")
        ]
      end
    end
  end

  def authorize_admin!
    redirect_to members_path, alert: "仅管理员可以导出用户列表" unless current_user&.admin?
  end
end
