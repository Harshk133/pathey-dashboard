import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { useGetUsersQuery } from '../features/apiSlice'; // Adjust import path

const UsersDashboard = () => {
  const { data, error, isLoading } = useGetUsersQuery();
  const users = data ? data.users : []; // Extract users from the response
  if (isLoading) {
    return <Typography variant="h6" align="center">Loading users...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">Failed to fetch users.</Typography>;
  }

  if (!Array.isArray(users) || users.length === 0) {
    return <Typography variant="h6" align="center" color="error">No users available.</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        All Users
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}> {/* Use _id as the key */}
            <Card>
              <CardContent>
                <Avatar
                  alt={user.name}
                  src={user.image || '/default-avatar.jpg'}
                  sx={{ width: 60, height: 60, marginBottom: 2 }}
                />
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2" color="textSecondary">{user.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UsersDashboard;
