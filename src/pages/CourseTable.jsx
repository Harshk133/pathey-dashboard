// import React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Paper,
//   Typography,
// } from '@mui/material';
// import { useGetCoursesQuery, useDeleteCourseMutation } from '../features/apiSlice';
// import { toast } from 'react-toastify';

// const CourseTable = () => {
//   const { data: courses, isLoading } = useGetCoursesQuery();
//   const [deleteCourse] = useDeleteCourseMutation();

//   const handleDelete = async (id) => {
//     if (window.confirm('Do you really want to delete this course?')) {
//       try {
//         await deleteCourse(id).unwrap();
//         toast.success('Course deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting course:', error);
//         toast.error('Failed to delete course');
//       }
//     }
//   };

//   const handleUpdate = (id) => {
//     window.location.href = `/update-course/${id}`;
//   };

//   if (isLoading) return <Typography>Loading...</Typography>;

//   return (
//     <>
//       <Typography variant="h3">All Courses</Typography>
//       <br />
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Title</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Image</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {courses?.map((course) => (
//               <TableRow key={course._id}>
//                 <TableCell>{course.title}</TableCell>
//                 <TableCell>{course.description}</TableCell>
//                 <TableCell>{course.category}</TableCell>
//                 <TableCell>
//                   <img src={course.image} alt={course.title} width="100" />
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleUpdate(course._id)}
//                     style={{ marginRight: '8px' }}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleDelete(course._id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// };

// export default CourseTable;




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
import { useGetCoursesQuery, useDeleteCourseMutation } from '../features/apiSlice';
import { toast } from 'react-toastify';

const CourseTable = () => {
  const { data: courses, isLoading } = useGetCoursesQuery();
  const [deleteCourse] = useDeleteCourseMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Do you really want to delete this course?')) {
      try {
        await deleteCourse(id).unwrap();
        toast.success('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/update-course/${id}`;
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Typography variant="h3">All Courses</Typography>
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell
                  dangerouslySetInnerHTML={{ __html: course.description }} // Correctly render the formatted description
                />
                <TableCell>{course.category}</TableCell>
                <TableCell>
                  <img src={course.image} alt={course.title} width="100" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(course._id)}
                    style={{ marginRight: '8px' }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(course._id)}
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

export default CourseTable;
