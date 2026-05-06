class Admin::FormsController < Admin::BaseController
  before_action :set_form, only: [ :show, :edit, :update, :destroy, :publish, :unpublish ]

  def index
    scope = Form.includes(:created_by)
    scope = scope.where("title ILIKE ?", "%#{params[:q]}%") if params[:q].present?
    scope = case params[:status]
            when "live"   then scope.where(published: true)
            when "draft"  then scope.where(published: false)
            else scope
            end
    @forms = scope.order(created_at: :desc)
    all_forms = Form.all
    @counts = {
      all:    all_forms.count,
      live:   all_forms.where(published: true).count,
      draft:  all_forms.where(published: false).count,
      closed: 0,
    }
  end

  def show
    @pagy, @submissions = pagy(@form.form_submissions.includes(:user).order(created_at: :desc), limit: 20)
  end

  def new
    @form = Form.new
    @form.form_fields.build
  end

  def create
    @form = Form.new(form_params.except(:form_fields_attributes))
    @form.created_by = current_user

    if @form.save
      build_fields(form_params[:form_fields_attributes])
      redirect_to admin_form_path(@form), notice: "Form created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @form.update(form_params.except(:form_fields_attributes))
      build_fields(form_params[:form_fields_attributes])
      redirect_to admin_form_path(@form), notice: "Form updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @form.destroy
    redirect_to admin_forms_path, notice: "Form deleted."
  end

  def publish
    @form.publish!
    redirect_back fallback_location: admin_form_path(@form), notice: "Form published."
  end

  def unpublish
    @form.unpublish!
    redirect_back fallback_location: admin_form_path(@form), notice: "Form unpublished."
  end

  private

  def set_form
    @form = Form.find_by!(slug: params[:id])
  end

  def form_params
    params.require(:form).permit(:title, :slug, :description, :submission_message, :published,
      form_fields_attributes: [ :id, :label, :field_type, :required, :position, :_destroy, options: [] ])
  end

  def build_fields(fields_attrs)
    return unless fields_attrs.present?
    fields_attrs.each_value do |attrs|
      next if attrs[:label].blank?
      if attrs[:id].present?
        field = @form.form_fields.find(attrs[:id])
        if attrs[:_destroy] == "1"
          field.destroy
        else
          field.update(attrs.except(:id, :_destroy))
        end
      else
        @form.form_fields.create(attrs.except(:id, :_destroy))
      end
    end
  end
end
