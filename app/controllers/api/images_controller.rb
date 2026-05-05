require "aws-sdk-s3"

class Api::ImagesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :require_login

  def create
    file = params[:file]
    return render json: { error: "file required" }, status: :unprocessable_entity if file.blank?

    unless file.content_type.start_with?("image/")
      return render json: { error: "file must be an image" }, status: :unprocessable_entity
    end

    key = "uploads/#{Date.today.strftime('%Y/%m')}/#{SecureRandom.uuid}-#{sanitize_filename(file.original_filename)}"

    client = Aws::S3::Client.new(
      access_key_id:     ENV["R2_ACCESS_KEY_ID"],
      secret_access_key: ENV["R2_SECRET_ACCESS_KEY"],
      endpoint:          ENV["R2_ENDPOINT"],
      region:            "auto",
      force_path_style:  true
    )

    client.put_object(
      bucket:       ENV["R2_BUCKET"],
      key:          key,
      body:         file.read,
      content_type: file.content_type
    )

    url = "#{ENV['R2_PUBLIC_URL']}/#{key}"
    render json: { url: url }, status: :created
  end

  private

  def sanitize_filename(name)
    name.gsub(/[^\w.\-]/, "_").downcase
  end
end
