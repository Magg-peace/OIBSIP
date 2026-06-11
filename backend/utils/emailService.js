import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: parseInt(process.env.EMAIL_PORT || '587') === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to send emails
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Slice & Dice Pizza" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // If EMAIL_USER contains placeholder, fallback to console log to prevent crashes
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('replace_with')) {
      console.log('\n================== MOCK EMAIL SENT ==================');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      const linkMatch = options.html.match(/href="([^"]+)"/);
      if (linkMatch) console.log(`Action Link: ${linkMatch[1]}`);
      console.log('=====================================================\n');
      return { messageId: `mock-id-${Date.now()}` };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Return mock ID so the app doesn't break if SMTP fails
    return { messageId: `mock-id-${Date.now()}` };
  }
};

// 1. Send Verification Email
export const sendVerificationEmail = async (email, name, token) => {
  let baseUrl = process.env.FRONTEND_URL;
  if (!baseUrl || baseUrl === 'null' || baseUrl === 'undefined') baseUrl = 'http://localhost:5173';
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.05em;">SLICE & DICE PIZZA</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Verify your email to start building your pizza</p>
      </div>
      <div style="background-color: #1e293b; padding: 30px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="font-size: 20px; color: #ffffff; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="color: #cbd5e1; line-height: 1.6; font-size: 15px;">Thank you for registering. To activate your account, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #f97316; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">Verify Email Address</a>
        </div>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">If the button doesn't work, copy and paste this link in your browser:</p>
        <p style="color: #f97316; font-size: 13px; word-break: break-all;"><a href="${verificationLink}" style="color: #f97316;">${verificationLink}</a></p>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Slice & Dice Pizza. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify your email - Slice & Dice Pizza',
    html,
  });
};

// 2. Send Reset Password Email
export const sendResetPasswordEmail = async (email, name, token) => {
  let baseUrl = process.env.FRONTEND_URL;
  if (!baseUrl || baseUrl === 'null' || baseUrl === 'undefined') baseUrl = 'http://localhost:5173';
  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.05em;">SLICE & DICE PIZZA</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Reset your password securely</p>
      </div>
      <div style="background-color: #1e293b; padding: 30px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="font-size: 20px; color: #ffffff; margin-top: 0;">Hi ${name},</h2>
        <p style="color: #cbd5e1; line-height: 1.6; font-size: 15px;">You requested a password reset. Click the button below to set a new password. This link is valid for 1 hour:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #f97316; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">If you did not request a password reset, you can safely ignore this email.</p>
        <p style="color: #f97316; font-size: 13px; word-break: break-all;"><a href="${resetLink}" style="color: #f97316;">${resetLink}</a></p>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Slice & Dice Pizza. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset your password - Slice & Dice Pizza',
    html,
  });
};

// 3. Send Order Confirmation Email
export const sendOrderConfirmationEmail = async (email, name, order) => {
  const itemsList = order.items.map(item => `
    <tr style="border-bottom: 1px solid #334155;">
      <td style="padding: 12px 0; color: #ffffff;">
        <div style="font-weight: 600;">Custom Pizza (${item.base})</div>
        <div style="font-size: 12px; color: #94a3b8;">
          Sauce: ${item.sauce} | Cheese: ${item.cheese}<br/>
          Veg: ${item.vegetables.length > 0 ? item.vegetables.join(', ') : 'None'}
        </div>
      </td>
      <td style="padding: 12px 0; text-align: center; color: #cbd5e1;">x${item.quantity}</td>
      <td style="padding: 12px 0; text-align: right; color: #f97316; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.05em;">SLICE & DICE PIZZA</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Order Confirmation & Receipt</p>
      </div>
      <div style="background-color: #1e293b; padding: 30px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="font-size: 20px; color: #4ade80; margin-top: 0;">Order Confirmed!</h2>
        <p style="color: #cbd5e1; line-height: 1.6; font-size: 15px;">Thank you for your order. We have received it and our chefs are already prepping the oven. Your Order ID is: <strong style="color: #ffffff;">${order._id}</strong></p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #475569; color: #94a3b8; font-size: 12px; text-transform: uppercase;">
              <th style="padding: 8px 0; text-align: left;">Item Details</th>
              <th style="padding: 8px 0; text-align: center;">Qty</th>
              <th style="padding: 8px 0; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div style="margin-top: 20px; border-top: 2px solid #475569; padding-top: 15px;">
          <div style="display: flex; justify-content: space-between; color: #cbd5e1; font-size: 14px; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span style="float: right;">₹${order.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #cbd5e1; font-size: 14px; margin-bottom: 5px;">
            <span>Tax (5% GST):</span>
            <span style="float: right;">₹${order.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #cbd5e1; font-size: 14px; margin-bottom: 10px;">
            <span>Delivery Fee:</span>
            <span style="float: right;">₹${order.deliveryFee.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #ffffff; font-size: 18px; font-weight: 700; border-top: 1px dashed #475569; padding-top: 10px;">
            <span>Total Paid:</span>
            <span style="float: right; color: #f97316;">₹${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div style="margin-top: 35px; border-top: 1px solid #334155; padding-top: 20px;">
          <h3 style="color: #ffffff; font-size: 14px; margin-bottom: 8px;">Delivery Address:</h3>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">
            ${order.shippingAddress.address}, ${order.shippingAddress.city}<br/>
            Postal Code: ${order.shippingAddress.postalCode}<br/>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Slice & Dice Pizza. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Order Confirmed #${order._id} - Slice & Dice Pizza`,
    html,
  });
};

// 4. Send Low Stock Alert Email
export const sendLowStockAlertEmail = async (items) => {
  const itemsTable = items.map(item => `
    <tr style="border-bottom: 1px solid #ef4444;">
      <td style="padding: 12px; color: #ffffff; font-weight: 600;">${item.name}</td>
      <td style="padding: 12px; text-align: center; color: #ef4444; font-weight: bold;">${item.quantity}</td>
      <td style="padding: 12px; text-align: center; color: #94a3b8;">${item.threshold}</td>
      <td style="padding: 12px; text-align: center; color: #cbd5e1; text-transform: uppercase;">${item.type}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #ef4444;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ef4444; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.05em;">INVENTORY ALERT</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Low Stock Warning - Actions Required</p>
      </div>
      <div style="background-color: #1e293b; padding: 30px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">Attention Pizza Admin,</h2>
        <p style="color: #cbd5e1; line-height: 1.6; font-size: 14px;">The following ingredients have fallen below their configured stock threshold levels. Please replenish inventory to avoid ordering disruptions:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #ef4444; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 8px; text-align: left;">Ingredient</th>
              <th style="padding: 8px; text-align: center; color: #ef4444;">Current Stock</th>
              <th style="padding: 8px; text-align: center;">Min Threshold</th>
              <th style="padding: 8px; text-align: center;">Type</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTable}
          </tbody>
        </table>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Slice & Dice Pizza. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: '⚠️ INVENTORY WARNING: Low Stock Alert - Slice & Dice Pizza',
    html,
  });
};

// 5. Send Newsletter Welcome Email
export const sendNewsletterWelcomeEmail = async (email) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.05em;">PIZZAHUB</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Welcome to the family! 🍕</p>
      </div>
      <div style="background-color: #1e293b; padding: 30px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="font-size: 20px; color: #ffffff; margin-top: 0;">You're on the list!</h2>
        <p style="color: #cbd5e1; line-height: 1.6; font-size: 15px;">Thank you for subscribing to the PizzaHub newsletter. You will now be the first to know about our special offers, seasonal pizza drops, and behind-the-scenes kitchen secrets.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f97316; color: #ffffff; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">Stay tuned for delicious updates!</div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} PizzaHub. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to the PizzaHub Newsletter! 🍕',
    html,
  });
};
