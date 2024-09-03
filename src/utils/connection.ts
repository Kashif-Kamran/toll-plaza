import { connect } from "mongoose";

export const connectToDb = async (): Promise<void> => {
  try
  {
    await connect(`mongodb+srv://${'kashif_new'}:${'kashifkam'}@cluster0.t9i2bmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    console.log("Database connection established successfully!");
  } catch (error)
  {
    console.error("Database connection failed:", error);
    throw error;
  }
};
