class AddForAdminToFormFields < ActiveRecord::Migration[8.1]
  def change
    add_column :form_fields, :for_admin, :boolean, default: false
  end
end
