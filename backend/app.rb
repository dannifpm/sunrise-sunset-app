require 'sinatra'
require 'json'
require 'date'
require_relative './config/database'
require_relative './models/sun_event'
require_relative './services/sunrise_service'

set :show_exceptions, false

error SunriseService::LocationNotFound do |e|
  status 400
  { error: e.message }.to_json
end

error SunriseService::ExternalApiError do |_e|
  status 502
  { error: 'Error in external API. Please try again later' }.to_json
end

error do |e|
  status 500
  { error: "Internal error: #{e.message}" }.to_json
end

get '/api/v1/sun_events' do
  content_type :json

  location   = params['location'] or halt(400, { error: 'Missing location param' }.to_json)
  start_date = begin Date.parse(params['start_date']); rescue; halt(400, { error: ' Invalid start_date' }.to_json); end
  end_date   = begin Date.parse(params['end_date']);   rescue; halt(400, { error: 'Invalid end_date' }.to_json); end

  data = (start_date..end_date).map do |d|
    ev = SunEvent.fetch_or_create(location, d)
    {
      date: d.iso8601,
      sunrise: ev.sunrise,
      sunset: ev.sunset,
      golden_hour: ev.golden_hour
    }
  end

  status 200
  { data: data }.to_json
end
