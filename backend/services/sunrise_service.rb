require 'geocoder'
require 'httparty'
require 'json'
require 'time'

class SunriseService
  LocationNotFound  = Class.new(StandardError)
  ExternalApiError  = Class.new(StandardError)

  API_BASE = 'https://api.sunrisesunset.io'

  def fetch(location, date, retries = 2)
    raw = geocode_and_fetch(location, date, retries)
    parse_results(raw)
  end

  private

  def geocode_and_fetch(location, date, retries)
    geo = Geocoder.search(location).first
    raise LocationNotFound, "Location not found: #{location}" unless geo

    lat, lng = geo.coordinates
    resp = HTTParty.get(
      "#{API_BASE}/json",
      query: {
        lat:  lat,
        lng:  lng,
        date: date.iso8601
      }
    )

    data = begin
      JSON.parse(resp.body)
    rescue StandardError
      nil
    end
    unless resp.success? && data&.dig('status') == 'OK'
      if (retries -= 1) >= 0
        sleep 0.5
        return geocode_and_fetch(location, date, retries)
      end
      msg = data&.dig('message') || resp.code
      raise ExternalApiError, "Error in external API: #{msg}"
    end

    data.fetch('results', {})
  end

  def parse_results(r)
    sr = r['sunrise']
    ss = r['sunset']
    gh = r['golden_hour']
    return { sunrise: nil, sunset: nil, golden_hour: nil } if sr.nil? || ss.nil?

    base_date = r['date']
    {
      sunrise: Time.parse("#{base_date} #{sr}"),
      sunset: Time.parse("#{base_date} #{ss}"),
      golden_hour: gh ? Time.parse("#{base_date} #{gh}") : nil
    }
  end
end
