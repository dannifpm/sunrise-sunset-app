import styles from './Results.module.css';
import { SunEventRaw } from '../api/sunEvents';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

interface Props {
  data: SunEventRaw[];
}

function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 1000 / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

export function Results({ data }: Props) {
  if (!data.length) return null;

  const chartData = data.map(raw => {
    const sr = parseDate(raw.sunrise)!;
    const ss = parseDate(raw.sunset)!;
    const gh = parseDate(raw.golden_hour)!;
    return {
      date: raw.date,
      dayLength: ss.getTime() - sr.getTime(),
      goldenTs: gh.getTime(),
      sunriseTs: sr.getTime(),
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const dayEntry = payload.find((p: any) => p.name === 'Day length');
    const ghEntry = payload.find((p: any) => p.name === 'Golden hour');

    const dateStr = new Date(label).toLocaleDateString();
    const dayLen = dayEntry
      ? formatDuration(dayEntry.value as number)
      : '-';
    const ghTime = ghEntry
      ? new Date(ghEntry.value as number).toLocaleTimeString()
      : '-';

    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipDate}>{dateStr}</div>
        <div className={styles.tooltipLine}>
          <span>Day length&nbsp;:</span> {dayLen}
        </div>
        <div className={styles.tooltipLine}>
          <span>Golden hour :</span> {ghTime}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Results</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Sunrise</th>
            <th>Sunset</th>
            <th>Golden Hour</th>
          </tr>
        </thead>
        <tbody>
          {data.map(raw => {
            const dt = parseDate(raw.date)!;
            const sr = parseDate(raw.sunrise);
            const ss = parseDate(raw.sunset);
            const gh = parseDate(raw.golden_hour);
            return (
              <tr key={raw.date}>
                <td>{dt.toLocaleDateString()}</td>
                <td>{sr ? sr.toLocaleTimeString() : '-'}</td>
                <td>{ss ? ss.toLocaleTimeString() : '-'}</td>
                <td>{gh ? gh.toLocaleTimeString() : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              tickFormatter={d => new Date(d).toLocaleDateString()}
            />
            <Tooltip content={CustomTooltip} />

            <Bar
              dataKey="dayLength"
              stackId="a"
              fill="#ffd54f"
              name="Day length"
            />
            <Bar
              dataKey="goldenTs"
              stackId="a"
              fill="#ffca28"
              name="Golden hour"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
