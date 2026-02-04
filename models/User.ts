import mongoose, { model, models } from "mongoose";

const userSchema = new mongoose.Schema({
    name:  { type : String, required:true },
    email:  { type : String, required:true, unique:true, lowercase: true },
    password: {type: String, required: true},
    avatar: { type: String, default: ""}, 
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    passwordChangedAt: {
        type: Date,
      }
      

}, { timestamps: true})
  
 const User = mongoose.models.User || mongoose.model('User', userSchema);
 export default User