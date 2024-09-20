import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ChartStyles.css'; // Add custom CSS for styling

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UnitsHandledChart2 = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/calculations/chart-units-handled');
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  // Prepare data for daily, weekly, and monthly charts
  const prepareData = (data, type) => ({
    labels: data.map(item => item[type === 'daily' ? 'date' : type === 'weekly' ? 'weekStart' : 'monthStart']),
    datasets: [
      {
        label: 'Reception Units',
        data: data.map(item => item.receptionUnits),
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
      {
        label: 'Expedition Units',
        data: data.map(item => item.expeditionUnits),
        backgroundColor: '#FF9800',
        borderColor: '#FF9800',
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Units Handled',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      {/* Bar Chart for Daily Data */}
      <div className="chart-card">
        <div className="chart-wrapper">
          <Bar data={prepareData(chartData.dailyData, 'daily')} options={options} />
        </div>
        <p className="chart-title">Daily Units Handled (Bar Chart)</p>
      </div>

      {/* Bar Chart for Weekly Data */}
      <div className="chart-card">
        <div className="chart-wrapper">
          <Bar data={prepareData(chartData.weeklyData, 'weekly')} options={options} />
        </div>
        <p className="chart-title">Weekly Units Handled (Bar Chart)</p>
      </div>

      {/* Bar Chart for Monthly Data */}
      <div className="chart-card">
        <div className="chart-wrapper">
          <Bar data={prepareData(chartData.monthlyData, 'monthly')} options={options} />
        </div>
        <p className="chart-title">Monthly Units Handled (Bar Chart)</p>
      </div>
    </div>
  );
};

export default UnitsHandledChart2;
