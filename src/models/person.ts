import mongoose, { Schema, Document } from "mongoose";
import skillSchema, { ISkill } from "./skill";

export interface IPerson extends Document {
  name: string;
  description: string;
  visibility: string;
  email: string;
  skills: ISkill[];
}

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 255,
  },
  description: {
    type: String,
    max: 2048,
  },
  visibility: {
    type: String,
    enum: ["public", "private", "protected"],
    required: [true, "public"],
  },
  email: {
    type: String,
    max: 1024,
    required: true
  },
  skills: [skillSchema]
});

export default mongoose.model<IPerson>("Person", personSchema);
