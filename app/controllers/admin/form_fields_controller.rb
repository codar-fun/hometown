class Admin::FormFieldsController < Admin::BaseController
  before_action :set_form

  def create
    @field = @form.form_fields.build(field_params)
    if @field.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to admin_form_path(@form) }
      end
    else
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("field_errors", partial: "admin/form_fields/errors", locals: { field: @field }) }
        format.html { redirect_to admin_form_path(@form), alert: @field.errors.full_messages.to_sentence }
      end
    end
  end

  def update
    @field = @form.form_fields.find(params[:id])
    if @field.update(field_params)
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to admin_form_path(@form) }
      end
    else
      respond_to do |format|
        format.html { redirect_to admin_form_path(@form), alert: @field.errors.full_messages.to_sentence }
      end
    end
  end

  def destroy
    @field = @form.form_fields.find(params[:id])
    @field.destroy
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.remove("form_field_#{@field.id}") }
      format.html { redirect_to admin_form_path(@form) }
    end
  end

  def reorder
    params[:order].each_with_index do |id, index|
      @form.form_fields.where(id: id).update_all(position: index + 1)
    end
    head :ok
  end

  private

  def set_form
    @form = Form.find(params[:form_id])
  end

  def field_params
    params.require(:form_field).permit(:label, :field_type, :required, :position, options: [])
  end
end
