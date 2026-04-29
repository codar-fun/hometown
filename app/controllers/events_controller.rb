class EventsController < ApplicationController
  def index
    @upcoming = Event.upcoming.includes(:host)
    @past     = Event.past.limit(20).includes(:host)
    @featured = @upcoming.select(&:featured)
  end
end
