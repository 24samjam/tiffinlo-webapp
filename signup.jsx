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

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const confirmRef = useRef(null);

  const setupRecaptcha = () => {
    if (typeof window === 'undefined') return;
    if (!window._recaptcha) {
      window._recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    }
    return window._recaptcha;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please tell us your name first.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (phone.length !== 10) { setError('Please enter a valid 10 digit number.'); return; }
    setLoading(true);
    try {
      if (!auth) { setError('Backend not connected yet. Add Firebase keys, see SETUP_BACKEND.md'); setLoading(false); return; }
      const verifier = setupRecaptcha();
      confirmRef.current = await signInWithPhoneNumber(auth, '+91' + phone, verifier);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Could not send the code. Please try again.');
      if (window._recaptcha) { try { window._recaptcha.clear(); } catch (e) {} window._recaptcha = null; }
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
        .link { text-align: center; margin-top: 18px; font-size: 14px; color: #5a665d; }
        .link a { color: var(--clay); font-weight: 500; }
        .error { background: #fdeceb; color: #b3322c; padding: 10px 13px; border-radius: 10px; font-size: 14px; margin-bottom: 16px; }
      `}</style>
      <div className="container">
        <button className="backlink" onClick={() => (step === 'otp' ? setStep('phone') : router.back())}>‹ Back</button>
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
          </>
        )}
      </div>
      <div id="recaptcha-container" />
    </main>
  );
}
