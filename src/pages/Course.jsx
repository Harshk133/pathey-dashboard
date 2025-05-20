import React from "react";
import CourseForm from "../components/CourseForm";
import CourseTable from "./CourseTable";
import { Container, Divider, Typography } from "@mui/material";

const Course = () => {
  return (
    <div>
      {/* <h2>
        <strong>Create a New Course</strong>
      </h2>
      <CourseForm /> */}

      <Container sx={{ height: "150vh" }}>
        <Typography variant="h2">Course Management</Typography>
        <Divider />

        <CourseTable />

        <CourseForm />
      </Container>
    </div>
  );
};

export default Course;
