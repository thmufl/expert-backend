import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    title: String,
    description: String,
    contractor: {

    },
    contractee: {

    }
  });
  
export default mongoose.model("Contract", contractSchema);