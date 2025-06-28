require 'sequel'
require_relative '../services/sunrise_service'

class SunEvent < Sequel::Model(:sun_events)
  plugin :timestamps, update_on_create: true

  def self.fetch_or_create(location, date)
    where(location: location, date: date).first || create_with_service(location, date)
  end

  def self.create_with_service(location, date)
    data = SunriseService.new.fetch(location, date)
    create(
      location: location,
      date: date,
      sunrise: data[:sunrise],
      sunset: data[:sunset],
      golden_hour: data[:golden_hour]
    )
  end
end
