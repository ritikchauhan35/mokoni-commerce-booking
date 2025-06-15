
import { NotificationConfig, OrderNotificationData } from '@/types/notifications';

// Email notification using EmailJS (client-side email service)
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
    // Using fetch to send email via a simple email service
    // In production, you'd use EmailJS or similar service
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Placeholder for actual email implementation
    // Would integrate with EmailJS or Firebase Extensions
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// WhatsApp notification using WhatsApp Business API
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
    // For now, we'll use wa.me links for simplicity
    // In production, you'd use Twilio WhatsApp API
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    console.log(`WhatsApp notification prepared: ${whatsappUrl}`);
    
    // In a real implementation, you'd send via Twilio API
    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
};

// Order notification handler
export const sendOrderNotification = async (
  orderData: OrderNotificationData,
  config: NotificationConfig
): Promise<void> => {
  const emailSubject = `New Order #${orderData.orderId.slice(0, 8)}`;
  const message = `
New order received!

Order ID: #${orderData.orderId.slice(0, 8)}
Customer: ${orderData.customerName}
Total: $${orderData.total.toFixed(2)}
Status: ${orderData.status}

Items:
${orderData.items.map(item => `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Please check the admin panel for more details.
  `.trim();

  // Send email notification
  if (config.emailEnabled && config.adminEmail) {
    await sendEmailNotification(config.adminEmail, emailSubject, message, config);
  }

  // Send WhatsApp notification
  if (config.whatsappEnabled && config.adminWhatsapp) {
    const whatsappMessage = `🛒 New Order #${orderData.orderId.slice(0, 8)}\n💰 Total: $${orderData.total.toFixed(2)}\n📦 Items: ${orderData.items.length}\n\nCheck admin panel for details.`;
    await sendWhatsAppNotification(config.adminWhatsapp, whatsappMessage, config);
  }
};

// Order status update notification
export const sendOrderStatusNotification = async (
  orderId: string,
  newStatus: string,
  customerEmail: string,
  config: NotificationConfig
): Promise<void> => {
  const subject = `Order Status Update #${orderId.slice(0, 8)}`;
  const message = `Your order #${orderId.slice(0, 8)} status has been updated to: ${newStatus.toUpperCase()}`;

  // Notify admin
  if (config.emailEnabled && config.adminEmail) {
    await sendEmailNotification(
      config.adminEmail,
      `Admin: ${subject}`,
      `Order #${orderId.slice(0, 8)} status changed to: ${newStatus}`,
      config
    );
  }

  // In a full implementation, you'd also notify the customer
  console.log(`Customer notification: ${customerEmail} - ${subject}`);
};
