import mongoose from "mongoose";

let dbConnection = null;

export const connectDB = async () => {
  if (dbConnection) return dbConnection;
  
  try {
    dbConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${dbConnection.connection.host}`);
    return dbConnection;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't crash in serverless environments - routes will handle it
    // Return null to indicate DB is unavailable
    return null;
  }
};

export const getDbConnection = () => dbConnection;
