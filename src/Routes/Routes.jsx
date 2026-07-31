import React from "react";
import { createBrowserRouter, Link } from "react-router-dom";

import Root from "../Components/Root/Root";
import MyPostedTasks from "../Components/MyPostedTasks";
import UpdateTask from "../Components/UpdateTask";
import Taskdetails from "../Components/Taskdetails";
import Home from "../Components/Home";
import Login from "../Login/Login";
import Register from "../Register/Register";
import PrivateRoute from "../Components/PrivateRoute/PrivateRoute";
import AddItem from "../Components/AddItem";
import RecoveredItems from "../Components/RecoveredItems";
import Lostitems from "../Components/LostItems";
import Founditems from "../Components/Founditems";
import ProjectDocumentation from "../Components/ProjectDocumentation";




const API_BASE_URL = "http://localhost:5000" ;

async function fetchJson(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    if (data && typeof data === "object" && data.item) return data.item;
    if (data && typeof data === "object" && (data._id || data.title || data.description)) return data;
    return [];
  } catch (error) {
    console.error("API request failed:", error);
    return [];
  }
}

// Loader for home page data
async function dataLoader() {
  return fetchJson("/");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Home Page
      {
        path: "/",
        element: <Home />,
        loader: dataLoader,
      },

      // Authentication
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },

      // Task Details (Private Route)
      {
        path: "/taskdetails/:id",
        element: (
          <PrivateRoute>
            <Taskdetails />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          return fetchJson(`/${params.id}`);
        },
      },

      // Add New Item (Private Route)
      {
        path: "/addItems",
        element: (
          <PrivateRoute>
            <AddItem />
          </PrivateRoute>
        ),
      },

      {
        path: "/lostitems",
        element: <Lostitems/>,
      },
      {
        path: "/founditems",
        element: <Founditems />,
      },

      // My Posted Items (Private Route)
      {
        path: "/myItems",
        element: (
          <PrivateRoute>
            <MyPostedTasks />
          </PrivateRoute>
        ),
      },

      // All Recovered Items (Public Route)
      {
        path: "/allRecovered",
        element: <RecoveredItems />,
      },
      {
        path: "/documentation",
        element: <ProjectDocumentation />,
      },

      // Update Task by ID (Private Route)
      {
        path: "/updatetask/:id",
        element: (
          <PrivateRoute>
            <UpdateTask />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          return fetchJson(`/${params.id}`);
        },
      },
    ],

    // Custom 404 Page
    errorElement: (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-neutral">
          Go Back Home
        </Link>
      </div>
    ),
  },
]);

export default router;
