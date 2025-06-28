import axios from "axios";

export interface SunEventRaw {
  date: string;  
  sunrise: string; 
  sunset: string;  
  golden_hour: string;  
  day_length: string;  
}

export interface ApiResponse {
  data: SunEventRaw[];
}

export async function getSunEvents(
  location: string,
  start: string,
  end: string
): Promise<SunEventRaw[]> {
  const res = await axios.get<ApiResponse>("/api/v1/sun_events", {
    params: { location, start_date: start, end_date: end },
  });
  return res.data.data;
}
