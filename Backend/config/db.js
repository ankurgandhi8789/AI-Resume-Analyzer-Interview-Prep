import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't crash the whole server in dev if DB isn't up yet -
    // auth + analysis routes that need it will fail gracefully instead.
    process.exitCode = 1;
  }
};
