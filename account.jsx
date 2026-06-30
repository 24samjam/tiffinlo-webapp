// pages/account.jsx. Protected account area.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../lib/useAuth';

export default function Account() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/login'); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        setProfile(snap.exists() ? snap.data() : null);
        const q = query(collection(db, 'users', user.uid, 'orders'), orderBy('createdAt', 'desc'));
        const os = await getDocs(q);
        setOrders(os.docs.map((d) => d.data()));
      } catch (e) {}
      setBusy(false);
    })();
  }, [user, loading]);

  const logout = async () => { await signOut(auth); router.push('/'); };

  if (loading || busy) return <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a665d' }}>Loading...</main>;

  return (
    <main className="main">
      <style jsx>{`
        .main { min-height: calc(100vh - 240px); }
        .container { max-width: 620px; margin: 0 auto; padding: 56px 24px; }
        h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(28px, 6vw, 38px); color: var(--green); margin-bottom: 6px; }
        .sub { color: #5a665d; margin-bottom: 28px; }
        .panel { background: var(--green); border-radius: 18px; padding: 24px; color: var(--cream); margin-bottom: 24px; }
        .panel .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; border-bottom: 1px solid rgba(244,239,227,0.14); }
        .panel .row:last-child { border-bottom: none; }
        .panel .row span { color: var(--sage); }
        .sec-h { font-family: var(--serif); font-size: 20px; color: var(--green); margin-bottom: 12px; }
        .order { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px; margin-bottom: 12px; }
        .order .top { display: flex; justify-content: space-between; font-weight: 500; color: var(--ink); }
        .order .meta { font-size: 13px; color: #6a756c; margin-top: 6px; }
        .empty { background: var(--cream); border-radius: 14px; padding: 24px; text-align: center; color: #5a665d; }
        .empty a { color: var(--clay); font-weight: 500; }
        .actions { display: flex; gap: 12px; margin-top: 28px; }
        .btn-ghost { border: 1.5px solid var(--line); background: #fff; color: var(--green); padding: 12px 20px; border-radius: 12px; cursor: pointer; font-size: 15px; }
        .btn-ghost:hover { border-color: var(--green); }
      `}</style>
      <div className="container">
        <h2>Hello, {profile?.name || 'friend'}.</h2>
        <p className="sub">Your tiffinlo account.</p>

        <div className="panel">
          <div className="row"><span>Name</span><strong>{profile?.name || '-'}</strong></div>
          <div className="row"><span>Phone</span><strong>{profile?.phone || '-'}</strong></div>
          <div className="row"><span>Home state</span><strong>{profile?.home || 'Not set'}</strong></div>
          <div className="row"><span>Veg style</span><strong>{profile?.veg || 'Regular'}</strong></div>
        </div>

        <div className="sec-h">Your subscriptions</div>
        {orders.length === 0 ? (
          <div className="empty">No active plan yet. <Link href="/journey">Start your tiffin journey</Link></div>
        ) : (
          orders.map((o, i) => (
            <div className="order" key={i}>
              <div className="top"><span>{o.plan?.label || 'Plan'}</span><span>₹{(o.total || 0).toLocaleString('en-IN')}</span></div>
              <div className="meta">{(o.days || []).join(', ')} · delivery 7 to 9 PM</div>
            </div>
          ))
        )}

        <div className="actions">
          <Link href="/journey" className="cta"><span>New subscription</span><span className="food-icon">🥄</span></Link>
          <button className="btn-ghost" onClick={logout}>Log out</button>
        </div>
      </div>
    </main>
  );
}
