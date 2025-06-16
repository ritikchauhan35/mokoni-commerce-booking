
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendEmailNotification, sendWhatsAppNotification, validateNotificationConfig } from '@/services/notifications';
import { getSettings } from '@/services/settings';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface NotificationTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationTestModal: React.FC<NotificationTestModalProps> = ({ isOpen, onClose }) => {
  const [testData, setTestData] = useState({
    email: '',
    phone: '',
    subject: 'Test Notification from Mokoni',
    message: 'This is a test message to verify your notification settings are working correctly. If you receive this message, your configuration is working properly!'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [lastResults, setLastResults] = useState<{
    email?: { success: boolean; message: string };
    whatsapp?: { success: boolean; message: string; whatsappUrl?: string };
  }>({});
  
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
        const result = await sendEmailNotification(
          testData.email,
          testData.subject,
          testData.message,
          settings.notifications
        );
        
        setLastResults(prev => ({ ...prev, email: result }));
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Test email sent successfully!",
          });
        } else {
          toast({
            title: "Configuration Issue",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      const errorResult = { 
        success: false, 
        message: `Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
      setLastResults(prev => ({ ...prev, email: errorResult }));
      
      toast({
        title: "Error",
        description: errorResult.message,
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
        const result = await sendWhatsAppNotification(
          testData.phone,
          testData.message,
          settings.notifications
        );
        
        setLastResults(prev => ({ ...prev, whatsapp: result }));
        
        if (result.success) {
          toast({
            title: "Success",
            description: "WhatsApp link generated successfully!",
          });
        } else {
          toast({
            title: "Configuration Issue",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      const errorResult = { 
        success: false, 
        message: `Failed to prepare WhatsApp notification: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
      setLastResults(prev => ({ ...prev, whatsapp: errorResult }));
      
      toast({
        title: "Error",
        description: errorResult.message,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleConfigCheck = async () => {
    try {
      const settings = await getSettings();
      if (settings.notifications) {
        const validation = validateNotificationConfig(settings.notifications);
        
        toast({
          title: "Configuration Status",
          description: `Email: ${validation.email.message} | WhatsApp: ${validation.whatsapp.message}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Notification Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Configuration Check */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Configuration Status</h3>
              <Button variant="outline" size="sm" onClick={handleConfigCheck}>
                Check Config
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Click "Check Config" to validate your notification settings before testing.
            </p>
          </div>

          {/* Test Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-xs text-gray-500 mt-1">Include country code</p>
              </div>
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
                rows={4}
              />
            </div>
          </div>

          {/* Test Results */}
          {(lastResults.email || lastResults.whatsapp) && (
            <div className="space-y-3">
              <h3 className="font-medium">Last Test Results:</h3>
              
              {lastResults.email && (
                <div className={`p-3 rounded-lg border ${lastResults.email.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center space-x-2">
                    {lastResults.email.success ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    }
                    <span className="font-medium">Email:</span>
                    <span className="text-sm">{lastResults.email.message}</span>
                  </div>
                </div>
              )}
              
              {lastResults.whatsapp && (
                <div className={`p-3 rounded-lg border ${lastResults.whatsapp.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center space-x-2">
                    {lastResults.whatsapp.success ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    }
                    <span className="font-medium">WhatsApp:</span>
                    <span className="text-sm">{lastResults.whatsapp.message}</span>
                  </div>
                  {lastResults.whatsapp.whatsappUrl && (
                    <div className="mt-2">
                      <a 
                        href={lastResults.whatsapp.whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open WhatsApp Message
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
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
