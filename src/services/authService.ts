
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '@/config/firebase';

// Google Authentication
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Phone Authentication
export const initializeRecaptcha = (containerId: string) => {
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
  }
  return (window as any).recaptchaVerifier;
};

export const sendPhoneVerification = async (phoneNumber: string) => {
  try {
    const recaptcha = initializeRecaptcha('recaptcha-container');
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    return confirmationResult;
  } catch (error) {
    console.error('Phone verification error:', error);
    throw error;
  }
};

export const verifyPhoneCode = async (confirmationResult: any, code: string) => {
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    console.error('Phone code verification error:', error);
    throw error;
  }
};
