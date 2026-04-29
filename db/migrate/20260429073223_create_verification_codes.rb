class CreateVerificationCodes < ActiveRecord::Migration[8.1]
  def change
    create_table :verification_codes, id: :string, force: :cascade do |t|
      t.string :user_id, null: false
      t.string :channel, null: false
      t.string :code_digest, null: false
      t.datetime :expires_at, null: false
      t.datetime :used_at

      t.timestamps
    end

    add_index :verification_codes, :user_id
    add_index :verification_codes, :expires_at
    add_foreign_key :verification_codes, :users
  end
end
