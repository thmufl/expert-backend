import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import User, { IUser } from "./user";

export interface ISkillDefinition extends Document {
  name: string;
  description: string;
  creator: IUser;
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
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: User
  }
});

export const validate = (skillDef: ISkillDefinition) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().max(2048),
    createdBy: Joi.string().required()
  });
  return schema.validate(skillDef);
};

export default mongoose.model<ISkillDefinition>("SkillDefinition", skillDefinitionSchema);
