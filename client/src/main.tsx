// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'; 

import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx'; 
import PublicProfilePage from './pages/PublicProfilePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

// Define our application's routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The App component will now act as our main layout
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
      {
        index: true, // This makes HomePage the default child route for '/'
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      { path: '/dashboard', 
        element: <DashboardPage />, 
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute />, // 2. The bouncer guards this path
        children: [
          { index: true, element: <DashboardPage /> }, // 3. If allowed, show the dashboard
        ],
      },
      {
        path: '/:username', // 2. Add this route at the end
        element: <PublicProfilePage />,
      },
      {
        path: '*', // 2. Add this route
        element: <NotFoundPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);