const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderConfirmation = async (userEmail, orderData) => {
  const itemsList = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">₹ ${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Order Confirmed - #${orderData._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 30px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; margin: 0;">Valli Vilas</h1>
          <p style="color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Fragrance of God</p>
        </div>
        
        <h2 style="color: #333 text-align: center;">Order Confirmed!</h2>
        <p>Namaste,</p>
        <p>Thank you for your order. We've received your request and are preparing your divine fragrances for shipment.</p>
        
        <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #8B4513;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; color: #666; font-size: 12px; text-transform: uppercase;">
                <th style="padding: 10px;">Item</th>
                <th style="padding: 10px;">Qty</th>
                <th style="padding: 10px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; font-weight: bold; color: #8B4513;">₹ ${orderData.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #8B4513;">Shipping Address</h3>
          <p style="margin: 0; font-size: 14px;">${orderData.shippingAddress.name}</p>
          <p style="margin: 0; font-size: 14px;">${orderData.shippingAddress.street}</p>
          <p style="margin: 0; font-size: 14px;">${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.zipCode}</p>
          <p style="margin: 0; font-size: 14px;">Phone: ${orderData.shippingAddress.phone}</p>
        </div>
        
        <p style="font-size: 14px; color: #666;">Track your order status anytime by logging into your account at Valli Vilas.</p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
          <p>Valli Vilas - Handmade Natural Incense & Fragrances</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

const sendAdminOrderNotification = async (orderData, userDetails) => {
  const itemsList = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">₹ ${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Admin receives the mail
    subject: `NEW ORDER - #${orderData._id.toString().slice(-6).toUpperCase()} - ${userDetails.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #8B4513;">New Order Received!</h2>
        <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Customer Details (Form Info)</h3>
          <p><strong>Name:</strong> ${orderData.shippingAddress.name || userDetails.name}</p>
          <p><strong>Email:</strong> ${orderData.shippingAddress.email || userDetails.email}</p>
          <p><strong>Phone:</strong> ${orderData.shippingAddress.phone}</p>
          <p><strong>Address:</strong> ${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.zipCode}</p>
        </div>

        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f0f0f0; text-align: left;">
              <th style="padding: 8px;">Item</th>
              <th style="padding: 8px;">Qty</th>
              <th style="padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Earnings:</td>
              <td style="padding: 10px; font-weight: bold; color: #d97706;">₹ ${orderData.totalAmount}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="margin-top: 20px;"><strong>Payment ID:</strong> ${orderData.razorpayPaymentId}</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:8080/admin/orders" style="background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order in Dashboard</a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent');
    return true;
  } catch (error) {
    console.error('Admin notification failed:', error);
    return false;
  }
};

const sendProductUpdate = async (recipients, product) => {
  // Logic for broadcasting new product updates
  // This could use a loop or BCC for multiple users
};

module.exports = { sendOrderConfirmation, sendAdminOrderNotification, sendProductUpdate };
