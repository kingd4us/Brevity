import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from './config/db.js'; // Importing database connection
import userRoutes from './routes/userRoutes.js';
import linkRoutes from './routes/linkRoutes.js'; // Importing link routes
import socialLinkRoutes from './routes/socialLinkRoutes.js';

// configure environtment variables
dotenv.config();

//connect to the database
connectDB();

// initialize express app
const app = express();
app.use(cors());
app.use(express.json()); // this is a crucial middleware that allows our server to accept JSON data in the request body
const PORT = process.env.PORT || 5000;  // Use port from .env or default to 5000.

// define a basic route
app.get ('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes); // Use the link routes
app.use('/api/socials', socialLinkRoutes);


// start the server
app.listen(PORT, ()=> {
    console.log(`Server is running successfully on http://localhost:${PORT}`)
});