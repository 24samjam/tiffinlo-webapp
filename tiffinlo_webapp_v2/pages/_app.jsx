// pages/_app.jsx. App shell. Header with location selector and social, footer.
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AREAS, SOCIAL } from '../data';
import { useAuth } from '../lib/useAuth';
import '../styles/globals.css';

// Steam only mark, clay wisps. Used on GREEN backgrounds only.
function SteamMark({ size = 30 }) {
  return (
    <svg width={size} height={size * 0.67} viewBox="0 0 58 39" fill="none" aria-hidden="true">
      <path d="M11.8011 32.5929C11.5116 32.9742 11.2033 33.3414 10.8809 33.6874L10.0783 34.4923C9.56987 35.0031 9.09679 35.5138 8.7202 35.9728C8.53191 36.2034 8.37657 36.4223 8.26124 36.6036C8.15062 36.7824 8.04941 36.9213 8.02588 37.1284C7.99763 37.3497 8.11296 37.6486 8.33891 37.9475C8.56486 38.2417 8.88025 38.5265 9.24978 38.8113C8.812 38.9808 8.33421 39.0372 7.82582 38.976C7.31978 38.9172 6.76432 38.6913 6.30065 38.2088C5.84169 37.7263 5.58514 37.0131 5.54512 36.3847C5.50041 35.7492 5.59691 35.1749 5.74048 34.6571C6.02998 33.6262 6.51012 32.7906 7.02322 32.0234C7.27977 31.6468 7.59751 31.2655 7.82346 30.9713C8.04941 30.7053 8.25889 30.4323 8.44954 30.1616C9.22624 29.0813 9.76993 28.1069 9.97235 26.963C10.1842 25.805 9.94881 24.3245 9.24978 22.6276C11.0644 23.0089 12.6791 24.527 13.2063 26.65C13.4675 27.6973 13.411 28.8483 13.131 29.858C12.8532 30.8889 12.3613 31.7974 11.8011 32.5929Z" fill="#E0966B"/>
      <path d="M26.9119 29.3701C26.4768 29.9432 26.0098 30.4951 25.5287 31.0151L24.3259 32.2249C23.5618 32.9926 22.8543 33.7602 22.2742 34.45C22.0018 34.7967 21.7683 35.1257 21.5914 35.3981C21.4181 35.667 21.273 35.8757 21.2447 36.187C21.1987 36.5195 21.3685 36.9688 21.7082 37.418C22.0442 37.8602 22.5218 38.2883 23.0843 38.7163C22.4192 38.971 21.6975 39.0559 20.937 38.9639C20.1799 38.8755 19.3345 38.5359 18.6446 37.8107C17.9477 37.0855 17.5692 36.0136 17.5055 35.0691C17.4383 34.114 17.5798 33.2508 17.7956 32.4726C18.2378 30.9231 18.963 29.6673 19.7342 28.514C20.1127 27.948 20.5938 27.3749 20.9334 26.9328C21.266 26.533 21.5879 26.1227 21.8673 25.7158C23.0383 24.0921 23.859 22.6276 24.1632 20.9083C24.4816 19.1749 24.1349 16.9498 23.0878 14.3992C25.8117 14.9723 28.2349 17.254 29.0238 20.4449C29.4165 22.0191 29.3351 23.749 28.9141 25.2666C28.4896 26.8089 27.7644 28.1744 26.9119 29.3701Z" fill="#E0966B"/>
      <path d="M48.312 23.738C47.628 24.6463 46.8935 25.5209 46.1254 26.3451L44.2136 28.2625C43.0026 29.4791 41.8869 30.6957 40.9786 31.789C40.5301 32.3385 40.1601 32.8599 39.8854 33.2916C39.6219 33.7177 39.392 34.0485 39.3247 34.5418C39.2518 35.0688 39.5322 35.7809 40.0704 36.4929C40.603 37.1937 41.3599 37.8721 42.2513 38.5505C41.1973 38.9542 40.0536 39.0887 38.8594 38.943C37.654 38.8028 36.3196 38.2646 35.2151 37.1152C34.1219 35.9659 33.5164 34.2671 33.421 32.7702C33.3089 31.2564 33.5388 29.8884 33.8808 28.655C34.5704 26.1993 35.7085 24.209 36.9363 22.3813C37.5475 21.4842 38.3043 20.576 38.8426 19.8751C39.3808 19.2416 39.8854 18.5913 40.3339 17.9465C42.184 15.3731 43.4792 13.052 43.9557 10.3272C44.4659 7.56881 43.9053 4.04231 42.2513 0C46.5684 0.908258 50.42 4.52447 51.6647 9.58156C52.2814 12.0765 52.1525 14.8181 51.4853 17.2233C50.8237 19.6789 49.6632 21.843 48.312 23.738Z" fill="#E0966B"/>
    </svg>
  );
}

const SOCIAL_ICONS = {
  instagram: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 1.8c-3.1 0-3.5 0-4.7.1-.9 0-1.4.2-1.7.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.8-.3 1.7-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 .9.2 1.4.3 1.7.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.8.3 1.7.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.8.3-1.7.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-.9-.2-1.4-.3-1.7-.2-.4-.4-.7-.7-1-.3-.3-.6-.5-1-.7-.3-.1-.8-.3-1.7-.3-1.2-.1-1.6-.1-4.7-.1m0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8m0 1.8a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2m5.1-3.2a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3z',
  x: 'M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21H2.5l7-8L2.6 3h6.1l4.3 5.6L17.5 3zm-1 16h1.7L7.5 4.8H5.7L16.5 19z',
  facebook: 'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.4v8h3.5z',
  youtube: 'M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4.1 12 4.1 12 4.1s-4 0-6.8.2c-.4 0-1.3.1-2 .9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.4v1.5C2.2 13.5 2.4 15 2.4 15s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.5.1 6.5.2 6.5.2s4 0 6.8-.2c.4 0 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.1v-1.5c0-1.6-.2-3.1-.2-3.1zM9.9 14.6V8.9l5.3 2.9-5.3 2.8z'
};

function AuthLink() {
  const { user, loading } = useAuth();
  return (
    <span className="authwrap">
      <style jsx>{`
        .authwrap { display: flex; align-items: center; gap: 14px; }
        .ghost { font-size: 14px; color: var(--cream); opacity: 0.85; transition: opacity 0.18s; }
        .ghost:hover { opacity: 1; }
        .solid { font-size: 14px; color: #fff; background: var(--clay); padding: 9px 20px; border-radius: 999px; font-weight: 500; box-shadow: 0 4px 14px rgba(195,106,67,0.35); transition: all 0.18s; }
        .solid:hover { background: #a8552f; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(195,106,67,0.45); }
      `}</style>
      {loading ? null : user ? (
        <Link href="/account" className="ghost">Account</Link>
      ) : (
        <>
          <Link href="/login" className="ghost">Log in</Link>
          <Link href="/signup" className="solid">Sign up</Link>
        </>
      )}
    </span>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [area, setArea] = useState(AREAS[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tiffinlo_area') || 'null');
      if (saved) setArea(saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const select = (a) => {
    setArea(a);
    setOpen(false);
    try { localStorage.setItem('tiffinlo_area', JSON.stringify(a)); } catch (e) {}
  };

  return (
    <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
      <style jsx>{`
        .hdr { background: rgba(32,80,59,0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color: var(--cream); padding: 8px 0; position: sticky; top: 0; z-index: 100; transition: background 0.28s ease, box-shadow 0.28s ease, padding 0.28s ease; }
        .hdr.scrolled { background: rgba(23,58,42,0.92); box-shadow: 0 4px 20px rgba(0,0,0,0.18); padding: 6px 0; }
        .wrap { max-width: 1140px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .brand { display: flex; align-items: center; gap: 9px; }
        .wm { font-family: var(--serif); font-weight: 600; font-size: 21px; letter-spacing: -0.4px; }
        .wm .lo { color: var(--clay-light); }
        .right { display: flex; align-items: center; gap: 20px; }
        .loc { position: relative; }
        .loc-label { font-size: 11px; color: var(--sage); letter-spacing: 0.4px; margin-bottom: 2px; }
        .pill { display: flex; align-items: center; gap: 8px; background: rgba(244,239,227,0.08); border: 1px solid rgba(244,239,227,0.22); color: var(--cream); padding: 7px 13px; border-radius: 999px; cursor: pointer; font-size: 14px; }
        .pill .pin { font-family: var(--mono); font-size: 12px; color: var(--clay-light); }
        .pill .chev { font-size: 11px; opacity: 0.7; }
        .menu { position: absolute; top: calc(100% + 8px); right: 0; background: var(--cream); color: var(--ink); border-radius: 14px; padding: 8px; width: 280px; max-height: 340px; overflow-y: auto; box-shadow: 0 16px 40px rgba(23,58,42,0.28); z-index: 120; }
        .grp { font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--sage); padding: 10px 12px 6px; }
        .opt { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 10px; cursor: pointer; font-size: 14px; }
        .opt:hover { background: var(--cream-soft); }
        .opt.active { background: rgba(32,80,59,0.08); }
        .opt .p { font-family: var(--mono); font-size: 12px; color: var(--sage); }
        .social { display: flex; align-items: center; gap: 12px; }
        .social a { opacity: 0.78; transition: opacity 0.15s; display: flex; }
        .social a:hover { opacity: 1; }
        @media (max-width: 720px) {
          .social { display: none; }
          .wm { font-size: 20px; }
          .pill { font-size: 13px; padding: 6px 11px; }
          .menu { width: 240px; }
        }
      `}</style>
      <div className="wrap">
        <Link href="/" className="brand">
          <span className="brand">
            <SteamMark size={28} />
            <span className="wm">tiffin<span className="lo">lo</span></span>
          </span>
        </Link>
        <div className="right">
          <div className="loc" ref={ref}>
            <div className="loc-label">Starting from</div>
            <button className="pill" onClick={() => setOpen(!open)}>
              <span>{area.name}</span>
              <span className="pin">{area.pincode}</span>
              <span className="chev">▾</span>
            </button>
            {open && (
              <div className="menu no-scrollbar">
                <div className="grp">Peenya, 560058</div>
                {AREAS.filter(a => a.hub === 'Peenya').map((a) => (
                  <div key={a.name} className={`opt ${a.name === area.name ? 'active' : ''}`} onClick={() => select(a)}>
                    <span>{a.name}</span><span className="p">{a.pincode}</span>
                  </div>
                ))}
                <div className="grp">Yashwantpur, 560022</div>
                {AREAS.filter(a => a.hub === 'Yashwantpur').map((a) => (
                  <div key={a.name} className={`opt ${a.name === area.name ? 'active' : ''}`} onClick={() => select(a)}>
                    <span>{a.name}</span><span className="p">{a.pincode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <AuthLink />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="ftr">
      <style jsx>{`
        .ftr { background: var(--forest); color: var(--cream); padding: 48px 0 36px; margin-top: 80px; }
        .wrap { max-width: 1140px; margin: 0 auto; padding: 0 24px; display: flex; flex-wrap: wrap; gap: 28px; justify-content: space-between; align-items: flex-start; }
        .brand { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
        .wm { font-family: var(--serif); font-weight: 600; font-size: 22px; }
        .wm .lo { color: var(--clay-light); }
        .tag { color: var(--sage); font-size: 14px; }
        .mission { font-size: 14px; margin-top: 14px; max-width: 280px; color: rgba(244,239,227,0.85); }
        .col h4 { font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: var(--sage); margin-bottom: 12px; }
        .col a, .col p { display: block; font-size: 14px; color: rgba(244,239,227,0.85); margin-bottom: 9px; }
        .col a:hover { color: var(--cream); }
        .social { display: flex; gap: 14px; margin-top: 8px; }
        .social a { opacity: 0.8; }
        .social a:hover { opacity: 1; }
        .base { max-width: 1140px; margin: 28px auto 0; padding: 18px 24px 0; border-top: 1px solid rgba(244,239,227,0.12); font-size: 12px; color: rgba(244,239,227,0.55); }
      `}</style>
      <div className="wrap">
        <div>
          <div className="brand"><SteamMark size={26} /><span className="wm">tiffin<span className="lo">lo</span></span></div>
          <div className="tag">ghar ka khana, roz</div>
          <p className="mission">Building India's most loved tiffin brand, one warm meal at a time.</p>
        </div>
        <div className="col">
          <h4>Tiffinlo</h4>
          <Link href="/signup">Start your journey</Link>
          <p>100 percent pure veg, eggless</p>
          <p>Peenya and Yashwantpur, Bengaluru</p>
        </div>
        <div className="col">
          <h4>Reach us</h4>
          <a href="mailto:hello@tiffinlo.com">hello@tiffinlo.com</a>
          <a href="https://tiffinlo.com">tiffinlo.com</a>
          <div className="social">
            {Object.entries(SOCIAL).map(([k, url]) => (
              <a key={k} href={url} target="_blank" rel="noreferrer" aria-label={k}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--cream)"><path d={SOCIAL_ICONS[k]} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="base">Tiffinlo, Bengaluru, Karnataka. Made with care.</div>
    </footer>
  );
}

export default function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
