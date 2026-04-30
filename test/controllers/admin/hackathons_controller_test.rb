require "test_helper"

class Admin::HackathonsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin  = users(:admin)
    @member = users(:member)
    @live   = hackathons(:live_hackathon)
    @draft  = hackathons(:draft_hackathon)
  end

  # ---------------------------------------------------------------------------
  # Helpers
  # ---------------------------------------------------------------------------

  def sign_in(user)
    post identification_path, params: { channel: "email", email: user.email }
    raw_code = OtpService.generate_for(user: user, channel: "email")
    post verification_path, params: { code: raw_code }
    assert_response :redirect, "sign_in helper: verification failed for #{user.email}"
  end

  def valid_params
    {
      name: "New Hackathon",
      slug: "new-hackathon",
      status: "draft",
      review_mode: "manual",
      location_type: "onsite",
      capacity: 200,
      prize_pool: "5000.00",
      currency: "CNY"
    }
  end

  # ---------------------------------------------------------------------------
  # Access control
  # ---------------------------------------------------------------------------

  test "index redirects to login when not authenticated" do
    get admin_hackathons_path
    assert_redirected_to new_identification_path
  end

  test "index denies access to regular member" do
    sign_in @member
    get admin_hackathons_path
    assert_redirected_to root_path
  end

  # ---------------------------------------------------------------------------
  # GET /admin/hackathons
  # ---------------------------------------------------------------------------

  test "index renders for admin" do
    sign_in @admin
    get admin_hackathons_path
    assert_response :success
    assert_select "body"
  end

  # ---------------------------------------------------------------------------
  # GET /admin/hackathons/new
  # ---------------------------------------------------------------------------

  test "new renders form for admin" do
    sign_in @admin
    get new_admin_hackathon_path
    assert_response :success
    assert_select "form"
  end

  # ---------------------------------------------------------------------------
  # POST /admin/hackathons
  # ---------------------------------------------------------------------------

  test "create saves hackathon and redirects for admin" do
    sign_in @admin
    assert_difference "Hackathon.count", 1 do
      post admin_hackathons_path, params: { hackathon: valid_params }
    end
    hackathon = Hackathon.order(:created_at).last
    assert_equal "New Hackathon", hackathon.name
    assert_equal "draft",         hackathon.status
    assert_equal @admin,          hackathon.created_by
    assert_redirected_to edit_admin_hackathon_path(hackathon)
  end

  test "create re-renders new on invalid params" do
    sign_in @admin
    assert_no_difference "Hackathon.count" do
      post admin_hackathons_path, params: { hackathon: valid_params.merge(name: "", slug: "") }
    end
    assert_response :unprocessable_entity
  end

  # ---------------------------------------------------------------------------
  # GET /admin/hackathons/:id/edit
  # ---------------------------------------------------------------------------

  test "edit renders form for admin" do
    sign_in @admin
    get edit_admin_hackathon_path(@draft)
    assert_response :success
    assert_select "form"
  end

  # ---------------------------------------------------------------------------
  # PATCH /admin/hackathons/:id
  # ---------------------------------------------------------------------------

  test "update saves changes and redirects" do
    sign_in @admin
    patch admin_hackathon_path(@draft), params: { hackathon: { name: "Updated Name" } }
    assert_equal "Updated Name", @draft.reload.name
    assert_redirected_to edit_admin_hackathon_path(@draft)
  end

  test "update re-renders edit on invalid params" do
    sign_in @admin
    patch admin_hackathon_path(@draft), params: { hackathon: { name: "" } }
    assert_response :unprocessable_entity
  end

  # ---------------------------------------------------------------------------
  # DELETE /admin/hackathons/:id
  # ---------------------------------------------------------------------------

  test "destroy deletes hackathon and redirects" do
    sign_in @admin
    assert_difference "Hackathon.count", -1 do
      delete admin_hackathon_path(@draft)
    end
    assert_redirected_to admin_hackathons_path
  end

  # ---------------------------------------------------------------------------
  # PATCH /admin/hackathons/:id/publish
  # ---------------------------------------------------------------------------

  test "publish sets status to live" do
    sign_in @admin
    patch publish_admin_hackathon_path(@draft)
    assert_equal "live", @draft.reload.status
    assert_redirected_to edit_admin_hackathon_path(@draft)
  end

  # ---------------------------------------------------------------------------
  # PATCH /admin/hackathons/:id/unpublish
  # ---------------------------------------------------------------------------

  test "unpublish sets status to draft" do
    sign_in @admin
    patch unpublish_admin_hackathon_path(@live)
    assert_equal "draft", @live.reload.status
    assert_redirected_to edit_admin_hackathon_path(@live)
  end
end
