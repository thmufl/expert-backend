import config from "config";
import jwt from "jsonwebtoken";
import Joi from "Joi";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  generateAuthToken: any;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function <IUser>() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

export const validate = (user: IUser) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean()
  });
  return schema.validate(user);
};

export default mongoose.model<IUser>("User", userSchema);
