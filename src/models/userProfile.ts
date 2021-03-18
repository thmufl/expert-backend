import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import User, { IUser } from "./user";
import Organization, { IOrganization } from "./organization";
import skillSchema, { ISkill } from "./skill";

export interface IUserProfile extends Document {
  user: IUser;
  description: string;
  skills: ISkill[];
}

const userProfileSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
    unique: true,
    required: true
  },
  description: {
    type: String,
    max: 2048,
  },
  skills: [skillSchema]
});

export const validate = (profile: IUserProfile) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    description: Joi.string().max(2048),
    skills: Joi.array().max(50)
  });
  return schema.validate(profile);
};

export default mongoose.model<IUserProfile>("UserProfile", userProfileSchema);
