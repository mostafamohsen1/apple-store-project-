const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test email connection
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email service connected and ready');
    return true;
  } catch (error) {
    console.error('Email service connection error:', error);
    return false;
  }
};

// Base email template
const createEmailTemplate = (content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Apple Store</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .logo {
          width: 40px;
          height: auto;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #6e6e73;
        }
        .button {
          display: inline-block;
          background-color: #0071e3;
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          margin: 20px 0;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        .product-item {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }
        .product-image {
          width: 100%;
          max-width: 150px;
          height: auto;
        }
        .price {
          font-weight: bold;
          color: #1d1d1f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg" alt="Apple Logo" class="logo">
        </div>
        
        ${content}
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Apple Store. All rights reserved.</p>
          <p>
            <a href="#">Privacy Policy</a> | 
            <a href="#">Terms of Use</a> | 
            <a href="#">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send email
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Apple Store'}" <${process.env.EMAIL_FROM || 'noreply@applestore.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  // Welcome email
  sendWelcomeEmail: async (user) => {
    const content = `
      <h2>Welcome to Apple Store, ${user.firstName}!</h2>
      <p>Thank you for creating an account with us. You now have access to the latest Apple products and exclusive offers.</p>
      <p>Start shopping now to explore our wide range of products:</p>
      <a href="${process.env.WEBSITE_URL}" class="button">Shop Now</a>
    `;

    return sendEmail({
      email: user.email,
      subject: 'Welcome to Apple Store!',
      html: createEmailTemplate(content)
    });
  },

  // Order confirmation
  sendOrderConfirmation: async (user, order) => {
    let itemsList = '';
    order.items.forEach(item => {
      itemsList += `
        <div class="product-item">
          <img src="${item.image}" alt="${item.name}" class="product-image">
          <h3>${item.name}</h3>
          <p>${item.color ? `Color: ${item.color.name}` : ''} ${item.storage ? `Storage: ${item.storage}` : ''}</p>
          <p>Quantity: ${item.quantity}</p>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
      `;
    });

    const content = `
      <h2>Thank you for your order, ${user.firstName}!</h2>
      <p>Your order #${order._id} has been confirmed and is being processed.</p>
      
      <h3>Order Summary</h3>
      <div class="product-grid">
        ${itemsList}
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
        <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> $${order.shippingPrice.toFixed(2)}</p>
        <p><strong>Tax:</strong> $${order.taxPrice.toFixed(2)}</p>
        <p style="font-size: 18px;"><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
      </div>
      
      <h3>Shipping Information</h3>
      <p>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>
      
      <a href="${process.env.WEBSITE_URL}/orders/${order._id}" class="button">View Order Details</a>
    `;

    return sendEmail({
      email: user.email,
      subject: `Your Apple Store Order Confirmation #${order._id}`,
      html: createEmailTemplate(content)
    });
  },

  // Shipping confirmation
  sendShippingConfirmation: async (user, order) => {
    const content = `
      <h2>Your order has shipped!</h2>
      <p>Good news, ${user.firstName}! Your order #${order._id} is on its way.</p>
      
      <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
      <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
      
      <a href="${process.env.WEBSITE_URL}/orders/${order._id}" class="button">Track Your Order</a>
    `;

    return sendEmail({
      email: user.email,
      subject: `Your Apple Store Order #${order._id} Has Shipped`,
      html: createEmailTemplate(content)
    });
  },

  // Password reset
  sendPasswordResetEmail: async (user, resetToken) => {
    const resetUrl = `${process.env.WEBSITE_URL}/reset-password/${resetToken}`;
    
    const content = `
      <h2>Reset Your Password</h2>
      <p>You requested a password reset for your Apple Store account.</p>
      <p>Click the button below to set a new password. This link is valid for 10 minutes.</p>
      
      <a href="${resetUrl}" class="button">Reset Password</a>
      
      <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
    `;

    return sendEmail({
      email: user.email,
      subject: 'Reset Your Apple Store Password',
      html: createEmailTemplate(content)
    });
  },

  // Abandoned cart reminder
  sendAbandonedCartReminder: async (user, cart) => {
    let itemsList = '';
    cart.items.forEach(item => {
      itemsList += `
        <div class="product-item">
          <img src="${item.image}" alt="${item.name}" class="product-image">
          <h3>${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
      `;
    });

    const content = `
      <h2>Your cart is waiting, ${user.firstName}</h2>
      <p>We noticed you left some items in your cart. Ready to complete your purchase?</p>
      
      <div class="product-grid">
        ${itemsList}
      </div>
      
      <a href="${process.env.WEBSITE_URL}/cart" class="button">Complete Your Purchase</a>
    `;

    return sendEmail({
      email: user.email,
      subject: 'Your Apple Store Cart is Waiting',
      html: createEmailTemplate(content)
    });
  },

  // Price drop alert
  sendPriceDropAlert: async (user, product, oldPrice, newPrice) => {
    const priceDifference = oldPrice - newPrice;
    const percentageDrop = Math.round((priceDifference / oldPrice) * 100);
    
    const content = `
      <h2>Price Drop Alert!</h2>
      <p>Good news, ${user.firstName}! An item on your wishlist has dropped in price.</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <img src="${product.images[0].url}" alt="${product.name}" style="max-width: 200px;">
        <h3>${product.name}</h3>
        <p><span style="text-decoration: line-through; color: #86868b;">$${oldPrice.toFixed(2)}</span> <span style="color: #0071e3; font-weight: bold; font-size: 18px;">$${newPrice.toFixed(2)}</span></p>
        <p>You save $${priceDifference.toFixed(2)} (${percentageDrop}%)</p>
      </div>
      
      <a href="${process.env.WEBSITE_URL}/products/${product._id}" class="button">Shop Now</a>
    `;

    return sendEmail({
      email: user.email,
      subject: `Price Drop: ${product.name}`,
      html: createEmailTemplate(content)
    });
  },

  // Review request
  sendReviewRequest: async (user, order) => {
    let itemsList = '';
    order.items.forEach(item => {
      itemsList += `
        <div class="product-item">
          <img src="${item.image}" alt="${item.name}" class="product-image">
          <h3>${item.name}</h3>
          <a href="${process.env.WEBSITE_URL}/products/${item.product}/review" style="display: block; margin-top: 10px; color: #0071e3; text-decoration: none;">Write a Review</a>
        </div>
      `;
    });

    const content = `
      <h2>How was your Apple purchase?</h2>
      <p>Hello ${user.firstName}, we hope you're enjoying your recent Apple purchase.</p>
      <p>We'd love to hear your thoughts! Please take a moment to review the products you purchased:</p>
      
      <div class="product-grid">
        ${itemsList}
      </div>
      
      <p>Thank you for helping us improve our products and services!</p>
    `;

    return sendEmail({
      email: user.email,
      subject: 'Share Your Feedback on Your Recent Apple Purchase',
      html: createEmailTemplate(content)
    });
  }
};

module.exports = {
  verifyConnection,
  sendEmail,
  ...emailTemplates
}; 