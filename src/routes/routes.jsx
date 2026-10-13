import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import JulyMemories from "../pages/JulyMemories";
import Home from "../pages/Home";
import Feed from "../pages/Feed";
import CreateMemory from "../pages/CreateMemory";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import MemoryDetails from "../pages/MemoryDetails";
import MyMemories from "../pages/MyMemories";
import EditMemory from "../pages/EditMemory"; 
import AdminDashboard from "../pages/AdminDashboard";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "memories/:id",
        element: <MemoryDetails />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "create",
            element: <CreateMemory />,
          },
          {
            path: "my-memories",
            element: <MyMemories />,
          },
          {
            path: "edit-memory/:id",
            element: <EditMemory />, 
          },
          {
            path: "36-july",
            element: <JulyMemories />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
  path: "admin",
  element: <AdminDashboard />, 
},
]);