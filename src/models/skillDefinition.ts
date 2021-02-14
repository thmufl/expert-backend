import mongoose, { Schema, Document } from "mongoose";
import { IPerson } from "./person";

export interface ISkillDefinition extends Document {
  name: string;
  description: string;
  creator: IPerson;
}

const skillDefinitionSchema = new Schema({
  name: {
    type: String,
    min: 5,
    max: 255,
    unique: true
  },
  description: {
    type: String,
    max: 2048
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "Person"
  }
});

export default mongoose.model<ISkillDefinition>("SkillDefinition", skillDefinitionSchema);
