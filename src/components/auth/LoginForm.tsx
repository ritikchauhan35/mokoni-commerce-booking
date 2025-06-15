
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle, sendPhoneVerification, verifyPhoneCode } from '@/services/authService';
import { Mail, Phone } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!confirmationResult) {
        const result = await sendPhoneVerification(phoneNumber);
        setConfirmationResult(result);
        toast({
          title: "Verification code sent",
          description: "Please check your phone for the verification code",
        });
      } else {
        await verifyPhoneCode(confirmationResult, verificationCode);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Phone login failed",
        description: "Please check your phone number and verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-pearl-50 border-olive-200 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-olive-800">Login to Mokoni</CardTitle>
        <CardDescription className="text-olive-600">Choose your preferred login method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Login */}
        <Button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full bg-pearl-100 hover:bg-pearl-200 text-olive-800 border border-olive-200 font-medium"
          variant="outline"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-olive-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-pearl-50 px-2 text-olive-600">Or continue with</span>
          </div>
        </div>

        {/* Auth Method Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={authMethod === 'email' ? 'default' : 'outline'}
            className={authMethod === 'email' ? 'bg-olive-600 hover:bg-olive-700 text-pearl-50' : 'border-olive-200 text-olive-700 hover:bg-olive-50'}
            onClick={() => setAuthMethod('email')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button
            type="button"
            variant={authMethod === 'phone' ? 'default' : 'outline'}
            className={authMethod === 'phone' ? 'bg-olive-600 hover:bg-olive-700 text-pearl-50' : 'border-olive-200 text-olive-700 hover:bg-olive-50'}
            onClick={() => setAuthMethod('phone')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Phone
          </Button>
        </div>

        {/* Email Login Form */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-olive-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-pearl-100 border-olive-200 text-olive-800 focus:border-olive-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-olive-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-pearl-100 border-olive-200 text-olive-800 focus:border-olive-500"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-olive-600 hover:bg-olive-700 text-pearl-50" disabled={loading}>
              {loading ? 'Logging in...' : 'Login with Email'}
            </Button>
          </form>
        )}

        {/* Phone Login Form */}
        {authMethod === 'phone' && (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-olive-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="bg-pearl-100 border-olive-200 text-olive-800 focus:border-olive-500"
                required
              />
            </div>
            {confirmationResult && (
              <div className="space-y-2">
                <Label htmlFor="verification" className="text-olive-700">Verification Code</Label>
                <Input
                  id="verification"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="bg-pearl-100 border-olive-200 text-olive-800 focus:border-olive-500"
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full bg-olive-600 hover:bg-olive-700 text-pearl-50" disabled={loading}>
              {loading ? 'Processing...' : confirmationResult ? 'Verify Code' : 'Send Verification'}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-olive-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-olive-800 hover:text-olive-900 font-medium hover:underline">
            Register here
          </Link>
        </p>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
