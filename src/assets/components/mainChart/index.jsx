import React from 'react';
import { Container } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Expenses',
      data: [2000, 1500, 1800, 1200, 1600, 1400, 2000],
      borderColor: 'rgba(255, 99, 132, 0.2)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      label: 'Income',
      data: [2500, 2800, 2200, 2000, 2800, 2600, 3000],
      borderColor: 'rgba(54, 162, 235, 0.2)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const MainChart = () => {
  return (
    <Container>
      <h2 className="mt-5 mb-3">Expenses and Income Chart</h2>
      <div style={{ height: '400px' }}>
        <Line data={data} options={options} />
      </div>
    </Container>
  );
};

export default MainChart;
