import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour expiration
  },
});

// Create TTL index
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

export default ResetToken;
