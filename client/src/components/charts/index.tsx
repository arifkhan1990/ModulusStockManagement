
import { useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Generic colors for charts
const chartColors = {
  indigo: {
    main: "rgba(79, 70, 229, 1)",
    light: "rgba(79, 70, 229, 0.2)",
  },
  blue: {
    main: "rgba(59, 130, 246, 1)",
    light: "rgba(59, 130, 246, 0.2)",
  },
  green: {
    main: "rgba(16, 185, 129, 1)",
    light: "rgba(16, 185, 129, 0.2)",
  },
  orange: {
    main: "rgba(249, 115, 22, 1)",
    light: "rgba(249, 115, 22, 0.2)",
  },
  purple: {
    main: "rgba(139, 92, 246, 1)",
    light: "rgba(139, 92, 246, 0.2)",
  },
  red: {
    main: "rgba(239, 68, 68, 1)",
    light: "rgba(239, 68, 68, 0.2)",
  },
  teal: {
    main: "rgba(20, 184, 166, 1)",
    light: "rgba(20, 184, 166, 0.2)",
  },
  cyan: {
    main: "rgba(6, 182, 212, 1)",
    light: "rgba(6, 182, 212, 0.2)",
  },
};

const getColor = (color: string) => {
  return chartColors[color as keyof typeof chartColors] || chartColors.indigo;
};

interface ChartData {
  [key: string]: any;
}

interface ChartProps {
  data: ChartData[];
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  title?: string;
}

// Area Chart Component
export function AreaChart({
  data,
  categories,
  index,
  colors = ["indigo"],
  valueFormatter = (value) => value.toString(),
  showLegend = true,
  title,
}: ChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map((item) => item[index]);
    
    return {
      labels,
      datasets: categories.map((category, i) => {
        const colorKey = colors[i % colors.length];
        const color = getColor(colorKey);
        
        return {
          label: category,
          data: data.map((item) => item[category]),
          borderColor: color.main,
          backgroundColor: color.light,
          fill: true,
          tension: 0.4,
        };
      }),
    };
  }, [data, categories, index, colors]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title || "",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += valueFormatter(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return valueFormatter(value as number);
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

// Bar Chart Component
export function BarChart({
  data,
  categories,
  index,
  colors = ["indigo"],
  valueFormatter = (value) => value.toString(),
  showLegend = true,
  title,
}: ChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map((item) => item[index]);
    
    return {
      labels,
      datasets: categories.map((category, i) => {
        const colorKey = colors[i % colors.length];
        const color = getColor(colorKey);
        
        return {
          label: category,
          data: data.map((item) => item[category]),
          backgroundColor: color.main,
          borderWidth: 0,
          borderRadius: 4,
        };
      }),
    };
  }, [data, categories, index, colors]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title || "",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += valueFormatter(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return valueFormatter(value as number);
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
