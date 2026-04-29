class FormsController < ApplicationController
  def show
    @form = Form.includes(form_fields: []).find_by!(slug: params[:slug])
    unless @form.published? || current_user&.admin?
      redirect_to root_path, alert: "This form is not available."
    end
  end
end
