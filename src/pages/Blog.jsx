import { Button, Container, Divider, Typography } from '@mui/material'
import React from 'react'
import BlogForm from '../components/BlogForm'
import BlogTable from './BlogTable'

const Blog = () => {
  const reloadPage = () => {
    window.location.reload();
  };
  return (
    <>
      <Container sx={{ height: '150vh',   }}>
        <Typography variant='h2'>Blog Management</Typography>
        <Divider />
     <Button onClick={reloadPage} variant='contained'>Reload Dashboard</Button>
        <br />
 
        <BlogTable  />

        <BlogForm />

      </Container>
    </>
  )
}

export default Blog
