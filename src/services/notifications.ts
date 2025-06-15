
import { NotificationConfig, OrderNotificationData } from '@/types/notifications';

// Email notification using EmailJS
export const sendEmailNotification = async (
  to: string,
  subject: string,
  message: string,
  config: NotificationConfig
): Promise<boolean> => {
  if (!config.emailEnabled) {
    console.log('Email notifications disabled');
    return false;
  }

  try {
    // Import EmailJS dynamically
    const emailjs = await import('@emailjs/browser');
    
    // Initialize EmailJS with public key (if configured)
    if (config.emailjsPublicKey) {
      emailjs.default.init(config.emailjsPublicKey);
    }

    // Send email using EmailJS
    const templateParams = {
      to_email: to,
      subject: subject,
      message: message,
      from_name: 'Mokoni Store'
    };

    if (config.emailjsServiceId && config.emailjsTemplateId) {
      await emailjs.default.send(
        config.emailjsServiceId,
        config.emailjsTemplateId,
        templateParams
      );
      console.log(`Email sent successfully to: ${to}`);
      return true;
    } else {
      // Fallback: Create mailto link for manual sending
      const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      console.log(`Email configuration incomplete. Manual email: ${mailtoLink}`);
      return false;
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// WhatsApp notification using WhatsApp Business API or wa.me links
export const sendWhatsAppNotification = async (
  phone: string,
  message: string,
  config: NotificationConfig
): Promise<boolean> => {
  if (!config.whatsappEnabled || !config.adminWhatsapp) {
    console.log('WhatsApp notifications disabled or no admin number');
    return false;
  }

  try {
    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    
    // For now, we'll use wa.me links as it's the most reliable method
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log(`WhatsApp notification prepared for ${cleanPhone}:`, message);
    console.log(`WhatsApp URL: ${whatsappUrl}`);
    
    // In a real implementation with WhatsApp Business API, you'd make an HTTP request here
    // For now, we'll just log the notification
    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
};

// Enhanced order notification handler
export const sendOrderNotification = async (
  orderData: OrderNotificationData,
  config: NotificationConfig
): Promise<void> => {
  const orderDate = new Date().toLocaleString();
  const emailSubject = `🛒 New Order #${orderData.orderId.slice(0, 8)} - Mokoni Store`;
  
  const emailMessage = `
🎉 NEW ORDER RECEIVED!

📋 Order Details:
• Order ID: #${orderData.orderId.slice(0, 8)}
• Customer: ${orderData.customerName}
• Total Amount: $${orderData.total.toFixed(2)}
• Status: ${orderData.status.toUpperCase()}
• Date: ${orderDate}

📦 Items Ordered:
${orderData.items.map(item => 
  `• ${item.name} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

💰 Order Summary:
• Subtotal: $${orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
• Total: $${orderData.total.toFixed(2)}

🚀 Next Steps:
Please check your admin panel to process this order and update the customer on shipping details.

---
Mokoni Store Management System
  `.trim();

  // Send email notification
  if (config.emailEnabled && config.adminEmail) {
    const emailSent = await sendEmailNotification(config.adminEmail, emailSubject, emailMessage, config);
    if (emailSent) {
      console.log('✅ Order email notification sent successfully');
    } else {
      console.log('❌ Failed to send order email notification');
    }
  }

  // Send WhatsApp notification
  if (config.whatsappEnabled && config.adminWhatsapp) {
    const whatsappMessage = `🛒 *New Order Alert!*

Order #${orderData.orderId.slice(0, 8)}
💰 Total: $${orderData.total.toFixed(2)}
📦 Items: ${orderData.items.length}
👤 Customer: ${orderData.customerName}
🕐 Time: ${orderDate}

Check your admin panel for details! 🚀`;

    const whatsappSent = await sendWhatsAppNotification(config.adminWhatsapp, whatsappMessage, config);
    if (whatsappSent) {
      console.log('✅ Order WhatsApp notification prepared successfully');
    } else {
      console.log('❌ Failed to prepare WhatsApp notification');
    }
  }
};

// Order status update notification
export const sendOrderStatusNotification = async (
  orderId: string,
  newStatus: string,
  customerEmail: string,
  config: NotificationConfig
): Promise<void> => {
  const statusDate = new Date().toLocaleString();
  const subject = `📦 Order Status Update #${orderId.slice(0, 8)} - ${newStatus.toUpperCase()}`;
  
  const adminMessage = `
📦 ORDER STATUS UPDATED

Order #${orderId.slice(0, 8)} status changed to: ${newStatus.toUpperCase()}
Updated at: ${statusDate}

Please review the order in your admin panel for next steps.
  `.trim();

  // Notify admin
  if (config.emailEnabled && config.adminEmail) {
    await sendEmailNotification(
      config.adminEmail,
      `Admin: ${subject}`,
      adminMessage,
      config
    );
  }

  // WhatsApp notification for admin
  if (config.whatsappEnabled && config.adminWhatsapp) {
    const whatsappMessage = `📦 *Order Status Update*

Order #${orderId.slice(0, 8)}
Status: ${newStatus.toUpperCase()}
Time: ${statusDate}

Check admin panel for details! 📋`;

    await sendWhatsAppNotification(config.adminWhatsapp, whatsappMessage, config);
  }

  console.log(`Status update notification sent for order ${orderId}: ${newStatus}`);
};
