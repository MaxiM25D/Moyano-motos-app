import mongoose from "mongoose";
 
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});
 
const shippingSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  zip_code: { type: String, required: true },
  notes: { type: String, default: "" }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  provider: { type: String, default: "mercadopago" },
  preference_id: { type: String, default: null },
  payment_id: { type: String, default: null },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled", "refunded"],
    default: "pending"
  },
  status_detail: { type: String, default: null },
  updated_at: { type: Date, default: null }
}, { _id: false });
 
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [orderItemSchema],
  shipping: shippingSchema,
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  payment: { type: paymentSchema, default: () => ({}) },
  stock_status: {
    type: String,
    enum: ["reserved", "committed", "released"],
    default: "reserved"
  },
  stock_expires_at: { type: Date, default: null },
  payment_id: { type: String, default: null } // Compatibilidad con ordenes anteriores.
}, { timestamps: true });
 
export const Order = mongoose.model("Order", orderSchema);
