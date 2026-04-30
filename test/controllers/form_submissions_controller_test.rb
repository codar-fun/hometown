require "test_helper"

class FormSubmissionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @form   = forms(:hackathon_form)
    @member = users(:member)
    @other  = users(:other_member)
    @admin  = users(:admin)
  end

  # ---------------------------------------------------------------------------
  # Helpers
  # ---------------------------------------------------------------------------

  # Drive the real OTP login flow so Rails sets cookies through its own machinery.
  def sign_in(user)
    # Trigger identification to set session[:pending_user_id]
    post identification_path, params: { channel: "email", email: user.email }

    # Generate a fresh code (overwrites any previous) and submit it
    raw_code = OtpService.generate_for(user: user, channel: "email")
    post verification_path, params: { code: raw_code }

    assert_response :redirect, "sign_in helper: verification failed for #{user.email}"
  end

  def valid_params
    {
      "field_name_001"   => "张三",
      "field_intro_002"  => "我是一名热爱开发的工程师，擅长 Rails 和 React。",
      "field_github_003" => "zhangsan"
    }
  end

  # ---------------------------------------------------------------------------
  # GET /forms/:form_slug/form_submissions/new
  # ---------------------------------------------------------------------------

  test "new redirects to login when not authenticated" do
    get new_form_form_submission_path(@form)
    assert_redirected_to new_identification_path
  end

  test "new renders form for logged-in user" do
    sign_in @other
    get new_form_form_submission_path(@form)
    assert_response :success
    assert_select "form"
  end

  test "new redirects to existing submission when already submitted" do
    sign_in @member
    get new_form_form_submission_path(@form)
    assert_redirected_to form_submission_path(form_submissions(:existing_submission))
  end

  test "new returns 404 for unknown form slug" do
    sign_in @other
    get new_form_form_submission_path("no-such-form")
    assert_response :not_found
  end

  # ---------------------------------------------------------------------------
  # POST /forms/:form_slug/form_submissions
  # ---------------------------------------------------------------------------

  test "create redirects to login when not authenticated" do
    post form_form_submissions_path(@form), params: valid_params
    assert_redirected_to new_identification_path
  end

  test "create saves submission and answers for first-time submitter" do
    sign_in @other
    assert_difference -> { FormSubmission.count } => 1,
                      -> { FormAnswer.count } => 3 do
      post form_form_submissions_path(@form), params: valid_params
    end
    submission = FormSubmission.order(:created_at).last
    assert_equal @form,    submission.form
    assert_equal @other,   submission.user
    assert_equal "pending", submission.status
    assert_redirected_to form_submission_path(submission)
  end

  test "create stores answer values correctly" do
    sign_in @other
    post form_form_submissions_path(@form), params: valid_params
    submission = FormSubmission.order(:created_at).last
    name_answer = submission.form_answers.find_by(form_field: form_fields(:name_field))
    assert_equal "张三", name_answer.value
  end

  test "create rejects duplicate submission" do
    sign_in @member  # already has existing_submission fixture
    assert_no_difference "FormSubmission.count" do
      post form_form_submissions_path(@form), params: valid_params
    end
    assert_response :unprocessable_entity
  end

  test "create stores empty string for omitted optional fields" do
    sign_in @other
    post form_form_submissions_path(@form), params: valid_params.except("field_github_003")
    submission = FormSubmission.order(:created_at).last
    github_answer = submission.form_answers.find_by(form_field: form_fields(:github_field))
    assert_equal "", github_answer.value
  end

  # ---------------------------------------------------------------------------
  # GET /form_submissions/:id
  # ---------------------------------------------------------------------------

  test "show redirects to login when not authenticated" do
    get form_submission_path(form_submissions(:existing_submission))
    assert_redirected_to new_identification_path
  end

  test "show renders submission for its owner" do
    sign_in @member
    get form_submission_path(form_submissions(:existing_submission))
    assert_response :success
  end

  test "show denies access to another member" do
    sign_in @other
    get form_submission_path(form_submissions(:existing_submission))
    assert_redirected_to root_path
  end

  test "show allows admin to view any submission" do
    sign_in @admin
    get form_submission_path(form_submissions(:existing_submission))
    assert_response :success
  end
end
