import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add ingredient name'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please add ingredient type'],
      enum: ['base', 'sauce', 'cheese', 'veg'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    threshold: {
      type: Number,
      required: [true, 'Please add low stock threshold alert level'],
      min: [0, 'Threshold cannot be negative'],
      default: 10,
    },
    price: {
      type: Number,
      required: [true, 'Please add price'],
      min: [0, 'Price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
