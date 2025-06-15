
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '@/services/settings';
import { sendEmailNotification } from '@/services/notifications';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const ContactFormHandler = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  const { toast } = useToast();
  
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (settings?.notifications) {
        const emailContent = `
New contact form submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
        `.trim();

        await sendEmailNotification(
          settings.notifications.adminEmail,
          `Contact Form: ${data.subject}`,
          emailContent,
          settings.notifications
        );
      }

      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-olive-700">First Name</Label>
          <Input 
            id="firstName" 
            {...register('firstName', { required: 'First name is required' })}
            className="bg-pearl-100 border-olive-200 text-olive-800" 
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-olive-700">Last Name</Label>
          <Input 
            id="lastName" 
            {...register('lastName', { required: 'Last name is required' })}
            className="bg-pearl-100 border-olive-200 text-olive-800" 
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-olive-700">Email</Label>
        <Input 
          id="email" 
          type="email" 
          {...register('email', { required: 'Email is required' })}
          className="bg-pearl-100 border-olive-200 text-olive-800" 
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-olive-700">Subject</Label>
        <Input 
          id="subject" 
          {...register('subject', { required: 'Subject is required' })}
          className="bg-pearl-100 border-olive-200 text-olive-800" 
        />
        {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-olive-700">Message</Label>
        <Textarea 
          id="message" 
          rows={5}
          {...register('message', { required: 'Message is required' })}
          className="bg-pearl-100 border-olive-200 text-olive-800 focus:outline-none focus:ring-2 focus:ring-olive-500"
        />
        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-olive-600 hover:bg-olive-700 text-pearl-50">
        Send Message
      </Button>
    </form>
  );
};

export default ContactFormHandler;
