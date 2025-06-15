
export interface NotificationConfig {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  adminEmail: string;
  adminWhatsapp?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioWhatsappNumber?: string;
}

export interface NotificationTemplate {
  subject: string;
  message: string;
}

export interface OrderNotificationData {
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}
