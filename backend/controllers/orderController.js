import Order from '../models/Order.js';

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'id name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if admin or owner
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;

  const validStatuses = ['Order Received', 'In Kitchen', 'Sent To Delivery', 'Delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'id name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Trigger Socket.io real-time updates
    const io = req.app.get('io');
    if (io) {
      // 1. Emit specific status update to user order-tracking page
      io.emit(`orderStatus_${order._id}`, { status: order.status });
      // 2. Emit global order status update for Admin dashboards
      io.emit('orderUpdated', order);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
