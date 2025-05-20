// import "./App.css";
// import DashboardLayout from "./pages/DashboardLayout";
// import Dashboard from "./pages/DashBoard";
// import Appointment from "./pages/Appointment";
// import Blog from "./pages/Blog";
// import Hero from "./pages/Hero";
// import NotFound from "./pages/NotFound";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Settings from "./pages/Settings";
// import UpdateBlogForm from "./pages/UpdateBlogForm";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AppointmentOverview from "./pages/AppointmentOverview";
// import HeroSectionOverview from "./pages/HeroSectionOverview";
// import DashboardHome from "./pages/DashBoardHome";
// import UsersDashboard from "./pages/UserDashboard";
// import { createTheme, ThemeProvider } from "@mui/material";
// import { useState } from "react";


// function App() {
//   const [mode, setMode] = useState("light"); // initial mode is light

//   const theme = createTheme({
//     palette: {
//       mode: mode,
//       text: {
//         primary: mode === "light" ? "#333" : "#fff",
//         secondary: mode === "light" ? "#666" : "#ccc",
//       },
//     },
//   });

//   const handleModeChange = () => {
//     setMode(mode === "light" ? "dark" : "light");
//   };


//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <DashboardLayout />, // Wrap routes with the layout
//       children: [
//         { path: "/", element: <DashboardHome /> },
//         // { path: "/appointment", element: <Appointment /> },
//         { path: "/blog", element: <Blog /> },
//         { path: "/update-blog/:id", element: <UpdateBlogForm /> },
//         { path: "/hero", element: <HeroSectionOverview /> },
//         { path: "/settings", element: <Settings /> },
//         { path: "/appointments", element: <AppointmentOverview /> },
//         { path: "/users", element: <UsersDashboard /> },
//         { path: "*", element: <NotFound /> },
//       ],
//     },
//   ]);

//   return (
//     <>
//       <ToastContainer />
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;




import "./App.css";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/DashBoard";
import Appointment from "./pages/Appointment";
import Blog from "./pages/Blog";
import Hero from "./pages/Hero";
import NotFound from "./pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Settings from "./pages/Settings";
import UpdateBlogForm from "./pages/UpdateBlogForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppointmentOverview from "./pages/AppointmentOverview";
import HeroSectionOverview from "./pages/HeroSectionOverview";
import DashboardHome from "./pages/DashboardHome";
import UsersDashboard from "./pages/UserDashboard";
import { createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";
import AdminLogin from "./components/AdminLogin";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Course from "./pages/Course";
import UpdateCourseForm from "./pages/UpdateCourseForm";
import Contact from "./pages/Contact";


const ProtectedRoute = ({ redirectPath = "/login", children }) => {
  const token = localStorage.getItem("admin-token");

  if (!token) {
    return <Navigate to={redirectPath} />;
  }

  return children || <Outlet />;
};


function App() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode: mode,
      text: {
        primary: mode === "light" ? "#333" : "#fff",
        secondary: mode === "light" ? "#666" : "#ccc",
      },
    },
  });

  const router = createBrowserRouter([
    { path: "/login", element: <AdminLogin /> },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
                { path: "/", element: <DashboardHome /> },
                // { path: "/appointment", element: <Appointment /> },
                { path: "/blog", element: <Blog /> },
                { path: "/update-blog/:id", element: <UpdateBlogForm /> },
                { path: "/update-course/:id", element: <UpdateCourseForm /> },
                { path: "/hero", element: <HeroSectionOverview /> },
                { path: "/settings", element: <Settings /> },
                { path: "/appointments", element: <AppointmentOverview /> },
                { path: "/courses", element: <Course /> },
                { path: "/contacts", element: <Contact /> },
                { path: "/users", element: <UsersDashboard /> },
                { path: "*", element: <NotFound /> },
              ],
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
