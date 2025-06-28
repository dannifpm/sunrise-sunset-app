require 'dotenv/load'
require 'sequel'

DB = Sequel.connect(ENV.fetch('DATABASE_URL'))
Sequel.extension :migration

puts "Applying migration in #{ENV.fetch('DATABASE_URL', nil)}"
Sequel::Migrator.run(DB, 'db/migrations')
puts 'Migrations done!'
