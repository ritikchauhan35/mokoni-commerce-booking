
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '@/services/settings';
import { MessageCircle } from 'lucide-react';

const WhatsAppChat = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // Show if WhatsApp is enabled OR if there's an admin WhatsApp number (fallback)
  const whatsappNumber = settings?.notifications?.adminWhatsapp || settings?.contactPhone;
  const shouldShow = settings?.notifications?.whatsappEnabled || whatsappNumber;

  if (!shouldShow || !whatsappNumber) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'd like to get in touch regarding your services.");
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
        size="lg"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default WhatsAppChat;
