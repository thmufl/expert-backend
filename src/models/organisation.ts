import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import User, { IUser } from "./user";

export interface IOrganisation extends Document {
  name: string;
  description: string;
  visibility: string;
  members: IUser[];
  suborganisations: IOrganisation[];
}

const organisationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 128,
  },
  description: {
    type: String,
    max: 2048,
  },
  members: [{
    type: mongoose.Types.ObjectId,
    ref: User
  }],
  suborganisations: [{
    type: mongoose.Types.ObjectId,
    ref: "Organisation"
  }],
  visibility: {
    type: String,
    enum: ["public", "private", "protected"],
    required: [true, "public"],
  },
});

export const validate = (organisation: IOrganisation) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(128).required(),
    description: Joi.string().max(2048),
    members: Joi.array().max(1e6),
    suborganisations: Joi.array().max(50),
    visibility: Joi.string().required().valid("public", "protected", "private")
  });
  return schema.validate(organisation);
};

export default mongoose.model<IOrganisation>(
  "Organisation",
  organisationSchema
);
