
import { NotificationConfig } from '@/types/notifications';
import { sendEmailNotification, sendWhatsAppNotification } from './notifications';

export interface BookingNotificationData {
  bookingId: string;
  propertyName: string;
  customerName: string;
  customerEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: string;
}

export const sendBookingConfirmation = async (
  bookingData: BookingNotificationData,
  config: NotificationConfig
): Promise<void> => {
  const checkInDate = new Date(bookingData.checkIn).toLocaleDateString();
  const checkOutDate = new Date(bookingData.checkOut).toLocaleDateString();
  const bookingDate = new Date().toLocaleString();
  
  // Customer confirmation email
  const customerSubject = `🏡 Booking Confirmation #${bookingData.bookingId.slice(0, 8)} - ${bookingData.propertyName}`;
  const customerMessage = `
Dear ${bookingData.customerName},

Thank you for your booking! Your reservation has been confirmed.

🏡 Property: ${bookingData.propertyName}
📅 Check-in: ${checkInDate}
📅 Check-out: ${checkOutDate}
👥 Guests: ${bookingData.guests}
💰 Total: $${bookingData.total.toFixed(2)}
🆔 Booking ID: #${bookingData.bookingId.slice(0, 8)}

We look forward to hosting you! If you have any questions, please don't hesitate to contact us.

Best regards,
Mokoni Team
  `.trim();

  // Admin notification email
  const adminSubject = `🏡 New Booking Alert #${bookingData.bookingId.slice(0, 8)} - ${bookingData.propertyName}`;
  const adminMessage = `
🎉 NEW BOOKING RECEIVED!

📋 Booking Details:
• Booking ID: #${bookingData.bookingId.slice(0, 8)}
• Property: ${bookingData.propertyName}
• Guest: ${bookingData.customerName} (${bookingData.customerEmail})
• Check-in: ${checkInDate}
• Check-out: ${checkOutDate}
• Guests: ${bookingData.guests}
• Total: $${bookingData.total.toFixed(2)}
• Status: ${bookingData.status.toUpperCase()}
• Booked: ${bookingDate}

🚀 Please check your admin panel to manage this booking.

---
Mokoni Property Management System
  `.trim();

  // Send customer confirmation
  if (config.emailEnabled && bookingData.customerEmail) {
    await sendEmailNotification(bookingData.customerEmail, customerSubject, customerMessage, config);
    console.log('✅ Booking confirmation email sent to customer');
  }

  // Send admin notification
  if (config.emailEnabled && config.adminEmail) {
    await sendEmailNotification(config.adminEmail, adminSubject, adminMessage, config);
    console.log('✅ Booking notification email sent to admin');
  }

  // WhatsApp notification for admin
  if (config.whatsappEnabled && config.adminWhatsapp) {
    const whatsappMessage = `🏡 *New Booking Alert!*

Property: ${bookingData.propertyName}
Guest: ${bookingData.customerName}
📅 ${checkInDate} → ${checkOutDate}
👥 ${bookingData.guests} guests
💰 $${bookingData.total.toFixed(2)}
🆔 #${bookingData.bookingId.slice(0, 8)}

Check admin panel! 🚀`;

    await sendWhatsAppNotification(config.adminWhatsapp, whatsappMessage, config);
    console.log('✅ Booking WhatsApp notification prepared');
  }
};

export const sendBookingStatusUpdate = async (
  bookingId: string,
  newStatus: string,
  customerEmail: string,
  propertyName: string,
  config: NotificationConfig
): Promise<void> => {
  const statusDate = new Date().toLocaleString();
  const subject = `🏡 Booking Status Update #${bookingId.slice(0, 8)} - ${newStatus.toUpperCase()}`;
  
  const customerMessage = `
Your booking status has been updated:

🏡 Property: ${propertyName}
🆔 Booking ID: #${bookingId.slice(0, 8)}
📋 New Status: ${newStatus.toUpperCase()}
🕐 Updated: ${statusDate}

Thank you for choosing Mokoni!
  `.trim();

  // Notify customer
  if (config.emailEnabled && customerEmail) {
    await sendEmailNotification(customerEmail, subject, customerMessage, config);
  }

  // WhatsApp notification for admin
  if (config.whatsappEnabled && config.adminWhatsapp) {
    const adminWhatsappMessage = `🏡 *Booking Status Update*

#${bookingId.slice(0, 8)} → ${newStatus.toUpperCase()}
Property: ${propertyName}
Time: ${statusDate}

Check admin panel! 📋`;

    await sendWhatsAppNotification(config.adminWhatsapp, adminWhatsappMessage, config);
  }

  console.log(`Booking status update notification sent for ${bookingId}: ${newStatus}`);
};
