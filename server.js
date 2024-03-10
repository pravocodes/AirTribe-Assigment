// Import necessary modules and dependencies
import Express from "express";
import color from "colors";
import dotenv from "dotenv";
import conn from "./dbconfig/db.js";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import instructorRoute from "./routes/instructorRoute.js";
import courseRoute from "./routes/courseRoute.js";
import commentRoute from "./routes/commentRoute.js";

// Initialize Express application
const app = Express();

// Define a route for the root endpoint
app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

// Load environment variables from .env file
dotenv.config();

// Enable JSON body parsing middleware
app.use(Express.json());

// Enable CORS middleware
app.use(cors());

// Define routes for authentication, instructor, course, and comment
app.use("/api/auth", authRoute);
app.use("/api/instructor", instructorRoute);
app.use("/api/course", courseRoute);
app.use("/api/comment", commentRoute);

// Establish connection to the database
conn();

// Define the port number
const port = process.env.PORT;

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
