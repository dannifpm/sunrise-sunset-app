require 'dotenv/load'
require 'sequel'

DB = Sequel.connect(ENV.fetch('DATABASE_URL'))
