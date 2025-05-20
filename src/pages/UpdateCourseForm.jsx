import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from 'jodit-react';

const UpdateCourseForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const [editorContent, setEditorContent] = useState(""); // Editor content state
  const editorRef = useRef(null); // Use ref to handle editor instance directly

  useEffect(() => {
    console.log("Fetching course for ID:", id); // Debugging
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/courses/${id}`);
        setFormData({
          title: response.data.data.title,
          description: response.data.data.description,
          category: response.data.data.category,
          image: response.data.data.image,
        });
        setEditorContent(response.data.data.description); // Set the initial description content
        console.log("response is here", response.data);
      } catch (err) {
        setError("Error fetching course data.");
      }
    };

    fetchCourseData();
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

  const handleEditorChange = (newContent) => {
    setEditorContent(newContent); // Update the editor content when changes are made
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", editorContent); // Use the editor content here
    form.append("category", formData.category);

    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND}/api/courses/update/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Course updated successfully!");
    } catch (err) {
      setError("Error updating the course.");
      toast.error("Error updating the course.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Update Course</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="title">Title</InputLabel>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} type="text" />
        </FormControl>

        <FormControl fullWidth margin="dense">
          <Typography variant="subtitle1">Description</Typography>
          <JoditEditor
            ref={editorRef}
            value={editorContent} // Remove this, it's unnecessary for uncontrolled editors
            onChange={handleEditorChange} // Capture the editor content change
            config={{
              readonly: false, // Set to true to make the editor readonly
              events: {
                change: (newContent) => {
                  // Handle any content change within the editor
                  setEditorContent(newContent);
                }
              }
            }}
          />
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="category">Category</InputLabel>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} type="text" />
        </FormControl>

        <FormControl fullWidth margin="dense">
          <Typography variant="subtitle1">Current Course Image</Typography>
          <br />
          {formData.image && <img src={formData.image} alt="Course" width={150} height={150} />}
        </FormControl>

        <FormControl fullWidth margin="dense">
          <Input id="image" name="image" type="file" onChange={handleFileChange} />
        </FormControl>

        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Update Course
        </Button>
      </form>
    </Box>
  );
};

export default UpdateCourseForm;

