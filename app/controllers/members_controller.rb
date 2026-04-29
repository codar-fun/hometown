class MembersController < ApplicationController
  def index
    @members = User.all.order(created_at: :desc)

    if params[:role].present? && params[:role] != "all"
      @members = @members.where(role: params[:role])
    end
    if params[:city].present? && params[:city] != "all"
      @members = @members.where(city: params[:city])
    end
    if params[:q].present?
      q = "%#{params[:q]}%"
      @members = @members.where("name ILIKE ? OR handle ILIKE ? OR tagline ILIKE ?", q, q, q)
    end

    @total_count = User.count
    @cities = User.where.not(city: nil).distinct.pluck(:city).sort
  end
end
