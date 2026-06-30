// pages/success.jsx. Order confirmation.
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Success() {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setOrder(JSON.parse(localStorage.getItem('tiffinlo_journey') || 'null'));
  }, []);

  return (
    <main className="main">
      <style jsx>{`
        .main { min-height: calc(100vh - 240px); display: flex; align-items: center; }
        .container { max-width: 520px; margin: 0 auto; padding: 70px 24px; text-align: center; }
        .check { width: 78px; height: 78px; border-radius: 50%; background: var(--green); color: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 42px; margin: 0 auto 30px; }
        h1 { font-family: var(--serif); font-weight: 600; font-size: 40px; color: var(--green); margin-bottom: 12px; line-height: 1.05; }
        h1 .lo { color: var(--clay); }
        .sub { font-size: 17px; color: #5a665d; margin-bottom: 30px; max-width: 400px; margin-left: auto; margin-right: auto; }
        .details { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 22px; margin-bottom: 30px; text-align: left; }
        .row { display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px dashed var(--line); font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .row span { color: var(--sage); }
        .btn { display: inline-block; background: var(--green); color: var(--cream); font-weight: 500; padding: 15px 30px; border-radius: 12px; }
        .btn:hover { background: var(--forest); }
        .note { font-size: 13px; color: var(--sage); margin-top: 22px; }
      `}</style>
      <div className="container">
        <div className="check">✓</div>
        <h1>Tiffin<span className="lo">lo</span> set.</h1>
        <p className="sub">Your first meal lands next week. Watch your WhatsApp for the delivery schedule.</p>
        {order && (
          <div className="details">
            <div className="row"><span>Plan</span><strong>{order.plan?.label}</strong></div>
            <div className="row"><span>Starting</span><strong>Next Monday</strong></div>
            <div className="row"><span>Delivery</span><strong>7 to 9 PM</strong></div>
            <div className="row"><span>Total</span><strong>₹{order.total?.toLocaleString('en-IN')}</strong></div>
          </div>
        )}
        <button className="btn" onClick={() => router.push('/')}>Back home</button>
        <p className="note">Questions? We are on WhatsApp at tiffinlo or hello@tiffinlo.com. See you soon.</p>
      </div>
    </main>
  );
}
