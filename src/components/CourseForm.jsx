import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Typography,
  Stack,
} from '@mui/material';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAddCourseMutation } from '../features/apiSlice';
import JoditEditor from 'jodit-react';

const CourseForm = () => {
  const editor = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [addCourse] = useAddCourseMutation();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .required('Title is required'),
      description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .required('Description is required'),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category', values.category);
        if (imageFile) {
          formData.append('course_cover_img', imageFile);
        }

        await addCourse(formData).unwrap();

        toast.success('Course added successfully!', {
          position: 'top-center',
          autoClose: 3000,
        });

        resetForm();
        setImageFile(null);
      } catch (error) {
        console.error('Failed to add course:', error);
        toast.error('Error adding course. Please try again.', {
          position: 'top-center',
        });
      }
    },
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%', maxWidth: 600 }}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center">Add a New Course</Typography>

          <FormControl fullWidth>
            <InputLabel htmlFor="title">Title</InputLabel>
            <Input
              id="title"
              name="title"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title && (
              <FormHelperText error>{formik.errors.title}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Description</Typography>
            <JoditEditor
              ref={editor}
              value={formik.values.description}
              onBlur={(newContent) => formik.setFieldValue('description', newContent)}
              onChange={(newContent) => formik.setFieldValue('description', newContent)}
            />
            {formik.touched.description && formik.errors.description && (
              <FormHelperText error>{formik.errors.description}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel htmlFor="category">Category</InputLabel>
            <Input
              id="category"
              name="category"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.category}
            />
            {formik.touched.category && formik.errors.category && (
              <FormHelperText error>{formik.errors.category}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel shrink htmlFor="course_cover_image">Course Cover Image</InputLabel>
            <Input
              id="course_cover_image"
              type="file"
              onChange={handleImageChange}
            />
          </FormControl>

          <Button type="submit" variant="contained" fullWidth>
            Publish Course
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CourseForm;
