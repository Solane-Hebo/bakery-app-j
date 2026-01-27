import mongoose, { Schema, model, models } from "mongoose";

const RecipeSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, 
    },
    ingredients: [
      {
        material: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RawMaterial",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        unit: {
          type: String,
          enum: ["kg", "g", "l", "ml", "pcs"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default models.Recipe || model("Recipe", RecipeSchema);
