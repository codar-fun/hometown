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

ActiveRecord::Schema[8.1].define(version: 2026_05_18_174955) do
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

  create_table "event_attendees", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "event_id", null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["event_id", "user_id"], name: "index_event_attendees_on_event_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_event_attendees_on_user_id"
  end

  create_table "events", id: :string, force: :cascade do |t|
    t.integer "capacity"
    t.string "color"
    t.datetime "created_at", null: false
    t.date "date"
    t.text "description"
    t.boolean "featured", default: false, null: false
    t.integer "going_count", default: 0
    t.string "host_id"
    t.string "kind", null: false
    t.string "location"
    t.string "status", default: "upcoming", null: false
    t.jsonb "tags", default: []
    t.string "time_label"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["date"], name: "index_events_on_date"
    t.index ["featured"], name: "index_events_on_featured"
    t.index ["host_id"], name: "index_events_on_host_id"
    t.index ["status"], name: "index_events_on_status"
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
    t.boolean "for_admin", default: false
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
    t.boolean "starred", default: false, null: false
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
    t.text "submission_message"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_forms_on_created_by_id"
    t.index ["slug"], name: "index_forms_on_slug", unique: true
  end

  create_table "hackathon_participants", id: :string, force: :cascade do |t|
    t.datetime "checked_in_at"
    t.datetime "created_at", null: false
    t.string "hackathon_id", null: false
    t.datetime "registered_at", default: -> { "CURRENT_TIMESTAMP" }
    t.string "role", null: false
    t.string "status", default: "pending"
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["hackathon_id"], name: "index_hackathon_participants_on_hackathon_id"
    t.index ["status"], name: "index_hackathon_participants_on_status"
    t.index ["user_id", "hackathon_id"], name: "index_hackathon_participants_on_user_id_and_hackathon_id", unique: true
  end

  create_table "hackathon_sponsors", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "hackathon_id", null: false
    t.string "logo_url"
    t.string "name", null: false
    t.integer "position", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["hackathon_id", "position"], name: "index_hackathon_sponsors_on_hackathon_id_and_position"
  end

  create_table "hackathon_tracks", id: :string, force: :cascade do |t|
    t.string "color"
    t.datetime "created_at", null: false
    t.string "hackathon_id", null: false
    t.string "label", null: false
    t.integer "position", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["hackathon_id", "position"], name: "index_hackathon_tracks_on_hackathon_id_and_position"
  end

  create_table "hackathons", id: :string, force: :cascade do |t|
    t.integer "approved_count", default: 0
    t.integer "capacity", default: 0
    t.string "cover_color"
    t.string "cover_pattern"
    t.datetime "created_at", null: false
    t.string "created_by_id"
    t.string "currency", default: "CNY"
    t.text "description"
    t.date "end_date"
    t.boolean "featured", default: false, null: false
    t.string "form_id"
    t.string "location"
    t.string "location_type", default: "onsite"
    t.string "name", null: false
    t.decimal "prize_pool", precision: 12, scale: 2, default: "0.0"
    t.datetime "reg_deadline"
    t.integer "registered_count", default: 0
    t.string "review_mode", default: "manual"
    t.string "slug", null: false
    t.date "start_date"
    t.string "status", default: "draft", null: false
    t.datetime "submit_deadline"
    t.string "tagline"
    t.string "theme"
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_hackathons_on_created_by_id"
    t.index ["form_id"], name: "index_hackathons_on_form_id"
    t.index ["slug"], name: "index_hackathons_on_slug", unique: true
    t.index ["status"], name: "index_hackathons_on_status"
  end

  create_table "project_comments", id: :string, force: :cascade do |t|
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.string "project_id", null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["project_id", "created_at"], name: "index_project_comments_on_project_id_and_created_at"
    t.index ["user_id"], name: "index_project_comments_on_user_id"
  end

  create_table "project_likes", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "project_id", null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["project_id", "user_id"], name: "index_project_likes_on_project_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_project_likes_on_user_id"
  end

  create_table "project_team_members", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "project_id", null: false
    t.string "role_label"
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["project_id", "user_id"], name: "index_project_team_members_on_project_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_project_team_members_on_user_id"
  end

  create_table "projects", id: :string, force: :cascade do |t|
    t.string "cover_color"
    t.string "cover_pattern"
    t.datetime "created_at", null: false
    t.string "demo_url"
    t.text "description"
    t.string "github_url"
    t.string "hackathon_id"
    t.integer "likes_count", default: 0
    t.string "name", null: false
    t.jsonb "seeking", default: []
    t.datetime "submitted_at"
    t.string "tagline"
    t.string "team_id"
    t.jsonb "tech", default: []
    t.string "track"
    t.datetime "updated_at", null: false
    t.string "video_url"
    t.string "winner"
    t.index ["hackathon_id"], name: "index_projects_on_hackathon_id"
    t.index ["track"], name: "index_projects_on_track"
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

  create_table "team_members", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "joined_at"
    t.string "team_id", null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["team_id", "user_id"], name: "index_team_members_on_team_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_team_members_on_user_id"
  end

  create_table "teams", id: :string, force: :cascade do |t|
    t.string "avatar_color"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name", null: false
    t.string "owner_id", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_teams_on_owner_id"
    t.index ["slug"], name: "index_teams_on_slug", unique: true
  end

  create_table "user_follows", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "follower_id", null: false
    t.string "following_id", null: false
    t.datetime "updated_at", null: false
    t.index ["follower_id", "following_id"], name: "index_user_follows_on_follower_id_and_following_id", unique: true
    t.index ["following_id"], name: "index_user_follows_on_following_id"
  end

  create_table "users", id: :string, force: :cascade do |t|
    t.string "avatar_color"
    t.text "bio"
    t.string "city"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "github"
    t.string "handle"
    t.string "name"
    t.string "phone"
    t.string "role", default: "member", null: false
    t.string "school"
    t.jsonb "skills", default: []
    t.string "tagline"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["handle"], name: "index_users_on_handle", unique: true
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
  add_foreign_key "event_attendees", "events"
  add_foreign_key "event_attendees", "users"
  add_foreign_key "events", "users", column: "host_id"
  add_foreign_key "form_answers", "form_fields"
  add_foreign_key "form_answers", "form_submissions"
  add_foreign_key "form_fields", "forms"
  add_foreign_key "form_submissions", "forms"
  add_foreign_key "form_submissions", "users"
  add_foreign_key "forms", "users", column: "created_by_id"
  add_foreign_key "hackathon_participants", "hackathons"
  add_foreign_key "hackathon_participants", "users"
  add_foreign_key "hackathon_sponsors", "hackathons"
  add_foreign_key "hackathon_tracks", "hackathons"
  add_foreign_key "hackathons", "forms"
  add_foreign_key "hackathons", "users", column: "created_by_id"
  add_foreign_key "project_comments", "projects"
  add_foreign_key "project_comments", "users"
  add_foreign_key "project_likes", "projects"
  add_foreign_key "project_likes", "users"
  add_foreign_key "project_team_members", "projects"
  add_foreign_key "project_team_members", "users"
  add_foreign_key "projects", "hackathons"
  add_foreign_key "sessions", "users"
  add_foreign_key "team_members", "teams"
  add_foreign_key "team_members", "users"
  add_foreign_key "teams", "users", column: "owner_id"
  add_foreign_key "user_follows", "users", column: "follower_id"
  add_foreign_key "user_follows", "users", column: "following_id"
  add_foreign_key "verification_codes", "users"
end
