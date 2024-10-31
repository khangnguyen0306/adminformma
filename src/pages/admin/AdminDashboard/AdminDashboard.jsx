import React from 'react';
import { Card, Row, Typography } from 'antd';
import { useGetAllUserQuery } from '../../../services/userAPI';
import { useGetAllOrderQuery } from '../../../services/orderApi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

const { Title } = Typography;

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const AdminDashboard = () => {
  const { data: users } = useGetAllUserQuery();
  const { data: orders } = useGetAllOrderQuery();
  const totalOrderPrice = orders?.reduce((total, order) => total + (order.totalPrice || 0), 0) || 0;

  // Chart Data
  const userData = {
    labels: ['Users'],
    datasets: [
      {
        label: 'Number of Users',
        data: [users?.length || 0],
        backgroundColor: '#8884d8',
      },
    ],
  };

  const orderData = {
    labels: ['Orders'],
    datasets: [
      {
        label: 'Number of Orders',
        data: [orders?.length || 0],
        backgroundColor: '#82ca9d',
      },
    ],
  };

  const priceData = {
    labels: ['Total Price'],
    datasets: [
      {
        label: 'Total Order Price',
        data: [totalOrderPrice],
        backgroundColor: '#ffc658',
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Admin Dashboard Metrics',
      },
    },
  };

  return (
    <div>
    <Row style={{gap:"50px"}}>
      <Card title="Users" style={{ marginBottom: 20, width:"500px" }}>
        <Bar data={userData} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Number of Users' } } }} />
        <Title level={5}>Number of users: {users?.length}</Title>
      </Card>

      <Card title="Orders" style={{ marginBottom: 20, width:"500px" }}>
        <Bar data={orderData} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Number of Orders' } } }} />
        <Title level={5}>Number of orders: {orders?.length}</Title>
      </Card>
      </Row>
      <Row style={{justifyContent:"center"}}>
      <Card title="Total Order Price" style={{ marginBottom: 20, width:"500px" }}>
        <Bar data={priceData} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Total Order Price' } } }} />
        <Title level={5}>Total order price: {totalOrderPrice}VND</Title>
      </Card>
      </Row>
      </div>
  );
};

export default AdminDashboard;
