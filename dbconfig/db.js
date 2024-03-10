import mongoose from "mongoose";
import colors from "colors";

const conn = async () => {
  try {
    const isconnected = await mongoose.connect(process.env.MONGOURI);
    console.log("Successfully connected to the database".bgGreen);
  } catch (error) {
    console.log(error.bgRed);
  }
};

export default conn;
