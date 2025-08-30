import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExperimentStatusChart = ({ stats }) => {
  const data = {
    labels: ['Completed', 'In Progress', 'Planned'],
    datasets: [{
      data: [stats.completed, stats.inProgress, stats.planned],
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',  // green-500
        'rgba(6, 182, 212, 0.7)',   // cyan-500
        'rgba(234, 179, 8, 0.7)',   // yellow-500
      ],
      borderColor: '#1e293b', // slate-800
      borderWidth: 4,
      hoverOffset: 12,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8', // text-slate-400
          padding: 20,
          font: {
            size: 12,
            weight: 'bold',
          },
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
    },
    cutout: '75%',
  };

  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold text-white mb-4">Project Breakdown</h3>
      <div className="relative flex-grow flex items-center justify-center min-h-[200px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default ExperimentStatusChart;