import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { useGetBlogsQuery, useDeleteBlogMutation } from '../features/apiSlice';
import { toast } from 'react-toastify';

const BlogTable = () => {
  const { data: blogs, isLoading } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      toast.success('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/update-blog/${id}`;
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Typography variant="h3">All Blogs</Typography>
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs?.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.description}</TableCell>
                <TableCell>
                  <img src={blog.coverImage} alt={blog.title} width="100" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(blog._id)}
                    style={{ marginRight: '8px' }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (window.confirm('Do you really want to delete this blog?')) {
                        handleDelete(blog._id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BlogTable;