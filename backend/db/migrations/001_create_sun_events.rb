Sequel.migration do
  change do
    create_table(:sun_events) do
      primary_key :id
      String :location, null: false
      Date :date, null: false
      Time :sunrise
      Time :sunset
      Time :golden_hour
      DateTime :created_at
    end
    add_index :sun_events, %i[location date], unique: true
  end
end
