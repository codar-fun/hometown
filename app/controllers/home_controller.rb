class HomeController < ApplicationController
  def index
    @forms = Form.published.order(created_at: :desc)
  end
end
