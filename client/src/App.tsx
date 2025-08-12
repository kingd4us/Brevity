// src/App.tsx
import React, { Fragment } from "react"; // No longer need useState
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";
import Button from "./components/Button";
import { Menu, Transition } from "@headlessui/react";

const App: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const logoLink = isAuthenticated && user ? `/${user.username}` : "/";

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-text">
      <Toaster position="top-center" reverseOrder={false} />

      <header className="bg-white border-b-2 border-border shadow-sm relative z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            to={logoLink}
            className="text-2xl font-bold text-border hover:text-pastel-primary transition-colors duration-300"
          >
            Brevity
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated && user ? (
              // This Menu is now the ONLY navigation for logged-in users
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 rounded-md text-border hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-primary">
                  {/* The Menu button is now a hamburger icon */}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg border-2 border-border focus:outline-none z-20">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/${user.username}`}
                            className={`${
                              active ? "bg-slate-100" : ""
                            } block px-4 py-2 text-sm text-text`}
                          >
                            My Public Page
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`${
                              active ? "bg-slate-100" : ""
                            } block px-4 py-2 text-sm text-text`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? "bg-slate-100" : ""
                            } w-full text-left block px-4 py-2 text-sm text-text`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              // Logged-out view remains the same
              <>
                <Link
                  to="/login"
                  className="font-semibold text-gray-600 hover:text-pastel-primary transition-colors"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button className="!bg-pastel-accent !text-border w-auto !py-2 !px-4">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default App;
