// src/components/RadarChart.jsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import GradientArea from './GradientArea';

const RadarChart = () => {
  // Labels for the radar chart
  const labels = [
    "Autonomy",
    "Discrimination",
    "Domination",
    "Exclusion",
    "Exploitation",
    "Inequality",
    "Justice",
    "Privacy",
    "Responsibility",
    "Trust",
    "Dignity",
    "Truth"
  ];

  // Random data generation
  const dataPoints = labels.map(() => Math.random());

  // Calculate overall average score
  const averageScore = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length;

  // Chart data structure
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'E-voting',
        data: dataPoints,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 1
      }
    },
    elements: {
      line: {
        borderWidth: 3
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <h4 style={{ marginBottom: "50px" }}>Assessment of Digital Ethics Concerns</h4>
        <Radar data={chartData} options={options} />
      </div>
      <GradientArea averageScore={averageScore} />
    </div>
  );
};

export default RadarChart;
