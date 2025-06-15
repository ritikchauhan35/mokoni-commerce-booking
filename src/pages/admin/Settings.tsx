import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getSettings, updateSettings } from '@/services/settings';
import { useToast } from '@/hooks/use-toast';
import { Save, MapPin, Mail, Phone, Globe } from 'lucide-react';

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
}

const AdminSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SettingsFormData>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  React.useEffect(() => {
    if (settings) {
      setValue('siteName', settings.siteName);
      setValue('siteDescription', settings.siteDescription);
      setValue('contactEmail', settings.contactEmail);
      setValue('contactPhone', settings.contactPhone || '');
      setValue('street', settings.address?.street || '');
      setValue('city', settings.address?.city || '');
      setValue('state', settings.address?.state || '');
      setValue('zipCode', settings.address?.zipCode || '');
      setValue('country', settings.address?.country || '');
      setValue('facebook', settings.socialLinks?.facebook || '');
      setValue('instagram', settings.socialLinks?.instagram || '');
      setValue('twitter', settings.socialLinks?.twitter || '');
      setValue('linkedin', settings.socialLinks?.linkedin || '');
      setValue('taxRate', settings.taxRate);
      setValue('maintenanceMode', settings.maintenanceMode);
      
      // Add notification settings
      setValue('emailEnabled', settings.notifications?.emailEnabled || false);
      setValue('whatsappEnabled', settings.notifications?.whatsappEnabled || false);
      setValue('adminEmail', settings.notifications?.adminEmail || '');
      setValue('adminWhatsapp', settings.notifications?.adminWhatsapp || '');
    }
  }, [settings, setValue]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateSettings({
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
          type: 'work'
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
          twilioAccountSid: '',
          twilioAuthToken: '',
          twilioWhatsappNumber: ''
        }
      });

      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
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
                  {...register('taxRate', { required: 'Tax rate is required', min: 0 })}
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
              <Switch
                id="maintenanceMode"
                {...register('maintenanceMode')}
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

        {/* Notification Settings */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800 flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailEnabled"
                    {...register('emailEnabled')}
                  />
                  <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
                </div>
                <div>
                  <Label htmlFor="adminEmail">Admin Email for Notifications</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    {...register('adminEmail')}
                    placeholder="admin@yoursite.com"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="whatsappEnabled"
                    {...register('whatsappEnabled')}
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
                </div>
              </div>
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
    </div>
  );
};

export default AdminSettings;
