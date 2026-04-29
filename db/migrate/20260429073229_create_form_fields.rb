class CreateFormFields < ActiveRecord::Migration[8.1]
  def change
    create_table :form_fields do |t|
      t.references :form, null: false, foreign_key: true
      t.string :label, null: false
      t.string :field_type, null: false
      t.boolean :required, null: false, default: false
      t.integer :position, null: false, default: 0
      t.jsonb :options, default: []

      t.timestamps
    end

    add_index :form_fields, [ :form_id, :position ]
  end
end
