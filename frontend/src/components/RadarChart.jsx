import React, {useState, useEffect} from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import "../styles/RadarChart.css";
import GradientArea from './GradientArea';

const RadarChart = () => {
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

  // Initialize data points only once using useState and useEffect
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const points = labels.map(() => Math.random());
    setDataPoints(points);
  }, []);  // Empty dependency array ensures this effect runs only once

  const riskCategories = dataPoints.map(value => {
    if (value <= 0.2) return 'Very Low Risk';
    if (value <= 0.4) return 'Low Risk';
    if (value <= 0.6) return 'Medium Risk';
    if (value <= 0.8) return 'High Risk';
    return 'Very High Risk';
  });

  const pointBackgroundColors = dataPoints.map(value => {
    if (value <= 0.2) return 'green';
    if (value <= 0.4) return 'lightblue';
    if (value <= 0.6) return 'yellow';
    if (value <= 0.8) return 'orange';
    return 'red';
  });

  const [riskDescription, setRiskDescription] = useState('');

  const riskDescriptions = {
    "Very Low Risk": "Very Low risk indicates very minimal ethical concerns and impacts. Suitable for most contexts without significant adjustments.",
    "Low Risk": "Low risk indicates minimal ethical concerns and impacts. Suitable for most contexts without significant adjustments.",
    "Medium Risk": "Medium risk suggests moderate ethical considerations are needed. May require periodic reviews and oversight.",
    "High Risk": "High risk indicates significant ethical concerns. Requires active management and mitigation strategies to address.",
    "Very High Risk": "Very high risk represents severe ethical concerns with potential major negative impacts. Urgent and comprehensive mitigation measures are necessary."
  };

  const handleMouseEnter = (risk) => {
    setRiskDescription(riskDescriptions[risk]);
  };

  const handleMouseLeave = () => {
    setRiskDescription('');
  };

  // Calculate overall average score
  const averageScore = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'E-voting',
        data: dataPoints,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: pointBackgroundColors,
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
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${riskCategories[context.dataIndex]} (${context.raw.toFixed(2)})`;
          }
        }
      }
    }
  };

  return (
  <div>

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
            <h4 style={{ marginBottom: "50px" }}>Assessment of digital ethics concerns</h4>
            <Radar data={chartData} options={options} />
        </div>

        <GradientArea averageScore={averageScore} />
    </div>

  </div>
  );
};

export default RadarChart;