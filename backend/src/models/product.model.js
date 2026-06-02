import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    index: true
  },

  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  subcategory: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: null
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  featuredOrder: {
    type: Number,
    default: 0
  },

  brand: {
    type: String,
    default: "LUNEK"
  },

  tags: {
    type: [String],
    default: []
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  stock: {
    type: Number,
    required: true,
    min: 0
  },

  images: {
    type: [String],
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);