# Brevity - A Link-in-Bio Solution

A full-stack link-in-bio application built from scratch with a modern tech stack. This platform allows users to create a personalized public page to share all their important links from a single URL.

**Live Demo:** [Link to your deployed site on Vercel (we'll add this later)]

---

### ✨ Features

- **Full User Authentication**: Secure registration and login with JWT.
- **Protected Routes**: A private dashboard accessible only to logged-in users.
- **Link Management**: Full CRUD (Create, Read, Update, Delete) functionality for links.
- **Drag & Drop Reordering**: Easily reorder links on the dashboard.
- **Social Media Links**: Add social media profiles with a dynamic icon picker.
- **Profile Customization**: Users can add a custom bio to their public page.
- **Responsive Design**: A modern, mobile-first design that looks great on all devices.
- **API-First Architecture**: A complete backend API built with Node.js and Express.

---

### 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

*(To get these badges, you can go to [shields.io](https://shields.io/) and create your own.)*

---

### 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
* Node.js (v18 or newer)
* npm
* A free MongoDB Atlas account

**Installation:**

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/your-username/brevity.git](https://github.com/your-username/brevity.git)
    ```
2.  **Navigate to the server and install dependencies:**
    ```sh
    cd brevity/server
    npm install
    ```
3.  **Create a `.env` file in the `server` directory** and add your variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
4.  **Navigate to the client and install dependencies:**
    ```sh
    cd ../client
    npm install
    ```
5.  **Create a `.env.development` file in the `client` directory** and add your backend URL:
    ```
    VITE_API_URL=http://localhost:5001
    ```
6.  **Run the application:**
    * Start the backend server (from the `server` directory): `npm run dev`
    * Start the frontend server (from the `client` directory): `npm run dev`