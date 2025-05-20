import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Typography,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAddBlogMutation } from "../features/apiSlice";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import { useRef } from "react";

const BlogForm = () => {
  const [imageFile, setImageFile] = useState(null);
  const [addBlog] = useAddBlogMutation();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      content: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .required("Title is required"),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .required("Description is required"),
      content: Yup.string()
        .min(20, "Content must be at least 20 characters")
        .required("Content is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("content", values.content);
        if (imageFile) {
          formData.append("blog_cover_image", imageFile);
        }

        await addBlog(formData).unwrap();

        toast.success("Blog added successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        resetForm();
        setImageFile(null);
      } catch (error) {
        console.error("Failed to add blog:", error);
        toast.error("Error adding blog. Please try again.", {
          position: "top-center",
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
    <Box sx={{ p: 4, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Add a New Blog
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
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
            <InputLabel htmlFor="description">Description</InputLabel>
            <Input
              id="description"
              name="description"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description && (
              <FormHelperText error>{formik.errors.description}</FormHelperText>
            )}
          </FormControl>

          {/* <FormControl fullWidth>
            <InputLabel htmlFor="content">Content</InputLabel>
            <Input
              id="content"
              name="content"
              multiline
              rows={6}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
            />
            {formik.touched.content && formik.errors.content && (
              <FormHelperText error>{formik.errors.content}</FormHelperText>
            )}
          </FormControl> */}
          
          <FormControl fullWidth>
            <InputLabel htmlFor="content">Content</InputLabel>
            <br /> <br />
            <JoditEditor
              ref={useRef(null)}
              value={formik.values.content}
              onBlur={formik.handleBlur}
              onChange={(newContent) =>
                formik.setFieldValue("content", newContent)
              }
            />
            {formik.touched.content && formik.errors.content && (
              <FormHelperText error>{formik.errors.content}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel shrink htmlFor="blog_cover_image">
              Blog Cover Image
            </InputLabel>
            <Input
              id="blog_cover_image"
              type="file"
              onChange={handleImageChange}
            />
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Publish Blog
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default BlogForm;
