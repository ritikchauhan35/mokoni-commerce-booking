
// Free notification services integration
export interface NotificationConfig {
  sms: {
    provider: 'msg91' | 'textlocal' | 'disabled';
    apiKey?: string;
    senderId?: string;
  };
  email: {
    provider: 'emailjs' | 'disabled';
    serviceId?: string;
    templateId?: string;
    userId?: string;
  };
}

// SMS notification using MSG91 free tier (100 SMS/day)
export const sendSMSNotification = async (
  phone: string,
  message: string,
  config: NotificationConfig
): Promise<boolean> => {
  if (config.sms.provider === 'disabled' || !config.sms.apiKey) {
    console.log('SMS notifications disabled');
    return false;
  }

  try {
    if (config.sms.provider === 'msg91') {
      // MSG91 API integration (free tier)
      const response = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authkey': config.sms.apiKey
        },
        body: JSON.stringify({
          sender: config.sms.senderId || 'ECOMM',
          short_url: '0',
          mobiles: phone,
          message: message
        })
      });

      return response.ok;
    }
  } catch (error) {
    console.error('SMS notification error:', error);
  }

  return false;
};

// Email notification using EmailJS (free tier)
export const sendEmailNotification = async (
  email: string,
  subject: string,
  message: string,
  config: NotificationConfig
): Promise<boolean> => {
  if (config.email.provider === 'disabled') {
    console.log('Email notifications disabled');
    return false;
  }

  try {
    // EmailJS integration (free tier - 200 emails/month)
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: config.email.serviceId,
        template_id: config.email.templateId,
        user_id: config.email.userId,
        template_params: {
          to_email: email,
          subject: subject,
          message: message
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Email notification error:', error);
  }

  return false;
};

// Order status notifications
export const sendOrderNotification = async (
  orderDetails: {
    orderId: string;
    customerPhone: string;
    customerEmail: string;
    status: string;
    trackingNumber?: string;
  },
  config: NotificationConfig
): Promise<void> => {
  const smsMessage = `Order ${orderDetails.orderId} is now ${orderDetails.status}. ${
    orderDetails.trackingNumber ? `Track: ${orderDetails.trackingNumber}` : ''
  }`;

  const emailMessage = `
    Dear Customer,
    
    Your order ${orderDetails.orderId} status has been updated to: ${orderDetails.status}
    
    ${orderDetails.trackingNumber ? `Tracking Number: ${orderDetails.trackingNumber}` : ''}
    
    Thank you for shopping with us!
  `;

  // Send SMS notification
  await sendSMSNotification(orderDetails.customerPhone, smsMessage, config);

  // Send email notification
  await sendEmailNotification(
    orderDetails.customerEmail,
    `Order ${orderDetails.orderId} Update`,
    emailMessage,
    config
  );
};

// Delivery notifications
export const sendDeliveryNotification = async (
  deliveryDetails: {
    orderId: string;
    customerPhone: string;
    customerEmail: string;
    estimatedDelivery: Date;
    trackingNumber: string;
  },
  config: NotificationConfig
): Promise<void> => {
  const deliveryDate = deliveryDetails.estimatedDelivery.toLocaleDateString('en-IN');
  
  const smsMessage = `Your order ${deliveryDetails.orderId} will be delivered on ${deliveryDate}. Track: ${deliveryDetails.trackingNumber}`;

  const emailMessage = `
    Dear Customer,
    
    Your order ${deliveryDetails.orderId} is on its way!
    
    Estimated Delivery: ${deliveryDate}
    Tracking Number: ${deliveryDetails.trackingNumber}
    
    We'll notify you when it's out for delivery.
    
    Thank you for choosing us!
  `;

  await sendSMSNotification(deliveryDetails.customerPhone, smsMessage, config);
  await sendEmailNotification(
    deliveryDetails.customerEmail,
    `Order ${deliveryDetails.orderId} - Out for Delivery`,
    emailMessage,
    config
  );
};
