import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import User, { IUser } from "./user";
import Organisation, { IOrganisation } from "./organisation";
import skillSchema, { ISkill } from "./skill";

export interface IUserProfile extends Document {
  user: IUser;
  description: string;
  skills: ISkill[];
  organisations: IOrganisation[];
  visibility: string;
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
  skills: [skillSchema],
  organisations: [{
    type: mongoose.Types.ObjectId,
    ref: Organisation,
    unique: true
  }],
  visibility: {
    type: String,
    enum: ["public", "private", "protected"],
    required: [true, "public"],
    default: "public"
  }
});

export const validate = (profile: IUserProfile) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    description: Joi.string().max(2048),
    skills: Joi.array().max(50),
    organisations: Joi.array().max(50),
    visibility: Joi.string().required().valid("public", "protected", "private")
  });
  return schema.validate(profile);
};

export default mongoose.model<IUserProfile>("UserProfile", userProfileSchema);
