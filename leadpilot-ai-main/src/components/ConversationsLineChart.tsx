import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#334155', font: { size: 14 } },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: { color: '#64748b' },
      grid: { color: '#e2e8f0' },
    },
    y: {
      ticks: { color: '#64748b' },
      grid: { color: '#e2e8f0' },
    },
  },
};

export function ConversationsLineChart({ data }: { data: { labels: string[]; values: number[] } }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Conversations',
        data: data.values,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
        fill: true,
      },
    ],
  };
  return <Line options={options} data={chartData} height={80} />;
}
