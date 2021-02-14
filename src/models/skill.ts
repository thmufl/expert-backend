import mongoose, { Schema, Document } from "mongoose";
import { ISkillDefinition } from "./skillDefinition";
import { IPerson } from "./person";

export interface ISkill extends Document {
  definition: ISkillDefinition;
  owner: IPerson;
  confirmedBy: IPerson[];
}

const skillSchema: Schema = new Schema({
  definition: {
    type: mongoose.Types.ObjectId,
    ref: "SkillDefinition",
    required: true,
  },
  confirmedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Person",
    },
  ],
});

export default skillSchema;
