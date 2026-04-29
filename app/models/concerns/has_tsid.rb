module HasTsid
  extend ActiveSupport::Concern

  included do
    self.primary_key = "id"
    before_create :assign_tsid
  end

  private

  def assign_tsid
    self.id ||= TsidGenerator.generate
  end
end
