class SemiOauthController < ApplicationController
  SEMI_FRONTEND = "https://www.semi.im"
  SEMI_BACKEND  = "https://api.semi.im"

  def login
    verifier  = SecureRandom.base64(32).tr("+/", "-_").delete("=")
    challenge = Base64.urlsafe_encode64(Digest::SHA256.digest(verifier), padding: false)
    state     = SecureRandom.hex(16)

    session[:semi_code_verifier] = verifier
    session[:semi_oauth_state]   = state

    query = {
      response_type:         "code",
      client_id:             client_id,
      redirect_uri:          redirect_uri,
      scope:                 "openid profile",
      state:                 state,
      code_challenge:        challenge,
      code_challenge_method: "S256"
    }.to_query

    redirect_to "#{SEMI_FRONTEND}/oauth/authorize?#{query}", allow_other_host: true
  end

  def callback
    if params[:state].blank? || params[:state] != session.delete(:semi_oauth_state)
      return redirect_to new_identification_path, alert: "授权验证失败，请重试。"
    end

    if params[:error].present?
      return redirect_to new_identification_path, alert: "授权已取消。"
    end

    verifier = session.delete(:semi_code_verifier)
    tokens   = exchange_code(params[:code], verifier)
    unless tokens
      return redirect_to new_identification_path, alert: "获取授权 Token 失败，请重试。"
    end

    userinfo = fetch_userinfo(tokens["access_token"])
    unless userinfo
      return redirect_to new_identification_path, alert: "获取用户信息失败，请重试。"
    end

    user = find_or_create_user(userinfo)
    unless user
      return redirect_to new_identification_path, alert: "账号创建失败，请重试。"
    end

    session_record = Session.create!(
      user:       user,
      user_agent: request.user_agent,
      ip_address: request.remote_ip
    )
    cookies.signed[:session_token] = {
      value:     session_record.raw_token,
      httponly:  true,
      same_site: :lax,
      expires:   30.days.from_now
    }

    return_to = session.delete(:return_to)

    if user.handle.blank?
      session[:return_to] = return_to
      redirect_to new_handle_path, notice: "请先设置用户名"
    else
      redirect_to return_to || root_path, notice: "欢迎回来，#{user.display_name}！"
    end
  end

  private

  def client_id
    ENV["SEMI_CLIENT_ID"]
  end

  def client_secret
    ENV["SEMI_CLIENT_SECRET"]
  end

  def redirect_uri
    ENV.fetch("SEMI_REDIRECT_URI", "http://localhost:5000/callback")
  end

  def exchange_code(code, verifier)
    uri  = URI("#{SEMI_BACKEND}/oauth/token")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == "https")

    req      = Net::HTTP::Post.new(uri.path, "Content-Type" => "application/json")
    req.body = {
      grant_type:    "authorization_code",
      code:          code,
      redirect_uri:  redirect_uri,
      client_id:     client_id,
      client_secret: client_secret,
      code_verifier: verifier
    }.to_json

    res = http.request(req)
    res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
  rescue => e
    Rails.logger.error "Semi token exchange error: #{e.message}"
    nil
  end

  def fetch_userinfo(access_token)
    uri  = URI("#{SEMI_BACKEND}/oauth/userinfo")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == "https")

    req = Net::HTTP::Get.new(uri.path)
    req["Authorization"] = "Bearer #{access_token}"

    res = http.request(req)
    res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
  rescue => e
    Rails.logger.error "Semi userinfo error: #{e.message}"
    nil
  end

  def find_or_create_user(userinfo)
    semi_id    = userinfo["sub"]
    semi_phone = extract_phone(userinfo)

    user = User.find_by(semi_id: semi_id)
    user ||= User.find_by(phone: Phonelib.parse(semi_phone, "CN").e164) if semi_phone.present?

    if user
      semi_handle = userinfo["handle"].presence
      semi_handle = nil if semi_handle && User.exists?(handle: semi_handle)

      attrs = {}
      attrs[:semi_id] = semi_id     if user.semi_id.blank?
      attrs[:phone]   = semi_phone  if semi_phone.present? && user.phone.blank?
      attrs[:handle]  = semi_handle if semi_handle.present? && user.handle.blank?
      if attrs.any? && !user.update(attrs)
        Rails.logger.warn "Semi bind failed for user #{user.id}: #{user.errors.full_messages}"
      end
      return user
    end

    handle = userinfo["handle"].presence
    handle = nil if handle && User.exists?(handle: handle)

    user = User.create(
      semi_id: semi_id,
      handle:  handle,
      name:    userinfo["handle"].presence,
      phone:   semi_phone,
      role:    "member"
    )

    return user if user.persisted?

    # Lost the race — another request already created this account
    if user.errors[:semi_id].any?
      return User.find_by(semi_id: semi_id)
    end

    # Handle taken between existence check and insert — retry without it
    if user.errors[:handle].any?
      User.create(
        semi_id: semi_id,
        handle:  nil,
        name:    userinfo["handle"].presence,
        phone:   semi_phone,
        role:    "member"
      )
    end
  rescue => e
    Rails.logger.error "Semi user creation error: #{e.message}"
    nil
  end

  def extract_phone(userinfo)
    return nil unless userinfo["phone_verified"]
    userinfo["phone"].presence
  end
end
