import { connect } from "mongoose";



export const connectToDb = async (): Promise<void> => {
  const dbUser = process.env.dbUser;
  const dbPass = process.env.dbPass;
  try
  {
    await connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.t9i2bmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    console.log("Database connection established successfully!");
  } catch (error)
  {
    console.error("Database connection failed:", error);
    throw error;
  }
};
