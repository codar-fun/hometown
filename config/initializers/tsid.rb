require_relative "../../lib/tsid"

module TsidGenerator
  GENERATOR = Tsid::Generator.new
  MUTEX = Mutex.new

  def self.generate
    MUTEX.synchronize { GENERATOR.generate }
  end
end
