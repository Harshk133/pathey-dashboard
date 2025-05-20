import React from "react";
import { Grid, Card, Typography, Box, Button } from "@mui/material";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto"; // Required for Chart.js
import {
  useGetBlogAnalysisQuery,
  useGetCardAnalysisQuery,
  useGetAppointmentAnalysisQuery,
} from "../features/apiSlice";

const DashboardHome = () => {
  const {
    data: blogData,
    isLoading: blogLoading,
    error: blogError,
    refetch: refetchBlogs,
  } = useGetBlogAnalysisQuery();
  const {
    data: cardData,
    isLoading: cardLoading,
    error: cardError,
    refetch: refetchCards,
  } = useGetCardAnalysisQuery();
  const {
    data: appointmentData,
    isLoading: appointmentLoading,
    error: appointmentError,
    refetch: refetchAppointments,
  } = useGetAppointmentAnalysisQuery();

  const isLoading = blogLoading || cardLoading || appointmentLoading;
  const error = blogError || cardError || appointmentError;

  const metrics = {
    totalBlogs: blogData?.total || 0,
    totalCards: cardData?.total || 0,
    totalAppointments: appointmentData?.total || 0,
  };

  const handleRefetch = () => {
    refetchBlogs();
    refetchCards();
    refetchAppointments();
  };

  const renderChart = (data, type) => {
    if (!data || !data.labels || !data.datasets) {
      return <Typography>Chart data is unavailable</Typography>;
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
    };

    switch (type) {
      case "bar":
        return <Bar data={data} options={options} />;
      case "line":
        return <Line data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box padding={2}>
        <Typography variant="h5">Loading Dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={2}>
        <Typography variant="h5" color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box padding={2} >
      <Typography variant="h4" gutterBottom>
        Welcome to Patheya Dashboard
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleRefetch}
        style={{ marginBottom: 16 }}
      >
        Refresh Dashboard
      </Button>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        {Object.entries(metrics).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card variant="outlined" style={{ padding: 16, textAlign: "center" }}>
              <Typography variant="h6">{key.replace(/([A-Z])/g, " $1")}</Typography>
              <Typography variant="h4">{value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" style={{ padding: 16, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Blogs Per Month
            </Typography>
            {renderChart(blogData?.chartData, "bar")}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" style={{ padding: 16, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Cards Trends
            </Typography>
            {renderChart(cardData?.chartData, "line")}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" style={{ padding: 16, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Appointments Status
            </Typography>
            {appointmentData?.chartData ? (
              renderChart(appointmentData.chartData, "pie")
            ) : (
              <Typography>Data unavailable</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
