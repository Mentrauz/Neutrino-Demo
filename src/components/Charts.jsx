import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
} from 'recharts';

/**
 * Color scheme — reads from CSS vars at render time so it
 * stays in sync with the active theme.
 */
function getColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    mother: s.getPropertyValue('--color-mother').trim() || '#C06848',
    father: s.getPropertyValue('--color-father').trim() || '#3B6B4A',
    grid: s.getPropertyValue('--color-border').trim() || '#E5DAC8',
    textMuted: s.getPropertyValue('--color-text-muted').trim() || '#9C8A78',
    surface: s.getPropertyValue('--color-surface').trim() || '#FFFFFF',
    border: s.getPropertyValue('--color-border').trim() || '#E5DAC8',
  };
}

/**
 * Custom tooltip
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="tooltip-value" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(3) : entry.value}
        </p>
      ))}
    </div>
  );
}

/**
 * Bar Chart — side-by-side Mother vs Father per factor
 */
function FactorBarChart({ factors }) {
  const c = getColors();
  const data = factors.map((f) => ({
    name: f.name.split(' ')[0],
    fullName: f.name,
    Mother: f.mother,
    Father: f.father,
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Factor Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} opacity={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fill: c.textMuted, fontSize: 11, fontFamily: 'DM Sans' }}
            tickLine={false}
            axisLine={{ stroke: c.grid }}
          />
          <YAxis
            tick={{ fill: c.textMuted, fontSize: 11, fontFamily: 'DM Sans' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'DM Sans', paddingTop: '6px' }} />
          <Bar dataKey="Mother" fill={c.mother} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Father" fill={c.father} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Radar Chart — overlay of Mother vs Father profiles
 */
function FactorRadarChart({ factors }) {
  const c = getColors();
  const data = factors.map((f) => ({
    factor: f.name.split(' ')[0],
    Mother: f.mother,
    Father: f.father,
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Legacy Profile</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} margin={{ top: 8, right: 28, left: 28, bottom: 8 }}>
          <PolarGrid stroke={c.grid} opacity={0.5} />
          <PolarAngleAxis
            dataKey="factor"
            tick={{ fill: c.textMuted, fontSize: 11, fontFamily: 'DM Sans' }}
          />
          <PolarRadiusAxis
            angle={90}
            tick={{ fill: c.textMuted, fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
          />
          <Radar
            name="Mother"
            dataKey="Mother"
            stroke={c.mother}
            fill={c.mother}
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="Father"
            dataKey="Father"
            stroke={c.father}
            fill={c.father}
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'DM Sans' }} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Donut Chart — overall Mother vs Father split
 */
function OverallDonutChart({ motherTotal, fatherTotal }) {
  const c = getColors();
  const data = [
    { name: 'Mother', value: motherTotal },
    { name: 'Father', value: fatherTotal },
  ];
  const COLORS = [c.mother, c.father];

  return (
    <div className="chart-card donut-card">
      <h3 className="chart-title">Overall Split</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => value.toFixed(3)}
            contentStyle={{
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'DM Sans',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'DM Sans' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">
        <span className="donut-value">100</span>
        <span className="donut-label">Total</span>
      </div>
    </div>
  );
}

/**
 * Charts — parent component that renders all three chart types
 */
export default function Charts({ results }) {
  if (!results) return null;

  return (
    <div className="charts-section">
      <h2 className="section-title">Visual Analysis</h2>
      <div className="charts-grid">
        <FactorBarChart factors={results.factors} />
        <FactorRadarChart factors={results.factors} />
        <OverallDonutChart
          motherTotal={results.motherTotal}
          fatherTotal={results.fatherTotal}
        />
      </div>
    </div>
  );
}
