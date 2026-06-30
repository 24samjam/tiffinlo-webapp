// pages/checkout.jsx. Review and Razorpay payment.
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Checkout() {
  const router = useRouter();
  const [journey, setJourney] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setJourney(JSON.parse(localStorage.getItem('tiffinlo_journey') || 'null'));
    setUser({
      name: localStorage.getItem('tiffinlo_user_name') || '',
      phone: localStorage.getItem('tiffinlo_user_phone') || ''
    });
  }, []);

  const pay = () => {
    setLoading(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_xxxxx',
        amount: (journey?.total || 0) * 100,
        currency: 'INR',
        name: 'tiffinlo',
        description: `${journey?.plan?.label} subscription`,
        prefill: { name: user.name, contact: user.phone },
        theme: { color: '#20503B' },
        handler: async (res) => {
          localStorage.setItem('tiffinlo_payment', JSON.stringify({ paymentId: res.razorpay_payment_id, ts: new Date().toISOString(), amount: journey.total }));
          try {
            if (auth.currentUser) {
              await addDoc(collection(db, 'users', auth.currentUser.uid, 'orders'), {
                ...journey, paymentId: res.razorpay_payment_id, status: 'active', createdAt: serverTimestamp()
              });
            }
          } catch (e) {}
          setLoading(false);
          router.push('/success');
        },
        modal: { ondismiss: () => setLoading(false) }
      };
      new window.Razorpay(options).open();
    };
  };

  if (!journey) return null;

  return (
    <main className="main">
      <style jsx>{`
        .main { min-height: calc(100vh - 240px); }
        .container { max-width: 540px; margin: 0 auto; padding: 56px 24px; }
        h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(27px, 6vw, 36px); letter-spacing: -0.6px; color: var(--green); margin-bottom: 8px; }
        .sub { color: #5a665d; margin-bottom: 26px; }
        .panel { background: var(--green); border-radius: 18px; padding: 24px; color: var(--cream); margin-bottom: 22px; }
        .panel h3 { font-family: var(--serif); font-weight: 500; font-size: 20px; margin-bottom: 10px; }
        .panel p { font-size: 14px; color: rgba(244,239,227,0.85); margin-bottom: 4px; }
        .sec-h { font-size: 15px; color: var(--green); font-weight: 500; margin: 18px 0 10px; }
        .addr { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin-bottom: 10px; font-size: 14px; }
        .addr strong { display: block; font-weight: 500; margin-bottom: 3px; }
        .addr span { color: #6a756c; font-size: 13px; }
        .summary { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 18px; margin-bottom: 22px; }
        .summary .row { display: flex; justify-content: space-between; padding: 9px 0; font-size: 14px; border-bottom: 1px dashed var(--line); }
        .summary .row:last-child { border-bottom: none; font-weight: 600; font-size: 16px; margin-top: 8px; }
        .summary .row span { color: var(--sage); }
        .btn { width: 100%; background: var(--clay); color: #fff; font-weight: 500; font-size: 16px; border: none; border-radius: 12px; padding: 16px; cursor: pointer; transition: background 0.2s; }
        .btn:hover:not(:disabled) { background: #a8552f; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .note { font-size: 12px; color: var(--sage); text-align: center; margin-top: 14px; }
      `}</style>
      <div className="container">
        <button className="backlink" onClick={() => router.back()}>‹ Back</button>
        <h2>You are almost there.</h2>
        <p className="sub">Secure payment through Razorpay.</p>

        <div className="panel">
          <h3>{journey.plan?.label}</h3>
          <p>₹{journey.total?.toLocaleString('en-IN')} total</p>
          <p>{journey.days?.join(', ')} each week</p>
        </div>

        <div className="sec-h">Delivery</div>
        {journey.addresses?.map((a, i) => (
          <div className="addr" key={i}>
            <strong>{a.building}, {a.area?.name} {a.area?.pincode}</strong>
            <span>{a.days?.join(', ')}</span>
          </div>
        ))}

        <div className="sec-h">Pricing</div>
        <div className="summary">
          <div className="row"><span>{journey.plan?.label}</span><strong>₹{journey.total?.toLocaleString('en-IN')}</strong></div>
          <div className="row"><span>Taxes and fees</span><strong>Included</strong></div>
          <div className="row"><span>Total</span><strong>₹{journey.total?.toLocaleString('en-IN')}</strong></div>
        </div>

        <button className="btn" onClick={pay} disabled={loading}>{loading ? 'Processing...' : 'Pay now'}</button>
        <p className="note">Secure payment through Razorpay. We will send a confirmation to your WhatsApp.</p>
      </div>
    </main>
  );
}
