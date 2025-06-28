import React, { useState } from 'react';
import axios from 'axios';

import { getSunEvents, SunEventRaw } from './api/sunEvents';
import { SearchForm } from './components/SearchForm';
import { Results } from './components/Results';

export default function App() {
  const [data, setData] = useState<SunEventRaw[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (location: string, start: string, end: string) => {
    setLoading(true);
    setError(null);

    try {
      const events = await getSunEvents(location, start, end);
      setData(events);
    } catch (e: unknown) {
      if (axios.isCancel(e)) {
        return;
      }
      setError(e instanceof Error ? e.message : String(e));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sunrise/Sunset App</h1>

      <SearchForm onSearch={handleSearch} />

      {loading && <p>Loading…</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {!loading && !error && data.length > 0 && <Results data={data} />}
    </div>
  );
}
