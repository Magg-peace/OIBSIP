import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VerificationToken from '../models/VerificationToken.js';
import ResetToken from '../models/ResetToken.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const verificationTokenString = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
      userId: user._id,
      token: verificationTokenString,
    });

    await sendVerificationEmail(user.email, user.name, verificationTokenString);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const storedToken = await VerificationToken.findOne({ token });

    if (!storedToken) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      return res.status(400).json({ success: false, message: 'Verification token expired' });
    }

    const user = await User.findById(storedToken.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();
    await storedToken.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Your email address is not verified. Please verify your email before logging in.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id, // For frontend compatibility
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address' });
    }

    const resetTokenString = crypto.randomBytes(32).toString('hex');
    
    await ResetToken.create({
      userId: user._id,
      token: resetTokenString,
    });

    await sendResetPasswordEmail(user.email, user.name, resetTokenString);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const storedToken = await ResetToken.findOne({ token });

    if (!storedToken) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      return res.status(400).json({ success: false, message: 'Reset token expired' });
    }

    const user = await User.findById(storedToken.userId);
    user.password = password;
    await user.save();
    
    await storedToken.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
