# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_29_074354) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", id: :string, force: :cascade do |t|
    t.string "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :string, force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :string, force: :cascade do |t|
    t.string "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "form_answers", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "form_field_id", null: false
    t.string "form_submission_id", null: false
    t.datetime "updated_at", null: false
    t.text "value"
    t.index ["form_field_id"], name: "index_form_answers_on_form_field_id"
    t.index ["form_submission_id"], name: "index_form_answers_on_form_submission_id"
  end

  create_table "form_fields", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "field_type", null: false
    t.string "form_id", null: false
    t.string "label", null: false
    t.jsonb "options", default: []
    t.integer "position", default: 0, null: false
    t.boolean "required", default: false, null: false
    t.datetime "updated_at", null: false
    t.index ["form_id", "position"], name: "index_form_fields_on_form_id_and_position"
  end

  create_table "form_submissions", id: :string, force: :cascade do |t|
    t.text "admin_note"
    t.datetime "created_at", null: false
    t.string "form_id", null: false
    t.string "status", default: "pending", null: false
    t.datetime "submitted_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["form_id", "status"], name: "index_form_submissions_on_form_id_and_status"
    t.index ["form_id", "user_id"], name: "index_form_submissions_on_form_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_form_submissions_on_user_id"
  end

  create_table "forms", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "created_by_id"
    t.text "description"
    t.boolean "published", default: false, null: false
    t.string "slug", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_forms_on_created_by_id"
    t.index ["slug"], name: "index_forms_on_slug", unique: true
  end

  create_table "sessions", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "ip_address"
    t.datetime "last_active_at"
    t.string "token_digest", null: false
    t.datetime "updated_at", null: false
    t.string "user_agent"
    t.string "user_id", null: false
    t.index ["token_digest"], name: "index_sessions_on_token_digest", unique: true
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", id: :string, force: :cascade do |t|
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "phone"
    t.string "role", default: "member", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["phone"], name: "index_users_on_phone", unique: true
  end

  create_table "verification_codes", id: :string, force: :cascade do |t|
    t.string "channel", null: false
    t.string "code_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "used_at"
    t.string "user_id", null: false
    t.index ["expires_at"], name: "index_verification_codes_on_expires_at"
    t.index ["user_id"], name: "index_verification_codes_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "form_answers", "form_fields"
  add_foreign_key "form_answers", "form_submissions"
  add_foreign_key "form_fields", "forms"
  add_foreign_key "form_submissions", "forms"
  add_foreign_key "form_submissions", "users"
  add_foreign_key "forms", "users", column: "created_by_id"
  add_foreign_key "sessions", "users"
  add_foreign_key "verification_codes", "users"
end
