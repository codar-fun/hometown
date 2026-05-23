require "test_helper"

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  def random_email
    "test#{SecureRandom.hex(4)}@example.com"
  end

  setup do
    @user = User.create!(name: "Test User", email: random_email, phone: "1234567890")
    @admin = User.create!(name: "Admin User", email: random_email, phone: "0987654321", role: "admin")
    @other_user = User.create!(name: "Other User", email: random_email, phone: "1111111111")
    @team = Team.create!(name: "Test Team", owner: @user)

    @project = Project.create!(
      name: "Test Project",
      tagline: "Test tagline",
      description: "Test description",
      track: ["软件赛道"],
      status: "draft",
      team_id: @team.id
    )
    ProjectTeamMember.create!(project: @project, user: @user, role_label: "队长")
  end

  test "submit action requires login" do
    post submit_project_url(@project)
    assert_redirected_to new_identification_path
  end

  test "creator can submit draft project with team" do
    sign_in @user
    post submit_project_url(@project)
    assert_redirected_to project_path(@project)
    assert_match "项目已提交", flash[:notice]
    @project.reload
    assert_equal "submitted", @project.status
    assert @project.submitted_at.present?
  end

  test "creator cannot submit without team" do
    @project.update(team_id: nil)
    sign_in @user
    post submit_project_url(@project)
    assert_redirected_to edit_project_path(@project)
    assert_match "提交项目必须选择一个团队", flash[:alert]
  end

  test "non-creator cannot submit project" do
    sign_in @other_user
    post submit_project_url(@project)
    assert_redirected_to project_path(@project)
    assert_match "只有项目创建者才能提交", flash[:alert]
    @project.reload
    assert_equal "draft", @project.status
  end

  test "approve action requires login" do
    @project.update(status: "submitted")
    post approve_project_url(@project)
    assert_redirected_to new_identification_path
  end

  test "admin can approve submitted project" do
    @project.update(status: "submitted")
    sign_in @admin
    post approve_project_url(@project)
    assert_redirected_to project_path(@project)
    assert_match "项目已批准", flash[:notice]
    @project.reload
    assert_equal "approved", @project.status
  end

  test "non-admin cannot approve project" do
    @project.update(status: "submitted")
    sign_in @user
    post approve_project_url(@project)
    assert_redirected_to project_path(@project)
    assert_match "只有管理员才能审批项目", flash[:alert]
    @project.reload
    assert_equal "submitted", @project.status
  end

  test "reject action requires login" do
    @project.update(status: "submitted")
    post reject_project_url(@project)
    assert_redirected_to new_identification_path
  end

  test "admin can reject submitted project" do
    @project.update(status: "submitted")
    sign_in @admin
    post reject_project_url(@project), params: { rejection_reason: "Not suitable" }
    assert_redirected_to project_path(@project)
    assert_match "项目已拒绝", flash[:notice]
    @project.reload
    assert_equal "rejected", @project.status
    assert_equal "Not suitable", @project.rejection_reason
  end

  test "non-admin cannot reject project" do
    @project.update(status: "submitted")
    sign_in @user
    post reject_project_url(@project)
    assert_redirected_to project_path(@project)
    assert_match "只有管理员才能审批项目", flash[:alert]
    @project.reload
    assert_equal "submitted", @project.status
  end

  test "show page displays submitted_at" do
    @project.update(status: "submitted", submitted_at: Time.current)
    get project_path(@project)
    assert_response :success
    assert_select "div", /提交于/
  end

  test "show page displays rejection reason" do
    @project.update(status: "rejected", rejection_reason: "Does not meet requirements")
    get project_path(@project)
    assert_response :success
    assert_select "div", /拒绝原因/
    assert_select "div", /Does not meet requirements/
  end

  test "edit page displays status" do
    sign_in @user
    get edit_project_path(@project)
    assert_response :success
    assert_select "span", /草稿/
  end

  test "creator can edit submitted project" do
    @project.update(status: "submitted")
    sign_in @user
    get edit_project_path(@project)
    assert_response :success
  end

  private

  def sign_in(user)
    post identification_path, params: { channel: "email", email: user.email }
    raw_code = OtpService.generate_for(user: user, channel: "email")
    post verification_path, params: { code: raw_code }
  end
end
