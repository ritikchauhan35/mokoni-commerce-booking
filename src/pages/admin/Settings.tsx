
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { getSettings, updateSettings } from '@/services/settings';
import { useToast } from '@/hooks/use-toast';
import { Save, MapPin, Mail, Phone, Globe, TestTube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import NotificationTestModal from '@/components/admin/NotificationTestModal';

interface SettingsFormData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  taxRate: number;
  maintenanceMode: boolean;
  // Notification settings
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  adminEmail: string;
  adminWhatsapp: string;
  // EmailJS settings
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
}

const AdminSettings = () => {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, control, reset } = useForm<SettingsFormData>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Watch notification settings for validation
  const emailEnabled = watch('emailEnabled');
  const whatsappEnabled = watch('whatsappEnabled');
  const emailjsServiceId = watch('emailjsServiceId');
  const emailjsTemplateId = watch('emailjsTemplateId');
  const emailjsPublicKey = watch('emailjsPublicKey');
  const adminEmail = watch('adminEmail');
  const adminWhatsapp = watch('adminWhatsapp');

  // Configuration validation
  const getEmailConfigStatus = () => {
    if (!emailEnabled) return { status: 'disabled', message: 'Email notifications disabled' };
    if (!adminEmail) return { status: 'error', message: 'Admin email required' };
    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      return { status: 'warning', message: 'EmailJS configuration incomplete - will use fallback' };
    }
    return { status: 'success', message: 'Email notifications fully configured' };
  };

  const getWhatsAppConfigStatus = () => {
    if (!whatsappEnabled) return { status: 'disabled', message: 'WhatsApp notifications disabled' };
    if (!adminWhatsapp) return { status: 'error', message: 'Admin WhatsApp number required' };
    return { status: 'success', message: 'WhatsApp notifications configured (using wa.me links)' };
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  React.useEffect(() => {
    if (settings) {
      console.log('Populating form with settings:', settings);
      const formData = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone || '',
        street: settings.address?.street || '',
        city: settings.address?.city || '',
        state: settings.address?.state || '',
        zipCode: settings.address?.zipCode || '',
        country: settings.address?.country || '',
        facebook: settings.socialLinks?.facebook || '',
        instagram: settings.socialLinks?.instagram || '',
        twitter: settings.socialLinks?.twitter || '',
        linkedin: settings.socialLinks?.linkedin || '',
        taxRate: settings.taxRate,
        maintenanceMode: settings.maintenanceMode,
        emailEnabled: settings.notifications?.emailEnabled || false,
        whatsappEnabled: settings.notifications?.whatsappEnabled || false,
        adminEmail: settings.notifications?.adminEmail || '',
        adminWhatsapp: settings.notifications?.adminWhatsapp || '',
        emailjsServiceId: settings.notifications?.emailjsServiceId || '',
        emailjsTemplateId: settings.notifications?.emailjsTemplateId || '',
        emailjsPublicKey: settings.notifications?.emailjsPublicKey || ''
      };
      
      console.log('Form data to set:', formData);
      reset(formData);
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    console.log('Form submission started with data:', data);
    
    try {
      const settingsUpdate = {
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          type: 'work' as const
        },
        socialLinks: {
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          linkedin: data.linkedin
        },
        taxRate: data.taxRate,
        maintenanceMode: data.maintenanceMode,
        notifications: {
          emailEnabled: data.emailEnabled,
          whatsappEnabled: data.whatsappEnabled,
          adminEmail: data.adminEmail,
          adminWhatsapp: data.adminWhatsapp,
          emailjsServiceId: data.emailjsServiceId,
          emailjsTemplateId: data.emailjsTemplateId,
          emailjsPublicKey: data.emailjsPublicKey,
          twilioAccountSid: '',
          twilioAuthToken: '',
          twilioWhatsappNumber: ''
        }
      };

      console.log('Calling updateSettings with:', settingsUpdate);
      await updateSettings(settingsUpdate);

      console.log('Settings updated successfully, invalidating cache');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Settings update error:', error);
      toast({
        title: "Error",
        description: `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
      </div>
    );
  }

  const emailConfigStatus = getEmailConfigStatus();
  const whatsappConfigStatus = getWhatsAppConfigStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-800">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Settings */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800 flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  {...register('siteName', { required: 'Site name is required' })}
                  placeholder="Your site name"
                />
                {errors.siteName && <p className="text-red-500 text-sm">{errors.siteName.message}</p>}
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  {...register('taxRate', { required: 'Tax rate is required', min: 0, valueAsNumber: true })}
                  placeholder="8.25"
                />
                {errors.taxRate && <p className="text-red-500 text-sm">{errors.taxRate.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                {...register('siteDescription', { required: 'Site description is required' })}
                placeholder="Brief description of your site"
                rows={3}
              />
              {errors.siteDescription && <p className="text-red-500 text-sm">{errors.siteDescription.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="maintenanceMode"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="maintenanceMode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800 flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail', { required: 'Contact email is required' })}
                  placeholder="info@yoursite.com"
                />
                {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  {...register('contactPhone')}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Address */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Warehouse Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register('street')}
                placeholder="123 Business Avenue"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Commerce City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="California"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  placeholder="90210"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="United States"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800">Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  {...register('facebook')}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  {...register('instagram')}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  {...register('twitter')}
                  placeholder="https://twitter.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Notification Settings */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800 flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Notification Settings
              </div>
              <Button
                type="button"
                onClick={() => setIsTestModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <TestTube className="mr-2 h-4 w-4" />
                Test Notifications
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-olive-700">Email Notifications</h3>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={emailConfigStatus.status} />
                  <span className="text-sm text-gray-600">{emailConfigStatus.message}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="emailEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="emailEnabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminEmail">Admin Email for Notifications</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    {...register('adminEmail')}
                    placeholder="admin@yoursite.com"
                  />
                </div>
                <div>
                  <Label htmlFor="emailjsServiceId">EmailJS Service ID</Label>
                  <Input
                    id="emailjsServiceId"
                    {...register('emailjsServiceId')}
                    placeholder="service_xxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="emailjsTemplateId">EmailJS Template ID</Label>
                  <Input
                    id="emailjsTemplateId"
                    {...register('emailjsTemplateId')}
                    placeholder="template_xxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="emailjsPublicKey">EmailJS Public Key</Label>
                  <Input
                    id="emailjsPublicKey"
                    {...register('emailjsPublicKey')}
                    placeholder="xxxxxxxxxxxxxxxx"
                  />
                </div>
              </div>
              
              {emailEnabled && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">EmailJS Setup Instructions:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Create an account at <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a></li>
                    <li>Create an email service (Gmail, Outlook, etc.)</li>
                    <li>Create an email template with variables: to_email, subject, message, from_name</li>
                    <li>Copy the Service ID, Template ID, and Public Key to the fields above</li>
                  </ol>
                </div>
              )}
            </div>

            {/* WhatsApp Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-olive-700">WhatsApp Notifications</h3>
                <div className="flex items-center space-x-2">
                  <StatusIcon status={whatsappConfigStatus.status} />
                  <span className="text-sm text-gray-600">{whatsappConfigStatus.message}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="whatsappEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="whatsappEnabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="whatsappEnabled">Enable WhatsApp Notifications</Label>
              </div>
              
              <div>
                <Label htmlFor="adminWhatsapp">Admin WhatsApp Number</Label>
                <Input
                  id="adminWhatsapp"
                  {...register('adminWhatsapp')}
                  placeholder="+1234567890"
                />
                <p className="text-sm text-olive-600 mt-1">
                  Include country code (e.g., +1234567890)
                </p>
              </div>
              
              {whatsappEnabled && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">WhatsApp Setup Notes:</h4>
                  <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                    <li>Current implementation uses wa.me links for manual message sending</li>
                    <li>For automated WhatsApp messages, integrate with WhatsApp Business API</li>
                    <li>Consider using Twilio WhatsApp API for production use</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-olive-600 hover:bg-olive-700">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>

      <NotificationTestModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
      />
    </div>
  );
};

export default AdminSettings;
