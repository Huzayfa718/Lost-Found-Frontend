import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import {
  RouterProvider,
} from "react-router-dom";
import router from './Routes/Routes.jsx';
import AuthProvider from './Components/Contexts/AuthProvider.jsx';



createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>,
)
