import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import User, { IUser } from "./user";
import membershipSchema, { IMembership } from "./membership";
import skillDefinition, { skillDefinitionSchema, ISkillDefinition } from "./skillDefinition";

export interface IOrganization extends Document {
  name: string;
  description: string;
  skillDefinitions: ISkillDefinition[];
}

const organizationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 128,
  },
  //members: [membershipSchema],
  skillDefinitions: [skillDefinitionSchema],
});

export const validate = (organization: IOrganization) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(128).required(),
    //members: Joi.array().max(1e6),
    skillDefinitions: Joi.array().max(1e3),
  });
  return schema.validate(organization);
};

export default mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);
