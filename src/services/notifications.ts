import { NotificationConfig, OrderNotificationData } from '@/types/notifications';

// Enhanced email notification with better error handling and debugging
export const sendEmailNotification = async (
  to: string,
  subject: string,
  message: string,
  config: NotificationConfig
): Promise<{ success: boolean; message: string }> => {
  console.log('Attempting to send email notification:', { to, subject, emailEnabled: config.emailEnabled });
  
  if (!config.emailEnabled) {
    console.log('Email notifications disabled in config');
    return { success: false, message: 'Email notifications are disabled' };
  }

  if (!config.adminEmail) {
    console.log('Admin email not configured');
    return { success: false, message: 'Admin email not configured' };
  }

  try {
    // Check if EmailJS is fully configured
    if (!config.emailjsServiceId || !config.emailjsTemplateId || !config.emailjsPublicKey) {
      console.log('EmailJS configuration incomplete:', {
        serviceId: !!config.emailjsServiceId,
        templateId: !!config.emailjsTemplateId,
        publicKey: !!config.emailjsPublicKey
      });
      
      return { 
        success: false, 
        message: 'EmailJS configuration incomplete. Please check Service ID, Template ID, and Public Key in settings.' 
      };
    }

    // Import EmailJS dynamically
    console.log('Loading EmailJS library...');
    const emailjs = await import('@emailjs/browser');
    
    // Initialize EmailJS with public key
    console.log('Initializing EmailJS with public key...');
    emailjs.default.init(config.emailjsPublicKey);

    // Prepare template parameters
    const templateParams = {
      to_email: to,
      subject: subject,
      message: message,
      from_name: 'Mokoni Store',
      reply_to: config.adminEmail
    };

    console.log('Sending email with params:', templateParams);

    // Send email using EmailJS
    const response = await emailjs.default.send(
      config.emailjsServiceId,
      config.emailjsTemplateId,
      templateParams
    );

    console.log('EmailJS response:', response);
    return { success: true, message: 'Email sent successfully via EmailJS' };
    
  } catch (error) {
    console.error('EmailJS send error:', error);
    return { 
      success: false, 
      message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Enhanced WhatsApp notification with Twilio support
export const sendWhatsAppNotification = async (
  phone: string,
  message: string,
  config: NotificationConfig
): Promise<{ success: boolean; message: string; whatsappUrl?: string }> => {
  console.log('Attempting WhatsApp notification:', { phone, whatsappEnabled: config.whatsappEnabled });
  
  if (!config.whatsappEnabled) {
    console.log('WhatsApp notifications disabled');
    return { success: false, message: 'WhatsApp notifications are disabled' };
  }

  if (!config.adminWhatsapp) {
    console.log('Admin WhatsApp number not configured');
    return { success: false, message: 'Admin WhatsApp number not configured' };
  }

  try {
    // Clean phone number (remove all non-digits)
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!cleanPhone) {
      return { success: false, message: 'Invalid phone number format' };
    }

    // Check if Twilio is configured for actual message sending
    if (config.twilioAccountSid && config.twilioAuthToken && config.twilioWhatsappNumber) {
      console.log('Twilio configured, attempting to send WhatsApp message...');
      
      try {
        // Send actual WhatsApp message via Twilio
        const twilioResponse = await sendTwilioWhatsApp(cleanPhone, message, config);
        return twilioResponse;
      } catch (twilioError) {
        console.error('Twilio WhatsApp failed, falling back to wa.me link:', twilioError);
        // Fall through to wa.me link generation
      }
    }
    
    // Fallback: Create WhatsApp wa.me link
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log(`WhatsApp notification prepared for ${cleanPhone}`);
    console.log(`WhatsApp URL: ${whatsappUrl}`);
    
    return { 
      success: true, 
      message: 'WhatsApp link generated successfully (manual sending required)',
      whatsappUrl 
    };
    
  } catch (error) {
    console.error('Failed to prepare WhatsApp message:', error);
    return { 
      success: false, 
      message: `Failed to prepare WhatsApp message: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// New Twilio WhatsApp integration
const sendTwilioWhatsApp = async (
  phone: string,
  message: string,
  config: NotificationConfig
): Promise<{ success: boolean; message: string }> => {
  if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioWhatsappNumber) {
    throw new Error('Twilio configuration incomplete');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`;
  
  const formData = new URLSearchParams();
  formData.append('From', `whatsapp:${config.twilioWhatsappNumber}`);
  formData.append('To', `whatsapp:+${phone}`);
  formData.append('Body', message);

  const credentials = btoa(`${config.twilioAccountSid}:${config.twilioAuthToken}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Twilio API error: ${response.status} - ${errorData}`);
  }

  const result = await response.json();
  console.log('Twilio WhatsApp sent successfully:', result.sid);
  
  return { 
    success: true, 
    message: 'WhatsApp message sent successfully via Twilio' 
  };
};

// Enhanced order notification with better customer data handling
export const sendOrderNotification = async (
  orderData: OrderNotificationData,
  config: NotificationConfig
): Promise<{ emailResult?: any; whatsappResult?: any }> => {
  const orderDate = new Date().toLocaleString();
  const emailSubject = `🛒 New Order #${orderData.orderId.slice(0, 8)} - Mokoni Store`;
  
  const emailMessage = `
🎉 NEW ORDER RECEIVED!

📋 Order Details:
• Order ID: #${orderData.orderId.slice(0, 8)}
• Customer: ${orderData.customerName || 'N/A'}
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

  const results: { emailResult?: any; whatsappResult?: any } = {};

  // Send email notification
  if (config.emailEnabled && config.adminEmail) {
    const emailResult = await sendEmailNotification(config.adminEmail, emailSubject, emailMessage, config);
    results.emailResult = emailResult;
    
    if (emailResult.success) {
      console.log('✅ Order email notification sent successfully');
    } else {
      console.log('❌ Failed to send order email notification:', emailResult.message);
    }
  }

  // Send WhatsApp notification
  if (config.whatsappEnabled && config.adminWhatsapp) {
    const whatsappMessage = `🛒 *New Order Alert!*

Order #${orderData.orderId.slice(0, 8)}
💰 Total: $${orderData.total.toFixed(2)}
📦 Items: ${orderData.items.length}
👤 Customer: ${orderData.customerName || 'N/A'}
🕐 Time: ${orderDate}

Check your admin panel for details! 🚀`;

    const whatsappResult = await sendWhatsAppNotification(config.adminWhatsapp, whatsappMessage, config);
    results.whatsappResult = whatsappResult;
    
    if (whatsappResult.success) {
      console.log('✅ Order WhatsApp notification prepared successfully');
    } else {
      console.log('❌ Failed to prepare WhatsApp notification:', whatsappResult.message);
    }
  }

  return results;
};

// Enhanced order status update notification
export const sendOrderStatusNotification = async (
  orderId: string,
  newStatus: string,
  customerEmail: string,
  customerName: string,
  config: NotificationConfig
): Promise<{ emailResult?: any; whatsappResult?: any }> => {
  const statusDate = new Date().toLocaleString();
  const subject = `📦 Order Status Update #${orderId.slice(0, 8)} - ${newStatus.toUpperCase()}`;
  
  const adminMessage = `
📦 ORDER STATUS UPDATED

Order #${orderId.slice(0, 8)} status changed to: ${newStatus.toUpperCase()}
Customer: ${customerName || customerEmail || 'N/A'}
Updated at: ${statusDate}

Please review the order in your admin panel for next steps.
  `.trim();

  const results: { emailResult?: any; whatsappResult?: any } = {};

  // Notify admin
  if (config.emailEnabled && config.adminEmail) {
    const emailResult = await sendEmailNotification(
      config.adminEmail,
      `Admin: ${subject}`,
      adminMessage,
      config
    );
    results.emailResult = emailResult;
  }

  // WhatsApp notification for admin
  if (config.whatsappEnabled && config.adminWhatsapp) {
    const whatsappMessage = `📦 *Order Status Update*

Order #${orderId.slice(0, 8)}
Status: ${newStatus.toUpperCase()}
Customer: ${customerName || customerEmail || 'N/A'}
Time: ${statusDate}

Check admin panel for details! 📋`;

    const whatsappResult = await sendWhatsAppNotification(config.adminWhatsapp, whatsappMessage, config);
    results.whatsappResult = whatsappResult;
  }

  console.log(`Status update notification sent for order ${orderId}: ${newStatus}`);
  return results;
};

// Configuration validation helper
export const validateNotificationConfig = (config: NotificationConfig): {
  email: { valid: boolean; message: string };
  whatsapp: { valid: boolean; message: string };
} => {
  const emailValid = config.emailEnabled && 
                    config.adminEmail && 
                    config.emailjsServiceId && 
                    config.emailjsTemplateId && 
                    config.emailjsPublicKey;
                    
  const whatsappValid = config.whatsappEnabled && config.adminWhatsapp;

  return {
    email: {
      valid: !!emailValid,
      message: emailValid ? 'Email notifications fully configured' : 'Email configuration incomplete'
    },
    whatsapp: {
      valid: !!whatsappValid,
      message: whatsappValid ? 'WhatsApp notifications configured' : 'WhatsApp configuration incomplete'
    }
  };
};
