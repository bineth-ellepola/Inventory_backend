import mongoose from "mongoose";

const labelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },          // actual stock
    pendingQuantity: { type: Number, default: 0 },   // waiting to be processed
    type: { type: String, required: true },
    status: { type: String, default: "pending" }     // pending | processed
  },
  { timestamps: true }
);


export default mongoose.model("Label", labelSchema);
