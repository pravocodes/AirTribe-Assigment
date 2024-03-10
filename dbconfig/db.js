// Import necessary modules and dependencies
import mongoose from "mongoose";
import colors from "colors";

// Function to establish connection to MongoDB database
const connectToDatabase = async () => {
  try {
    // Attempt to connect to the MongoDB database using the provided URI
    const isConnected = await mongoose.connect(process.env.MONGOURI);

    // Log success message if connection is successful
    console.log("Successfully connected to the database".bgGreen);
  } catch (error) {
    // Log error message if connection fails
    console.log(error.bgRed);
  }
};

// Export the connection function
export default connectToDatabase;
