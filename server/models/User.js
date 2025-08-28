// import mongoose, { Connection, mongo } from "mongoose";
import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true },
  full_name: { type: String, required: true },
  username: { type: String, unique: true },

  bio: { type: String, default: "Hey there! I am using Pingup." },
  profile_picture: { type: String, default: "" },
  cover_photo: { type: String, default: "" },
  location: { type: String, default: "" },

  followers: [{ type: String, ref: 'User' }],
  following:  [{ type: String, ref: 'User' }],
  connections:  [{ type: String, ref: 'User' }],

},{timestamps:true, minimize:false});


const User =mongoose.model('User',userShema)



export default User
