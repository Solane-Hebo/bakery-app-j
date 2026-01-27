import mongoose, { Schema } from "mongoose";

const SaleSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productNameSnapshot: { type: String, required: true }, // snapshot (om namn ändras senare)
    unitPriceSnapshot: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Sale = mongoose.models.Sale || mongoose.model("Sale", SaleSchema)
