import mongoose from "mongoose";

const schema = mongoose.Schema;
const ObjectID = schema.ObjectId;

const user = new schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  mobile: { type: Number, unique: true },
  password: String,
});

const UserModel = mongoose.model("users", user);

export default UserModel;
