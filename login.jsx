// pages/login.jsx. Log in with phone OTP.
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const confirmRef = useRef(null);

  const setupRecaptcha = () => {
    if (!window._recaptchaLogin) {
      window._recaptchaLogin = new RecaptchaVerifier(auth, 'recaptcha-login', { size: 'invisible' });
    }
    return window._recaptchaLogin;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (phone.length !== 10) { setError('Please enter a valid 10 digit number.'); return; }
    setLoading(true);
    try {
      if (!auth) { setError('Backend not connected yet. Add Firebase keys, see SETUP_BACKEND.md'); setLoading(false); return; }
      confirmRef.current = await signInWithPhoneNumber(auth, '+91' + phone, setupRecaptcha());
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Could not send the code. Please try again.');
      if (window._recaptchaLogin) { try { window._recaptchaLogin.clear(); } catch (e) {} window._recaptchaLogin = null; }
    }
    setLoading(false);
  };

  const verify = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError('Enter the 6 digit code.'); return; }
    setLoading(true);
    try {
      const cred = await confirmRef.current.confirm(otp);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      router.push(snap.exists() ? '/account' : '/onboarding');
    } catch (err) {
      setError('That code did not match. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="main">
      <style jsx>{`
        .main { min-height: calc(100vh - 240px); }
        .container { max-width: 430px; margin: 0 auto; padding: 64px 24px; }
        h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(28px, 6vw, 36px); line-height: 1.1; letter-spacing: -0.6px; color: var(--green); margin-bottom: 12px; }
        .helper { font-size: 15px; color: #5a665d; margin-bottom: 28px; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 13px; color: var(--sage); margin-bottom: 7px; }
        .field input { width: 100%; font-size: 16px; color: var(--ink); background: #fff; border: 1.5px solid var(--line); border-radius: 14px; padding: 15px 16px; outline: none; }
        .field input:focus { border-color: var(--green); }
        .field input.code { letter-spacing: 8px; text-align: center; font-size: 22px; }
        .btn { width: 100%; background: var(--green); color: var(--cream); font-weight: 500; font-size: 16px; border: none; border-radius: 14px; padding: 16px; cursor: pointer; margin-top: 8px; }
        .btn:hover:not(:disabled) { background: var(--forest); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .link { text-align: center; margin-top: 18px; font-size: 14px; color: #5a665d; }
        .link a { color: var(--clay); font-weight: 500; }
        .error { background: #fdeceb; color: #b3322c; padding: 10px 13px; border-radius: 10px; font-size: 14px; margin-bottom: 16px; }
      `}</style>
      <div className="container">
        <button className="backlink" onClick={() => (step === 'otp' ? setStep('phone') : router.back())}>‹ Back</button>
        {step === 'phone' ? (
          <>
            <h2>Welcome back.</h2>
            <p className="helper">Log in with your phone number. We will send a quick code to check it is you.</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={sendOtp}>
              <div className="field">
                <label>Phone number</label>
                <input type="tel" placeholder="Your 10 digit number" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
              </div>
              <button type="submit" className="btn" disabled={loading}>{loading ? 'Sending...' : 'Send me an OTP'}</button>
            </form>
            <p className="link">New here? <Link href="/signup">Create an account</Link></p>
          </>
        ) : (
          <>
            <h2>Enter your code.</h2>
            <p className="helper">We sent a 6 digit code to +91 {phone}.</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={verify}>
              <div className="field">
                <label>Verification code</label>
                <input type="tel" className="code" maxLength="6" placeholder="000000" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} />
              </div>
              <button type="submit" className="btn" disabled={loading}>{loading ? 'Verifying...' : 'Log in'}</button>
            </form>
          </>
        )}
      </div>
      <div id="recaptcha-login" />
    </main>
  );
}
