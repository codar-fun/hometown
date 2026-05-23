require "test_helper"

class TeamTest < ActiveSupport::TestCase
  def random_email
    "test#{SecureRandom.hex(4)}@example.com"
  end

  setup do
    @user = User.create!(name: "Test User", email: random_email, phone: "1234567890")
    @team = Team.create!(name: "Test Team", slug: "test-team", owner: @user)
  end

  test "team validates presence of name" do
    team = Team.new(slug: "test")
    assert_not team.valid?
    assert team.errors[:name].present?
  end

  test "team generates slug if blank on create" do
    team = Team.create!(name: "Test Team", owner: @user)
    assert team.slug.present?
    assert_not_empty team.slug
  end

  test "team slug must be unique" do
    team = Team.new(name: "Another Team", slug: "test-team", owner: @user)
    assert_not team.valid?
    assert team.errors[:slug].present?
  end

  test "team slug format validation" do
    team = Team.new(name: "Test", slug: "Test Team!", owner: @user)
    assert_not team.valid?
    assert team.errors[:slug].present?
  end

  test "team slug must be 2-30 characters" do
    team = Team.new(name: "Test", slug: "a", owner: @user)
    assert_not team.valid?

    team = Team.new(name: "Test", slug: "a" * 31, owner: @user)
    assert_not team.valid?
  end

  test "team generates slug from name on create with empty slug" do
    team = Team.create!(name: "My Awesome Team", owner: @user)
    assert team.slug.start_with?("my-awesome-team")
  end

  test "team adds numeric suffix to duplicate auto-generated slugs" do
    team1 = Team.create!(name: "Test Auto", owner: @user)
    base_slug = team1.slug

    team2 = Team.create!(name: "Test Auto", owner: @user)
    assert team2.slug.start_with?(base_slug)
    assert team2.slug != base_slug
  end

  test "team to_param returns slug" do
    assert_equal @team.slug, @team.to_param
  end

  test "owner? returns true for team owner" do
    assert @team.owner?(@user)
  end

  test "owner? returns false for non-owner" do
    other_user = User.create!(name: "Other", email: random_email, phone: "0000000000")
    assert_not @team.owner?(other_user)
  end

  test "member? returns true for team member" do
    assert @team.member?(@user)
  end

  test "member? returns false for non-member" do
    other_user = User.create!(name: "Other", email: random_email, phone: "0000000000")
    assert_not @team.member?(other_user)
  end

  test "create adds owner as team member" do
    team = Team.create!(name: "New Team", owner: @user)
    assert team.member?(@user)
  end

  test "team validates name length" do
    team = Team.new(name: "a" * 61, slug: "test", owner: @user)
    assert_not team.valid?
    assert team.errors[:name].present?
  end

  test "team can have multiple members" do
    user2 = User.create!(name: "User 2", email: random_email, phone: "2222222222")
    user3 = User.create!(name: "User 3", email: random_email, phone: "3333333333")

    TeamMember.create!(team: @team, user: user2)
    TeamMember.create!(team: @team, user: user3)

    assert_equal 3, @team.team_members.count
  end
end
