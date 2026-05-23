require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  def random_email
    "test#{SecureRandom.hex(4)}@example.com"
  end

  setup do
    @user = User.create!(name: "Test User", email: random_email, phone: "1234567890")
    @admin = User.create!(name: "Admin User", email: random_email, phone: "0987654321", role: "admin")
    @team = Team.create!(name: "Test Team", owner: @user)
    @project = Project.create!(
      name: "Test Project",
      tagline: "Test tagline",
      description: "Test description",
      track: ["软件赛道"]
    )
    ProjectTeamMember.create!(project: @project, user: @user, role_label: "队长")
  end

  test "project validates presence of name" do
    project = Project.new(tagline: "Test", description: "Test", track: ["软件赛道"])
    assert_not project.valid?
    assert project.errors[:name].present?
  end

  test "project validates presence of track" do
    project = Project.new(name: "Test", tagline: "Test", description: "Test")
    assert_not project.valid?
    assert project.errors[:track].present?
  end

  test "new project has draft status" do
    project = Project.create!(name: "New Project", tagline: "Test", description: "Test", track: ["软件赛道"])
    assert_equal "draft", project.status
  end

  test "creator? returns true for team member with 队长 role" do
    assert @project.creator?(@user)
  end

  test "creator? returns false for non-creator" do
    other_user = User.create!(name: "Other User", email: random_email, phone: "1111111111")
    assert_not @project.creator?(other_user)
  end

  test "can_submit? returns true for creator with draft status" do
    @project.update(status: "draft", team_id: @team.id)
    assert @project.can_submit?(@user)
  end

  test "can_submit? returns false for non-creator" do
    other_user = User.create!(name: "Other User", email: random_email, phone: "1111111111")
    @project.update(status: "draft", team_id: @team.id)
    assert_not @project.can_submit?(other_user)
  end

  test "can_submit? returns false without team" do
    @project.update(status: "draft", team_id: nil)
    assert_not @project.can_submit?(@user)
  end

  test "can_submit? returns true for rejected status with team" do
    @project.update(status: "rejected", team_id: @team.id)
    assert @project.can_submit?(@user)
  end

  test "can_submit? returns false for submitted status" do
    @project.update(status: "submitted", team_id: @team.id)
    assert_not @project.can_submit?(@user)
  end

  test "submit! changes status to submitted" do
    @project.update(team_id: @team.id)
    @project.submit!
    assert_equal "submitted", @project.status
  end

  test "submit! sets submitted_at timestamp" do
    @project.update(team_id: @team.id)
    @project.submit!
    assert @project.submitted_at.present?
  end

  test "submit! raises error without team" do
    @project.update(team_id: nil)
    assert_raises(ActiveRecord::RecordInvalid) do
      @project.submit!
    end
  end

  test "can_approve? returns true for admin with submitted status" do
    @project.update(status: "submitted")
    assert @project.can_approve?(@admin)
  end

  test "can_approve? returns false for non-admin" do
    @project.update(status: "submitted")
    assert_not @project.can_approve?(@user)
  end

  test "can_approve? returns false for non-submitted status" do
    @project.update(status: "draft")
    assert_not @project.can_approve?(@admin)
  end

  test "can_reject? returns true for admin with submitted status" do
    @project.update(status: "submitted")
    assert @project.can_reject?(@admin)
  end

  test "can_reject? returns false for non-admin" do
    @project.update(status: "submitted")
    assert_not @project.can_reject?(@user)
  end

  test "approve! changes status to approved" do
    @project.update(status: "submitted")
    @project.approve!
    assert_equal "approved", @project.status
  end

  test "reject! changes status to rejected" do
    @project.update(status: "submitted")
    @project.reject!("Test reason")
    assert_equal "rejected", @project.status
  end

  test "reject! sets rejection reason" do
    @project.update(status: "submitted")
    @project.reject!("Test rejection reason")
    assert_equal "Test rejection reason", @project.rejection_reason
  end

  test "approve! clears rejection reason" do
    @project.update(status: "submitted", rejection_reason: "Old reason")
    @project.approve!
    assert_nil @project.rejection_reason
  end
end
