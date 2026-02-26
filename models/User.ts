import mongoose, { model, models } from "mongoose";

const userSchema = new mongoose.Schema({
    name:  { type : String, required:true },
    email:  { type : String, required:true, unique:true, lowercase: true },
    password: {type: String, required: true},
    avatar: { type: String, default: ""}, 
    role: {
        type: String,
        enum: ["viewer", "admin", "staff"],
        default: "staff",
        required: true
    },
    isActive: { type: Boolean, default: true},
    passwordChangedAt: {
        type: Date,
      }     
}, { timestamps: true})
  
 const User = mongoose.models.User || mongoose.model('User', userSchema);
 export default User