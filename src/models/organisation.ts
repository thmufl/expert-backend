import mongoose, { Schema, Document } from "mongoose";
import { IPerson } from "./person";

export interface IOrganisation extends Document {
  name: string;
  description: string;
  visibility: string;
  members: Object[];
  suborganisations: IOrganisation[];
}

const organisationSchema: Schema = new Schema({
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
  members: [{
    type: mongoose.Types.ObjectId,
    ref: "Person"
  }],
  suborganisations: [{
    type: mongoose.Types.ObjectId,
    ref: "Organisation"
  }],
});

export default mongoose.model<IOrganisation>(
  "Organisation",
  organisationSchema
);
