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
import LostFoundItems from "../Components/lostfounditems";

// Loader for home page data
async function dataLoader() {
  const response = await fetch("https://lostfoundserver-five.vercel.app/items", {
    credentials: 'include',  // include cookies for auth
  });
  if (!response.ok) throw new Error("Failed to fetch items");
  return response.json();
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
          const res = await fetch(`https://lostfoundserver-five.vercel.app/items/${params.id}`, {
            credentials: 'include',
          });
          if (!res.ok) throw new Error("Failed to fetch task details");
          return res.json();
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
        path: "/allItems",
        element: <LostFoundItems />,
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

      // Update Task by ID (Private Route)
      {
        path: "/updatetask/:id",
        element: (
          <PrivateRoute>
            <UpdateTask />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          const res = await fetch(`https://lostfoundserver-five.vercel.app/items/${params.id}`, {
            credentials: 'include',
          });
          if (!res.ok) throw new Error("Failed to fetch task for update");
          return res.json();
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
