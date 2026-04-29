class Rack::Attack
  # Throttle OTP requests by IP: 5 per minute
  throttle("otp/ip", limit: 5, period: 60) do |req|
    req.ip if req.path == "/identification" && req.post?
  end

  # Throttle OTP requests by identifier: 10 per hour
  throttle("otp/identifier", limit: 10, period: 3600) do |req|
    if req.path == "/identification" && req.post?
      req.params["identifier"].to_s.downcase.strip.presence
    end
  end

  # Return 429 JSON for throttled requests
  self.throttled_responder = lambda do |env|
    [ 429, { "Content-Type" => "text/plain" }, [ "Too many requests. Please wait before trying again." ] ]
  end
end
