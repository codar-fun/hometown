class CreateVerificationCodes < ActiveRecord::Migration[8.1]
  def change
    create_table :verification_codes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :channel, null: false
      t.string :code_digest, null: false
      t.datetime :expires_at, null: false
      t.datetime :used_at

      t.timestamps
    end

    add_index :verification_codes, :expires_at
  end
end
