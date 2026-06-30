// pages/signup.jsx. Sign up with real phone OTP via Firebase.
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AVATAR_LETTERS } from '../data';

function Avatar() {
  const [k, setK] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setK((p) => (p + 1) % AVATAR_LETTERS.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="av">
      <style jsx>{`
        .av { width: 30px; height: 30px; border-radius: 50%; background: var(--green); color: var(--cream); font-family: var(--serif); font-weight: 600; font-size: 15px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .g { display: inline-block; animation: swap 0.6s ease; }
        @keyframes swap {
          0% { opacity: 0; transform: translateY(8px) scale(0.6) rotate(-14deg); }
          55% { opacity: 1; transform: translateY(0) scale(1.14) rotate(5deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }
      `}</style>
      <span className="g" key={k}>{AVATAR_LETTERS[k]}</span>
    </span>
  );
}

// Friendly, human messages for the Firebase error codes we actually hit.
function friendlyError(err) {
  const code = (err && err.code) || '';
  if (code === 'auth/too-many-requests') return 'Too many tries from this number for now. Please wait a few minutes and try again.';
  if (code === 'auth/invalid-phone-number') return 'That phone number does not look right. Please check and try again.';
  if (code === 'auth/quota-exceeded') return 'We are a little busy right now. Please try again in a moment.';
  if (code === 'auth/captcha-check-failed') return 'Verification check failed. Please refresh the page and try once more.';
  if (code === 'auth/network-request-failed') return 'Network hiccup. Please check your connection and try again.';
  return (err && err.message) || 'Could not send the code. Please try again.';
}

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const confirmRef = useRef(null);
  const recaptchaRef = useRef(null);

  // Build a clean, single-use reCAPTCHA verifier. We always tear down any
  // previous instance AND wipe the container so grecaptcha never sees a
  // div that "already has a widget" rendered in it. This is what fixes the
  // "reCAPTCHA has already been rendered in this element" error.
  const setupRecaptcha = () => {
    if (typeof window === 'undefined') return null;
    if (recaptchaRef.current) {
      try { recaptchaRef.current.clear(); } catch (e) {}
      recaptchaRef.current = null;
    }
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';
    recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    return recaptchaRef.current;
  };

  // Tear the verifier down when the user leaves this page (handles the
  // Back button and any client-side navigation away from signup).
  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch (e) {}
        recaptchaRef.current = null;
      }
    };
  }, []);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Shared core used by both the first send and the resend.
  const requestOtp = async () => {
    const verifier = setupRecaptcha();
    if (!verifier) throw new Error('Could not start verification. Please refresh and try again.');
    confirmRef.current = await signInWithPhoneNumber(auth, '+91' + phone, verifier);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    // Validate in the same order the fields appear on screen.
    if (!name.trim()) { setError('Please tell us your name first.'); return; }
    if (phone.length !== 10) { setError('Please enter a valid 10 digit number.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (!auth) { setError('Backend not connected yet. Add Firebase keys, see SETUP_BACKEND.md'); return; }
    setLoading(true);
    try {
      await requestOtp();
      setStep('otp');
      setCooldown(30);
    } catch (err) {
      setError(friendlyError(err));
    }
    setLoading(false);
  };

  const resend = async () => {
    if (cooldown > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      await requestOtp();
      setCooldown(30);
    } catch (err) {
      setError(friendlyError(err));
    }
    setLoading(false);
  };

  const verify = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError('Enter the 6 digit code we sent you.'); return; }
    setLoading(true);
    try {
      const cred = await confirmRef.current.confirm(otp);
      const user = cred.user;
      const ref = doc(db, 'users', user.uid);
      const existing = await getDoc(ref);
      await setDoc(ref, {
        name: name.trim(),
        phone: '+91' + phone,
        email: email.trim(),
        updatedAt: serverTimestamp(),
        ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
      }, { merge: true });
      router.push('/onboarding');
    } catch (err) {
      setError('That code did not match. Please check and try again.');
    }
    setLoading(false);
  };

  const goBack = () => {
    setError('');
    if (step === 'otp') {
      setOtp('');
      setStep('phone');
    } else {
      router.back();
    }
  };

  return (
    <main className="main">
      <style jsx>{`
        .main { min-height: calc(100vh - 240px); }
        .container { max-width: 430px; margin: 0 auto; padding: 64px 24px; }
        .speaker { display: flex; align-items: center; gap: 9px; margin-bottom: 26px; }
        .em { font-size: 13px; letter-spacing: 0.4px; color: var(--sage); }
        h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(28px, 6vw, 36px); line-height: 1.1; letter-spacing: -0.6px; color: var(--green); margin-bottom: 12px; }
        .helper { font-size: 15px; color: #5a665d; margin-bottom: 28px; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 13px; color: var(--sage); margin-bottom: 7px; }
        .field input { width: 100%; font-size: 16px; color: var(--ink); background: #fff; border: 1.5px solid var(--line); border-radius: 14px; padding: 15px 16px; outline: none; transition: border-color 0.18s; }
        .field input:focus { border-color: var(--green); }
        .field input.code { letter-spacing: 8px; text-align: center; font-size: 22px; }
        .btn { width: 100%; background: var(--green); color: var(--cream); font-weight: 500; font-size: 16px; border: none; border-radius: 14px; padding: 16px; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
        .btn:hover:not(:disabled) { background: var(--forest); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .note { font-size: 12px; color: var(--sage); text-align: center; margin-top: 16px; }
        .resend { text-align: center; margin-top: 16px; font-size: 14px; color: #5a665d; }
        .resend button { background: none; border: none; color: var(--clay); font-weight: 500; cursor: pointer; font-size: 14px; padding: 0; }
        .resend button:disabled { color: var(--sage); cursor: not-allowed; }
        .link { text-align: center; margin-top: 18px; font-size: 14px; color: #5a665d; }
        .link a { color: var(--clay); font-weight: 500; }
        .error { background: #fdeceb; color: #b3322c; padding: 10px 13px; border-radius: 10px; font-size: 14px; margin-bottom: 16px; }
      `}</style>
      <div className="container">
        <button className="backlink" onClick={goBack}>‹ Back</button>
        <div className="speaker"><Avatar /><span className="em">tiffinlo</span></div>
        {step === 'phone' ? (
          <>
            <h2>First, let us set you up.</h2>
            <p className="helper">Your account lives on your phone number. That is how we keep your trial and plans safe and just for you.</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={sendOtp}>
              <div className="field">
                <label>Your name</label>
                <input type="text" placeholder="What should we call you?" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label>Phone number</label>
                <input type="tel" placeholder="Your 10 digit number" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="So we can send your receipts and updates" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn" disabled={loading}>{loading ? 'Sending...' : 'Send me an OTP'}</button>
              <p className="note">We will text a one time code to check it is really you.</p>
            </form>
            <p className="link">Already with us? <Link href="/login">Log in</Link></p>
          </>
        ) : (
          <>
            <h2>Quick check, the code.</h2>
            <p className="helper">We sent a 6 digit code to +91 {phone}. Pop it in below.</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={verify}>
              <div className="field">
                <label>Verification code</label>
                <input type="tel" className="code" maxLength="6" placeholder="000000" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} />
              </div>
              <button type="submit" className="btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify and continue'}</button>
              <p className="note">This is what keeps your trial yours. One account per number.</p>
            </form>
            <p className="resend">
              Did not get it?{' '}
              <button onClick={resend} disabled={cooldown > 0 || loading}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </p>
          </>
        )}
      </div>
      <div id="recaptcha-container" />
    </main>
  );
}
