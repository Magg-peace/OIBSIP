import crypto from 'crypto';
import razorpayInstance from '../utils/razorpay.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { sendOrderConfirmationEmail, sendLowStockAlertEmail } from '../utils/emailService.js';

export const createPaymentOrder = async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  try {
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const payment = await Payment.create({
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      status: 'pending',
    });

    res.status(200).json({
      success: true,
      razorpayOrder,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    items,
    shippingAddress,
    subtotal,
    tax,
    deliveryFee,
    totalAmount,
  } = req.body;

  try {
    // Bypass signature check for demo/mock payments
    if (razorpaySignature !== 'mock_signature') {
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret');
      shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        await Payment.findOneAndUpdate({ razorpayOrderId }, { status: 'failed' });
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    }

    let payment;
    if (razorpaySignature === 'mock_signature') {
      payment = await Payment.create({
        user: req.user._id,
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
        amount: totalAmount,
        status: 'captured',
      });
    } else {
      payment = await Payment.findOneAndUpdate(
        { razorpayOrderId },
        {
          razorpayPaymentId: razorpayPaymentId,
          razorpaySignature: razorpaySignature,
          status: 'captured',
        },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment record not found' });
      }
    }

    const lowStockAlerts = [];

    // Deduct inventory items
    for (const item of items) {
      // Helper function to update inventory safely
      const updateInventory = async (name, type, qty) => {
        const invItem = await Inventory.findOne({ name, type });
        if (invItem) {
          const newQty = Math.max(0, invItem.quantity - qty);
          invItem.quantity = newQty;
          await invItem.save();
          if (newQty <= invItem.threshold) {
            lowStockAlerts.push(invItem);
          }
        }
      };

      await updateInventory(item.base, 'base', 1 * item.quantity);
      await updateInventory(item.sauce, 'sauce', 1 * item.quantity);
      await updateInventory(item.cheese, 'cheese', 1 * item.quantity);

      for (const vegName of item.vegetables) {
        await updateInventory(vegName, 'veg', 1 * item.quantity);
      }
    }

    if (lowStockAlerts.length > 0) {
      try {
        await sendLowStockAlertEmail(lowStockAlerts);
      } catch (err) {
        console.error('Failed to send low stock alert email:', err);
      }
    }

    // Create the final order
    const orderItems = items.map(item => ({
      base: item.base,
      sauce: item.sauce,
      cheese: item.cheese,
      vegetables: item.vegetables || [],
      price: item.price,
      quantity: item.quantity
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      shippingAddress,
      payment: payment._id,
      status: 'Order Received',
    });

    try {
      await sendOrderConfirmationEmail(req.user.email, req.user.name, order);
    } catch (err) {
      console.error('Failed to send order confirmation email:', err);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', {
        _id: order._id,
        user: { name: req.user.name, email: req.user.email },
        items: orderItems,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Payment verified and order placed successfully!',
      order: order,
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    next(error);
  }
};
