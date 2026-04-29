class CreateFormFields < ActiveRecord::Migration[8.1]
  def change
    create_table :form_fields, id: :string, force: :cascade do |t|
      t.string :form_id, null: false
      t.string :label, null: false
      t.string :field_type, null: false
      t.boolean :required, null: false, default: false
      t.integer :position, null: false, default: 0
      t.jsonb :options, default: []

      t.timestamps
    end

    add_index :form_fields, [ :form_id, :position ]
    add_foreign_key :form_fields, :forms
  end
end
