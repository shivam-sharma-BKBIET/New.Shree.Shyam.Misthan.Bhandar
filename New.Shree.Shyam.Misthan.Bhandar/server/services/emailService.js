import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your gmail
    pass: process.env.EMAIL_PASS  // Your app password
  }
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"New Shree Shyam Misthan Bhandar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - New Shree Shyam Misthan Bhandar',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #e65100; text-align: center;">Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the OTP below to proceed. This code is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2d3436; background: #f9f9f9; padding: 10px 20px; border-radius: 5px; border: 1px dashed #e65100;">${otp}</span>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">New Shree Shyam Misthan Bhandar - Pure & Traditional Sweets</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendRegistrationOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"New Shree Shyam Misthan Bhandar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome! Verify Your Email - New Shree Shyam Misthan Bhandar',
    html: `
      <div style="font-family: 'Marcellus', serif; padding: 30px; border: 1px solid #d4af37; border-radius: 12px; max-width: 500px; margin: auto; background-color: #fffaf0;">
        <h2 style="color: #3e2723; text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Account Registration</h2>
        <p style="color: #5d4037; font-size: 16px;">Namaste! 🙏 Welcome to New Shree Shyam Misthan Bhandar.</p>
        <p style="color: #5d4037;">Use the OTP below to verify your email and complete your registration. This code is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #d4af37; background: #3e2723; padding: 15px 30px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">${otp}</span>
        </div>
        <p style="color: #5d4037; font-size: 14px; text-align: center;">If you didn't attempt to register, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #d4af37; margin: 20px 0;">
        <p style="font-size: 12px; color: #8d6e63; text-align: center;">New Shree Shyam Misthan Bhandar — Pure & Traditional Sweets 🍬</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (email, order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f1f2f6;">${item.name}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f1f2f6; text-align:center;">${item.quantity}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f1f2f6; text-align:right;">Rs. ${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"New Shree Shyam Misthan Bhandar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Order Confirmed! #${order.orderRef} - New Shree Shyam Misthan Bhandar`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #e65100, #ff8f00); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">🎉 Order Placed Successfully!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">New Shree Shyam Misthan Bhandar</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <p style="color: #2d3436; font-size: 16px;">Namaste! 🙏 Aapka order place ho gaya hai. Hum jald hi aapke payment ko verify karenge.</p>

          <!-- Order Info -->
          <div style="background: #fff8f0; border-left: 4px solid #e65100; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px; font-size: 13px; color: #636e72;">ORDER REFERENCE</p>
            <h2 style="margin: 0; color: #e65100; font-size: 22px;">#${order.orderRef}</h2>
          </div>

          <!-- Items Table -->
          <h3 style="color: #2d3436; border-bottom: 2px solid #f1f2f6; padding-bottom: 10px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f9f9f9;">
                <th style="padding: 10px 12px; text-align:left; color: #636e72; font-size:13px;">ITEM</th>
                <th style="padding: 10px 12px; text-align:center; color: #636e72; font-size:13px;">QTY</th>
                <th style="padding: 10px 12px; text-align:right; color: #636e72; font-size:13px;">PRICE</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; font-weight: bold; font-size: 16px; color: #2d3436;">Total</td>
                <td style="padding: 12px; font-weight: bold; font-size: 16px; color: #e65100; text-align:right;">Rs. ${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Delivery Address -->
          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px;">
            <p style="margin: 0 0 5px; font-size: 13px; color: #636e72;">📍 DELIVERY ADDRESS</p>
            <p style="margin: 0; color: #2d3436;">${order.address}</p>
          </div>

          ${order.specialInstructions ? `
          <div style="margin: 20px 0; padding: 15px; background: #fff8e1; border-radius: 8px; border: 1px solid #ffe082;">
            <p style="margin: 0 0 5px; font-size: 13px; color: #795548;">📝 SPECIAL INSTRUCTIONS</p>
            <p style="margin: 0; color: #2d3436;">${order.specialInstructions}</p>
          </div>` : ''}

          <!-- Status -->
          <div style="text-align: center; margin: 25px 0; padding: 20px; background: #fff3cd; border-radius: 10px;">
            <p style="margin: 0; font-size: 15px; color: #856404;">⏳ <strong>Payment verification pending</strong> — Admin will verify your UPI payment shortly.</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #2d3436; padding: 20px; text-align: center;">
          <p style="color: #b2bec3; margin: 0; font-size: 13px;">New Shree Shyam Misthan Bhandar — Pure & Traditional Sweets 🍬</p>
          <p style="color: #636e72; margin: 5px 0 0; font-size: 11px;">Agar koi sawaal ho toh humse contact karein.</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendPaymentVerifiedEmail = async (email, order) => {
  const mailOptions = {
    from: `"New Shree Shyam Misthan Bhandar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Payment Confirmed! #${order.orderRef} - New Shree Shyam Misthan Bhandar`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 26px;">✅ Payment Verified!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">New Shree Shyam Misthan Bhandar</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #2d3436;">Namaste! 🙏 Aapki payment confirm ho gayi hai. Hum aapka order tayar kar rahe hain!</p>
          <div style="background: #f0fff4; border-left: 4px solid #27ae60; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px; font-size: 13px; color: #636e72;">ORDER REFERENCE</p>
            <h2 style="margin: 0; color: #27ae60; font-size: 22px;">#${order.orderRef}</h2>
          </div>
          <div style="text-align: center; padding: 20px; background: #f9f9f9; border-radius: 10px; margin: 20px 0;">
            <p style="font-size: 28px; margin: 0;">🎉</p>
            <p style="font-size: 16px; color: #2d3436; margin: 10px 0 0;"><strong>Rs. ${order.totalAmount}</strong> — Payment Received</p>
            <p style="color: #27ae60; margin: 5px 0 0;">Aapka order pack ho raha hai!</p>
          </div>
          <p style="color: #636e72; font-size: 14px; text-align: center;">Delivery ki date aur samay jald hi confirm hogi.</p>
        </div>
        <div style="background: #2d3436; padding: 20px; text-align: center;">
          <p style="color: #b2bec3; margin: 0; font-size: 13px;">New Shree Shyam Misthan Bhandar — Pure & Traditional Sweets 🍬</p>
        </div>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};

export const sendPaymentRejectedEmail = async (email, order) => {
  const mailOptions = {
    from: `"New Shree Shyam Misthan Bhandar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `❌ Payment Issue - #${order.orderRef} - New Shree Shyam Misthan Bhandar`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #e53e3e, #fc8181); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 26px;">❌ Payment Not Received</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">New Shree Shyam Misthan Bhandar</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #2d3436;">Namaste! 🙏 Humein aapke order <strong>#${order.orderRef}</strong> ke liye payment receive nahi hui.</p>
          <div style="background: #fff5f5; border-left: 4px solid #e53e3e; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px; font-size: 13px; color: #636e72;">ORDER REFERENCE</p>
            <h2 style="margin: 0; color: #e53e3e; font-size: 22px;">#${order.orderRef}</h2>
            <p style="margin: 8px 0 0; color: #636e72;">Amount: Rs. ${order.totalAmount}</p>
          </div>
          <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffe082;">
            <p style="margin: 0; color: #795548; font-size: 14px;">⚠️ Agar aapne payment ki hai toh please apna UPI screenshot lekar humse contact karein. Hum turant check karenge.</p>
          </div>
        </div>
        <div style="background: #2d3436; padding: 20px; text-align: center;">
          <p style="color: #b2bec3; margin: 0; font-size: 13px;">New Shree Shyam Misthan Bhandar — Pure & Traditional Sweets 🍬</p>
        </div>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};
