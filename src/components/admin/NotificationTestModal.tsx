
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendEmailNotification, sendWhatsAppNotification } from '@/services/notifications';
import { getSettings } from '@/services/settings';

interface NotificationTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationTestModal: React.FC<NotificationTestModalProps> = ({ isOpen, onClose }) => {
  const [testData, setTestData] = useState({
    email: '',
    phone: '',
    subject: 'Test Notification from Mokoni',
    message: 'This is a test message to verify your notification settings are working correctly.'
  });
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!testData.email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      const settings = await getSettings();
      if (settings.notifications) {
        const success = await sendEmailNotification(
          testData.email,
          testData.subject,
          testData.message,
          settings.notifications
        );
        
        if (success) {
          toast({
            title: "Success",
            description: "Test email sent successfully",
          });
        } else {
          toast({
            title: "Warning",
            description: "Email configuration incomplete. Check EmailJS settings.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestWhatsApp = async () => {
    if (!testData.phone) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      const settings = await getSettings();
      if (settings.notifications) {
        const success = await sendWhatsAppNotification(
          testData.phone,
          testData.message,
          settings.notifications
        );
        
        if (success) {
          toast({
            title: "Success",
            description: "WhatsApp notification prepared (check console for details)",
          });
        } else {
          toast({
            title: "Warning",
            description: "WhatsApp configuration incomplete",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare WhatsApp notification",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Test Notifications</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              value={testData.email}
              onChange={(e) => setTestData({...testData, email: e.target.value})}
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="testPhone">Test Phone Number</Label>
            <Input
              id="testPhone"
              value={testData.phone}
              onChange={(e) => setTestData({...testData, phone: e.target.value})}
              placeholder="+1234567890"
            />
          </div>
          
          <div>
            <Label htmlFor="testSubject">Subject</Label>
            <Input
              id="testSubject"
              value={testData.subject}
              onChange={(e) => setTestData({...testData, subject: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="testMessage">Message</Label>
            <Textarea
              id="testMessage"
              value={testData.message}
              onChange={(e) => setTestData({...testData, message: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleTestEmail}
              disabled={isTesting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isTesting ? 'Testing...' : 'Test Email'}
            </Button>
            <Button 
              onClick={handleTestWhatsApp}
              disabled={isTesting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isTesting ? 'Testing...' : 'Test WhatsApp'}
            </Button>
          </div>
          
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationTestModal;
