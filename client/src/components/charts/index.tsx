import React from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartProps {
  data: any[];
  xKey?: string;
  yKeys: { key: string; name: string; color: string }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export function AreaChart({
  data,
  xKey = 'name',
  yKeys,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        {showXAxis && <XAxis dataKey={xKey} />}
        {showYAxis && <YAxis />}
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        {yKeys.map((yKey) => (
          <Area
            key={yKey.key}
            type="monotone"
            dataKey={yKey.key}
            name={yKey.name}
            stroke={yKey.color}
            fill={yKey.color}
            fillOpacity={0.3}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export function BarChart({
  data,
  xKey = 'name',
  yKeys,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        {showXAxis && <XAxis dataKey={xKey} />}
        {showYAxis && <YAxis />}
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        {yKeys.map((yKey) => (
          <Bar
            key={yKey.key}
            dataKey={yKey.key}
            name={yKey.name}
            fill={yKey.color}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({
  data,
  xKey = 'name',
  yKeys,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        {showXAxis && <XAxis dataKey={xKey} />}
        {showYAxis && <YAxis />}
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        {yKeys.map((yKey) => (
          <Line
            key={yKey.key}
            type="monotone"
            dataKey={yKey.key}
            name={yKey.name}
            stroke={yKey.color}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}