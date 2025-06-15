
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Contact = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 to-olive-50">
      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="px-4 py-16 bg-olive-700">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold text-pearl-50 mb-6 transition-all duration-700 ${heroVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            Contact Us
          </h1>
          <p className={`text-xl text-pearl-100 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-300 ${heroVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={formRef} className="px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`transition-all duration-700 ${formVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-olive-800 mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-olive-600" />
                <div>
                  <p className="font-medium text-olive-800">Email</p>
                  <p className="text-olive-600">contact@mokoni.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-olive-600" />
                <div>
                  <p className="font-medium text-olive-800">Phone</p>
                  <p className="text-olive-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-olive-600" />
                <div>
                  <p className="font-medium text-olive-800">Address</p>
                  <p className="text-olive-600">123 Business St, City, State 12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className={`bg-pearl-50 border-olive-200 transition-all duration-700 delay-300 ${formVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <CardHeader>
              <CardTitle className="text-olive-800">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-olive-700">First Name</Label>
                    <Input id="firstName" className="bg-pearl-100 border-olive-200 text-olive-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-olive-700">Last Name</Label>
                    <Input id="lastName" className="bg-pearl-100 border-olive-200 text-olive-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-olive-700">Email</Label>
                  <Input id="email" type="email" className="bg-pearl-100 border-olive-200 text-olive-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-olive-700">Subject</Label>
                  <Input id="subject" className="bg-pearl-100 border-olive-200 text-olive-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-olive-700">Message</Label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full px-3 py-2 bg-pearl-100 border border-olive-200 rounded-md text-olive-800 focus:outline-none focus:ring-2 focus:ring-olive-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-olive-600 hover:bg-olive-700 text-pearl-50">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
