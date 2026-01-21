import mongoose, { Schema } from 'mongoose';

const StockMovementSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    type: { type: String, enum: ['IN', 'OUT', 'ADJUST'], required: true },
    quantity: { type: Number, required: true }, // + vid IN, - vid OUT, ADJUST kan vara +/- eller "newStock"
    note: { type: String, default: '' },
    // optional: spara snapshot efter ändring
    stockAfter: { type: Number, required: true },
  },
  { timestamps: true },
)

export const StockMovement =
  mongoose.models.StockMovement || mongoose.model('StockMovement', StockMovementSchema)
