import mongoose, { Schema, models, model } from "mongoose";

const RawMaterialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      enum: ["kg", "g", "l", "ml", "pcs"],
    },

    minLevel: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["ok", "low", "out"],
      default: "ok",
    },

    actionRequired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-calculate status before save
RawMaterialSchema.pre("save", function () {
  if (this.stock === 0) {
    this.status = "out";
    this.actionRequired = true;
  } else if (this.stock <= this.minLevel) {
    this.status = "low";
    this.actionRequired = true;
  } else {
    this.status = "ok";
    this.actionRequired = false;
  }

});

export default models.RawMaterial ||
  model("RawMaterial", RawMaterialSchema);
