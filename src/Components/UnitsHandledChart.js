import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UnitsHandledChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch the data from the server
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
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expedition Units',
        data: data.map(item => item.expeditionUnits),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Total Units',
        data: data.map(item => item.totalUnits),
        backgroundColor: 'rgba(0, 102, 255, 0.6)',
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
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '95%', padding: '20px', display: 'flex', flexDirection:'column', justifyContent: 'space-between', gap: '20px', marginBottom:'20px' }}>
      <div  style={{ width: '100%', padding: '20px', display: 'flex', flexDirection:'row',}} >
      <div style={{ width: '100%', height: '300px' }}>
        <Bar data={prepareData(chartData.dailyData, 'daily')} options={options} />
        <p>Daily Units Handled</p>
      </div>

      <div style={{ width: '100%', height: '300px' }}>
        <Bar data={prepareData(chartData.weeklyData, 'weekly')} options={options} />
        <p>Weekly Units Handled</p>
      </div>
      </div>

      <div style={{ width: '100%', height: '300px' }}>
        <Bar data={prepareData(chartData.monthlyData, 'monthly')} options={options} />
        <p>Monthly Units Handled</p>
      </div>
    </div>
  );
};

export default UnitsHandledChart;
