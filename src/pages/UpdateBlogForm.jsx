import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import { useRef } from "react";

const UpdateBlogForm = () => {
  const { id } = useParams(); // Get blog ID from the URL (assuming you're using React Router)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: null,
  });
  const [error, setError] = useState(null);

  // Fetch blog data based on the ID from the backend when the component mounts
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND}/api/blogs/update/${id}`
        );
        setFormData({
          title: response.data.data.title,
          description: response.data.data.description,
          content: response.data.data.content,
          image: response.data.data.coverImage, // Keep the current image as is (for now)
          // image: null, // Keep the current image as is (for now)
        });
      } catch (err) {
        setError("Error fetching blog data.");
      }
    };

    fetchBlogData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("content", formData.content);

    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND}/api/blogs/update/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // alert("Blog updated successfully!");
      toast.success("Blog updated successfully!!", {
        position: "top-center", // Options: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
        autoClose: 3000, // Duration in milliseconds
      });
    } catch (err) {
      console.error(err);
      setError("Error updating the blog.");
      toast.error("Error updating the blog.", {
        position: "top-center",
      });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Update Blog</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="title">Title</InputLabel>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
          />
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="text"
          />
        </FormControl>
        <br /> <br />

        {/* <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="content">Content</InputLabel>
          <Input
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            type="text"
          />
        </FormControl> */}
        <FormControl fullWidth>
          <InputLabel shrink htmlFor="content">
            Content
          </InputLabel>
          <br /> 
          <JoditEditor
            ref={useRef(null)}
            value={formData.content}
            onChange={(newContent) =>
              setFormData((prevData) => ({
                ...prevData,
                content: newContent,
              }))
            }
          />
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="current_image">Current Cover Image</InputLabel>
          <br />
          <br />
          <img
            src={formData.image}
            alt="the current image"
            width={150}
            height={150}
          />
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="image">Cover Image</InputLabel>
          <br />
          <br />
          <Input
            id="image"
            name="image"
            type="file"
            onChange={handleFileChange}
          />
        </FormControl>

        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Update Blog
        </Button>
      </form>
    </Box>
  );
};

export default UpdateBlogForm;
