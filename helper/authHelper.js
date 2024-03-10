// Import necessary modules and dependencies
import bcrypt from "bcrypt";

// Function to hash the provided password using bcrypt
export const hashedPassword = async (Password) => {
  try {
    // Set the number of salt rounds for bcrypt
    const saltRounds = 10;

    // Generate hashed password using bcrypt
    const hashPassword = await bcrypt.hash(Password, saltRounds);

    // Return the hashed password
    return hashPassword;
  } catch (error) {
    // Log error if hashing fails
    console.log("Error in password hashing", error);
  }
};

// Function to compare the provided password with the hashed password
export const comparePassword = async (password, hashedPassword) => {
  // Use bcrypt to compare the provided password with the hashed password
  return bcrypt.compare(password, hashedPassword);
};
