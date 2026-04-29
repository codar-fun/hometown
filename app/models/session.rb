class Session < ApplicationRecord
  belongs_to :user

  before_create :generate_token

  attr_reader :raw_token

  def self.find_by_token(raw)
    return nil if raw.blank?
    find_by(token_digest: Digest::SHA256.hexdigest(raw))
  end

  private

  def generate_token
    @raw_token = SecureRandom.urlsafe_base64(32)
    self.token_digest = Digest::SHA256.hexdigest(@raw_token)
  end
end
