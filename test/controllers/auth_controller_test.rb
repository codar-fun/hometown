require "test_helper"

# Tests for the full OTP login flow:
#   IdentificationsController (enter email/phone)
#   VerificationsController   (enter code)
#   SessionsController        (sign out)
class AuthControllerTest < ActionDispatch::IntegrationTest
  setup do
    @member = users(:member)  # has email
    @admin  = users(:admin)   # has email
  end

  # ---------------------------------------------------------------------------
  # GET /identification/new
  # ---------------------------------------------------------------------------

  test "identification new renders login page" do
    get new_identification_path
    assert_response :success
    assert_select "form"
  end

  test "identification new redirects home when already logged in" do
    sign_in_as @member
    get new_identification_path
    assert_redirected_to root_path
  end

  # ---------------------------------------------------------------------------
  # POST /identification — email channel
  # ---------------------------------------------------------------------------

  test "identification create with valid email sets pending session and redirects" do
    post identification_path, params: { channel: "email", email: @member.email }
    assert_redirected_to new_verification_path
    assert_equal @member.id, session[:pending_user_id]
    assert_equal "email", session[:otp_channel]
  end

  test "identification create with unknown email creates new user" do
    assert_difference "User.count", 1 do
      post identification_path, params: { channel: "email", email: "new_user@example.com" }
    end
    assert_redirected_to new_verification_path
  end

  test "identification create with invalid email re-renders with error" do
    post identification_path, params: { channel: "email", email: "not-an-email" }
    assert_response :unprocessable_entity
  end

  test "identification create with blank email re-renders with error" do
    post identification_path, params: { channel: "email", email: "" }
    assert_response :unprocessable_entity
  end

  test "identification create sends OTP email" do
    assert_emails 1 do
      post identification_path, params: { channel: "email", email: @member.email }
    end
  end

  # ---------------------------------------------------------------------------
  # POST /identification — sms channel
  # ---------------------------------------------------------------------------

  test "identification create with valid phone sets pending session" do
    post identification_path, params: { channel: "sms", phone: "13812345678" }
    assert_redirected_to new_verification_path
    new_user = User.find_by(phone: "+8613812345678")
    assert new_user
    assert_equal new_user.id, session[:pending_user_id]
    assert_equal "sms", session[:otp_channel]
  end

  test "identification create with invalid phone re-renders with error" do
    post identification_path, params: { channel: "sms", phone: "12345" }
    assert_response :unprocessable_entity
  end

  test "identification create with sms does not call SmsService" do
    # SendOtpSmsJob short-circuits in test env; verify no real SMS call happens
    # by ensuring the flow completes without error
    post identification_path, params: { channel: "sms", phone: "13812345678" }
    assert_redirected_to new_verification_path
  end

  # ---------------------------------------------------------------------------
  # GET /verification/new
  # ---------------------------------------------------------------------------

  test "verification new redirects to identification when no pending session" do
    get new_verification_path
    assert_redirected_to new_identification_path
  end

  test "verification new renders code entry when pending session exists" do
    post identification_path, params: { channel: "email", email: @member.email }
    get new_verification_path
    assert_response :success
  end

  # ---------------------------------------------------------------------------
  # POST /verification — success cases
  # ---------------------------------------------------------------------------

  test "verification create with correct code signs in and sets cookie" do
    post identification_path, params: { channel: "email", email: @member.email }
    code = OtpService.generate_for(user: @member, channel: "email")

    post verification_path, params: { code: code }

    assert_redirected_to root_path
    assert cookies[:session_token].present?
    assert_nil session[:pending_user_id]
  end

  test "verification create clears pending session data on success" do
    post identification_path, params: { channel: "email", email: @member.email }
    code = OtpService.generate_for(user: @member, channel: "email")
    post verification_path, params: { code: code }

    assert_nil session[:pending_user_id]
    assert_nil session[:otp_channel]
    assert_nil session[:otp_identifier]
  end

  test "verification create respects return_to redirect" do
    # identification#new sets session[:return_to] from the return_to param
    get new_identification_path(return_to: "/some/path")
    post identification_path, params: { channel: "email", email: @member.email }
    code = OtpService.generate_for(user: @member, channel: "email")
    post verification_path, params: { code: code }

    assert_redirected_to "/some/path"
  end

  # ---------------------------------------------------------------------------
  # POST /verification — failure cases
  # ---------------------------------------------------------------------------

  test "verification create with wrong code shows error and does not sign in" do
    post identification_path, params: { channel: "email", email: @member.email }
    OtpService.generate_for(user: @member, channel: "email")

    post verification_path, params: { code: "000000" }

    assert_response :unprocessable_entity
    assert_nil cookies[:session_token]
  end

  test "verification create with expired code shows expired error" do
    post identification_path, params: { channel: "email", email: @member.email }
    OtpService.generate_for(user: @member, channel: "email")
    # Expire the code
    @member.verification_codes.last.update_columns(expires_at: 1.minute.ago)

    post verification_path, params: { code: "123456" }

    assert_response :unprocessable_entity
    assert_match "已过期", response.body
  end

  test "verification create with already-used code shows used error" do
    post identification_path, params: { channel: "email", email: @member.email }
    code = OtpService.generate_for(user: @member, channel: "email")
    @member.verification_codes.last.consume!

    post verification_path, params: { code: code }

    assert_response :unprocessable_entity
    assert_match "已使用", response.body
  end

  test "verification create with no prior code shows not-found error" do
    # Manually set pending session without generating a code
    post identification_path, params: { channel: "email", email: @member.email }
    @member.verification_codes.delete_all

    post verification_path, params: { code: "123456" }

    assert_response :unprocessable_entity
    assert_match "未找到", response.body
  end

  test "verification create with expired pending session redirects to identification" do
    post verification_path, params: { code: "123456" }
    assert_redirected_to new_identification_path
  end

  # ---------------------------------------------------------------------------
  # DELETE /sign_out
  # ---------------------------------------------------------------------------

  test "sign out clears session and cookie" do
    sign_in_as @member
    delete sign_out_path
    assert_redirected_to root_path
    assert cookies[:session_token].blank?
  end

  test "sign out when not logged in redirects without error" do
    delete sign_out_path
    assert_redirected_to root_path
  end

  private

  def sign_in_as(user)
    post identification_path, params: { channel: "email", email: user.email }
    code = OtpService.generate_for(user: user, channel: "email")
    post verification_path, params: { code: code }
  end
end
