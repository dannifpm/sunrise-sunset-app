import { useState, FormEvent } from 'react';
import styles from './SearchForm.module.css';

interface Props {
  onSearch: (location: string, startISO: string, endISO: string) => void;
}

export function SearchForm({ onSearch }: Props) {
  const [location, setLocation] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!location || !start || !end) {
      setError('Fill all fields.');
      return;
    }
    if (start > end) {
      setError('Start Date cannot be after End Date.');
      return;
    }

    onSearch(location, start, end);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className={styles.input}
          placeholder="e.g. Lisbon"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          type="date"
          value={start}
          onChange={e => setStart(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          type="date"
          value={end}
          onChange={e => setEnd(e.target.value)}
          className={styles.input}
        />
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={!location || !start || !end}
      >
        Search
      </button>

      {error && <div className={styles.errorBox}>{error}</div>}
    </form>
  );
}
