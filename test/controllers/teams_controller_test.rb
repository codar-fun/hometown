require "test_helper"

class TeamsControllerTest < ActionDispatch::IntegrationTest
  def random_email
    "test#{SecureRandom.hex(4)}@example.com"
  end

  setup do
    @user = User.create!(name: "Test User", email: random_email, phone: "1234567890")
    @other_user = User.create!(name: "Other User", email: random_email, phone: "0987654321")
    @team = Team.create!(name: "Test Team", slug: "test-team", owner: @user)
  end

  test "index page displays teams" do
    get teams_url
    assert_response :success
    assert_select "h1", /创建团队|成员广场|团队/i
  end

  test "show page displays team info" do
    get team_path(@team)
    assert_response :success
    assert_select "h1", /Test Team/
  end

  test "new page requires login" do
    get new_team_path
    assert_redirected_to new_identification_path
  end

  test "new page displays form" do
    sign_in @user
    get new_team_path
    assert_response :success
    assert_select "input[name='team[name]']"
    assert_select "input[name='team[slug]']"
  end

  test "new page generates default slug" do
    sign_in @user
    get new_team_path
    assert_response :success
    assert_select "input[name='team[slug]'][value*='team-']"
  end

  test "create requires login" do
    post teams_url, params: { team: { name: "New Team", slug: "new-team" } }
    assert_redirected_to new_identification_path
  end

  test "user can create team" do
    sign_in @user
    post teams_url, params: { team: { name: "New Team", slug: "new-team", description: "Test" } }
    assert_redirected_to team_path(Team.last)
    assert_match "团队已创建", flash[:notice]
  end

  test "create with auto-generated slug" do
    sign_in @user
    post teams_url, params: { team: { name: "Auto Team", slug: "", description: "Test" } }
    assert_redirected_to team_path(Team.last)
    assert Team.last.slug.start_with?("auto-team")
  end

  test "edit page requires login" do
    get edit_team_path(@team)
    assert_redirected_to new_identification_path
  end

  test "only owner can edit team" do
    sign_in @other_user
    get edit_team_path(@team)
    assert_redirected_to team_path(@team)
    assert_match "只有团队创建者才能编辑", flash[:alert]
  end

  test "owner can edit team" do
    sign_in @user
    get edit_team_path(@team)
    assert_response :success
    assert_select "input[value='Test Team']"
  end

  test "owner can update team" do
    sign_in @user
    patch team_path(@team), params: { team: { name: "Updated Team", description: "New description" } }
    assert_redirected_to team_path(@team)
    assert_match "团队信息已更新", flash[:notice]
    @team.reload
    assert_equal "Updated Team", @team.name
  end

  test "update requires owner" do
    sign_in @other_user
    patch team_path(@team), params: { team: { name: "Hacked" } }
    assert_redirected_to team_path(@team)
    assert_match "只有团队创建者才能编辑", flash[:alert]
    @team.reload
    assert_equal "Test Team", @team.name
  end

  test "destroy requires login" do
    delete team_path(@team)
    assert_redirected_to new_identification_path
  end

  test "only owner can delete team" do
    sign_in @other_user
    delete team_path(@team)
    assert_redirected_to team_path(@team)
    assert_match "只有团队创建者才能编辑", flash[:alert]
    assert Team.exists?(@team.id)
  end

  test "owner can delete team" do
    sign_in @user
    assert_difference("Team.count", -1) do
      delete team_path(@team)
    end
    assert_redirected_to teams_path
    assert_match "团队已删除", flash[:notice]
  end

  test "create with invalid slug format" do
    sign_in @user
    post teams_url, params: { team: { name: "Invalid Team", slug: "Invalid Team!", description: "Test" } }
    assert_response :unprocessable_entity
    assert_select "div.flash"
  end

  test "edit page displays delete button" do
    sign_in @user
    get edit_team_path(@team)
    assert_response :success
    assert_select "button", /删除团队/
  end

  private

  def sign_in(user)
    post identification_path, params: { channel: "email", email: user.email }
    raw_code = OtpService.generate_for(user: user, channel: "email")
    post verification_path, params: { code: raw_code }
  end
end
