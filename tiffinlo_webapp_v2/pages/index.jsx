// pages/index.jsx. Landing page.
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HERO_PHRASES, MENU, IMAGES } from '../data';

function Photo({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #2c5d45, #20503B 60%, #173A2A)', ...style }}>
      {!failed && (
        <img src={src} alt={alt} onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}
    </div>
  );
}

// Original hand drawn doodles. Loose line, expressive, brand colors.
const dStroke = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 5.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const dDot = { fill: 'var(--ink)' };
const dBlush = { fill: 'none', stroke: 'var(--clay-light)', strokeWidth: 4, strokeLinecap: 'round' };

// Down and hungry, a small tear, dreaming of home
function DoodleSad() {
  return (
    <svg viewBox="0 0 200 200" className="doodle">
      <path style={dStroke} d="M100 50 C146 50 162 88 158 120 C155 146 132 162 100 162 C68 162 45 146 42 120 C38 88 54 50 100 50 Z" />
      <circle cx="84" cy="106" r="4.5" style={dDot} /><circle cx="116" cy="106" r="4.5" style={dDot} />
      <path style={dBlush} d="M70 118 q5 4 10 0" /><path style={dBlush} d="M120 118 q5 4 10 0" />
      <path style={dStroke} d="M88 134 q12 -8 24 0" />
      <path style={{ ...dStroke, stroke: 'var(--sage)', strokeWidth: 4 }} d="M84 113 C82 122 84 129 87 129 C90 129 90 122 88 113" />
      <path style={dStroke} d="M50 122 C58 150 86 156 100 150" /><path style={dStroke} d="M150 122 C142 150 114 156 100 150" />
      <circle cx="26" cy="72" r="3" style={dDot} /><circle cx="40" cy="63" r="3" style={dDot} /><circle cx="56" cy="57" r="3" style={dDot} />
    </svg>
  );
}
// Tired, thinking, hand to chin
function DoodleThink() {
  return (
    <svg viewBox="0 0 200 200" className="doodle">
      <path style={dStroke} d="M102 46 C148 46 166 86 160 118 C155 146 128 162 96 160 C66 158 46 140 46 110 C46 76 62 46 102 46 Z" />
      <circle cx="88" cy="100" r="4.5" style={dDot} /><circle cx="120" cy="100" r="4.5" style={dDot} />
      <path style={dBlush} d="M74 112 q5 4 10 0" /><path style={dBlush} d="M124 112 q5 4 10 0" />
      <path style={dStroke} d="M94 124 l18 -1" />
      <path style={dStroke} d="M150 120 C150 140 128 142 114 130" />
      <circle cx="166" cy="64" r="3" style={dDot} /><circle cx="178" cy="55" r="3" style={dDot} /><circle cx="186" cy="47" r="3" style={dDot} />
    </svg>
  );
}
// Caring, holding a warm little heart
function DoodleHeart() {
  return (
    <svg viewBox="0 0 200 200" className="doodle">
      <path style={dStroke} d="M104 44 C148 44 166 84 160 116 C155 144 128 158 96 156 C70 154 50 138 50 110 C50 74 64 44 104 44 Z" />
      <circle cx="92" cy="94" r="4.5" style={dDot} /><circle cx="124" cy="94" r="4.5" style={dDot} />
      <path style={dBlush} d="M78 106 q5 4 10 0" /><path style={dBlush} d="M128 106 q5 4 10 0" />
      <path style={dStroke} d="M98 114 q10 6 20 0" />
      <path style={{ ...dStroke, stroke: 'var(--clay)', fill: 'var(--clay-light)' }} d="M100 134 C95 126 82 130 86 141 C89 149 100 158 106 164 C112 158 124 149 127 141 C131 130 118 126 113 134 Z" />
      <path style={dStroke} d="M58 112 C66 134 80 140 92 138" />
    </svg>
  );
}
// Content, eyes closed, hands together
function DoodleHappy() {
  return (
    <svg viewBox="0 0 200 200" className="doodle">
      <path style={dStroke} d="M100 46 C146 46 164 84 160 116 C157 144 132 160 100 160 C68 160 43 144 40 116 C36 84 54 46 100 46 Z" />
      <path style={dStroke} d="M80 98 Q88 105 96 98" /><path style={dStroke} d="M104 98 Q112 105 120 98" />
      <path style={dBlush} d="M70 110 q5 4 10 0" /><path style={dBlush} d="M120 110 q5 4 10 0" />
      <path style={dStroke} d="M86 118 Q100 130 114 118" />
      <path style={dStroke} d="M56 116 C72 138 90 140 100 134 C110 140 128 138 144 116" />
    </svg>
  );
}

// Line art trust icons
const iStroke = { fill: 'none', stroke: 'var(--green)', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconLeaf() { return <svg viewBox="0 0 48 48" className="ticon"><path style={iStroke} d="M12 36 C12 18 30 12 38 10 C38 28 26 38 12 36 Z" /><path style={iStroke} d="M12 36 L30 18" /></svg>; }
function IconVeg() { return <svg viewBox="0 0 48 48" className="ticon"><rect x="10" y="10" width="28" height="28" rx="5" style={iStroke} /><circle cx="24" cy="24" r="6" style={{ fill: 'var(--green)' }} /></svg>; }
function IconBowl() { return <svg viewBox="0 0 48 48" className="ticon"><path style={iStroke} d="M10 26 H38 C38 34 32 38 24 38 C16 38 10 34 10 26 Z" /><path style={iStroke} d="M20 18 Q22 14 20 10" /><path style={iStroke} d="M28 18 Q30 14 28 10" /></svg>; }
function IconArrow() { return <svg viewBox="0 0 48 48" className="ticon"><path style={iStroke} d="M10 24 H36" /><path style={iStroke} d="M26 14 L38 24 L26 34" /></svg>; }
function IconCare() { return <svg viewBox="0 0 48 48" className="ticon"><path style={iStroke} d="M24 38 C10 28 8 18 16 14 C21 11 24 16 24 18 C24 16 27 11 32 14 C40 18 38 28 24 38 Z" /></svg>; }

// Small steam accent for section headings
function SteamAccent() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" style={{ display: 'block', margin: '0 auto 14px' }}>
      <path d="M8 24 C5 19 11 16 8 11 C6 7 9 4 8 2" stroke="var(--clay-light)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 24 C14 18 20 15 17 9 C15 5 18 3 17 1" stroke="var(--clay)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 24 C23 19 29 16 26 11 C24 7 27 4 26 2" stroke="var(--clay-light)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % HERO_PHRASES.length), 2500);
    return () => clearInterval(t);
  }, []);
  const phrase = HERO_PHRASES[i];

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const trust = [
    { t: 'Cooked fresh, same day', s: 'Nothing pre made, nothing reheated. Your meal is made the evening it reaches you.' },
    { t: 'Hairnet, gloves, clean station', s: 'Every meal is prepared following strict kitchen hygiene, the way you would want at home.' },
    { t: 'Pure veg and always eggless', s: 'No exceptions, ever. A promise your parents can trust with their eyes closed.' },
    { t: 'No preservatives', s: 'Real ingredients, real ghar ka khana. Nothing that does not belong on your plate.' },
    { t: 'Brought straight to you', s: 'No food apps in between, no markup. Cooked by us, delivered by us, to your door.' }
  ];

  return (
    <main>
      <style jsx>{`
        .hero { background: radial-gradient(circle at 50% 22%, #285f47, var(--green) 58%, #1c4734); color: var(--cream); overflow: hidden; }
        .hero-wrap-center { max-width: 1140px; margin: 0 auto; padding: 120px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; animation: heroIn 0.9s ease both; }
        @keyframes heroIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .eyebrow { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: var(--sage); margin-bottom: 22px; }
        h1 { font-family: var(--serif); font-weight: 600; font-size: clamp(38px, 5.4vw, 68px); line-height: 1.04; letter-spacing: -1.4px; min-height: 1.1em; }
        h1 .lo { color: var(--clay-light); }
        .phrase { display: inline-block; animation: rise 0.6s ease; }
        @keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .sub { font-size: clamp(17px, 2.2vw, 20px); color: rgba(244,239,227,0.86); margin: 26px 0 38px; max-width: 560px; }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.in { opacity: 1; transform: none; }
        .cta { display: inline-flex; align-items: center; gap: 10px; background: var(--clay); color: #fff; font-weight: 500; font-size: 16px; padding: 15px 30px; border-radius: 999px; transition: all 0.2s; position: relative; overflow: hidden; }
        .cta:hover { background: #a8552f; transform: translateY(-2px); }
        .cta .food-icon { display: inline-block; animation: spin-food 0.8s ease-in-out; }
        .cta:hover .food-icon { animation: spin-food 0.8s ease-in-out infinite; }
        @keyframes spin-food { 0%, 100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(12deg) scale(1.15); } }

        .why { background: var(--cream); padding: 92px 24px; text-align: center; }
        .why h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(28px, 4vw, 40px); color: var(--green); letter-spacing: -0.5px; }
        .why .lead { color: #5a665d; max-width: 540px; margin: 14px auto 0; font-size: 17px; }

        .story { max-width: 980px; margin: 80px auto; padding: 54px 40px; text-align: center; background: #fff; border-radius: 30px; box-shadow: 0 16px 54px rgba(23,58,42,0.07); }
        .story-head h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(26px, 3.6vw, 38px); color: var(--green); letter-spacing: -0.5px; line-height: 1.14; max-width: 760px; margin: 0 auto; }
        .story-quote { font-family: var(--serif); font-size: clamp(18px, 2.4vw, 22px); color: var(--clay); margin-top: 18px; font-style: italic; }
        .strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin-top: 44px; }
        .panel { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .panel span { font-size: 14px; color: #5a665d; max-width: 200px; line-height: 1.45; }
        .doodle { width: 100%; max-width: 130px; height: auto; animation: float 4.5s ease-in-out infinite; }
        .panel:nth-child(2) .doodle { animation-delay: 0.6s; }
        .panel:nth-child(3) .doodle { animation-delay: 1.2s; }
        .panel:nth-child(4) .doodle { animation-delay: 1.8s; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .panel:hover .doodle { animation: wobble 0.6s ease; }
        @keyframes wobble { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-3deg); } 75% { transform: rotate(3deg); } }

        .trust { max-width: 1140px; margin: 90px auto 0; padding: 0 24px; }
        .trust-head { font-family: var(--serif); font-weight: 500; font-size: 24px; color: var(--green); text-align: center; margin-bottom: 28px; }
        .trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .trust-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 24px 22px; text-align: center; transition: all 0.25s; }
        .trust-card:hover { transform: translateY(-4px); border-color: var(--green); }
        .trust-icon { width: 48px; height: 48px; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; }
        .ticon { width: 44px; height: 44px; animation: pulse-icon 2.4s ease-in-out infinite; }
        .trust-card:hover .ticon { animation: bounce-icon 0.6s ease-in-out; }
        @keyframes pulse-icon { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes bounce-icon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .trust-card h4 { font-family: var(--serif); font-weight: 500; font-size: 17px; color: var(--green); margin-bottom: 7px; }
        .trust-card p { font-size: 13.5px; color: #6a756c; }

        .menu { max-width: 1180px; margin: 90px auto 0; padding: 56px 28px; background: var(--cream); border-radius: 30px; }
        .menu-head { text-align: center; margin-bottom: 14px; }
        .menu-head h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(28px, 4vw, 40px); color: var(--green); letter-spacing: -0.5px; }
        .menu-head p { color: #5a665d; margin-top: 10px; }
        .cuisine { margin-top: 36px; }
        .cuisine-name { font-family: var(--serif); font-weight: 500; font-size: 22px; color: var(--green); margin: 0 4px 14px; display: flex; align-items: center; gap: 10px; }
        .cuisine-name .veg { width: 15px; height: 15px; border: 1.6px solid #2e8b57; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; }
        .cuisine-name .veg::after { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #2e8b57; }
        .rail { display: flex; gap: 16px; overflow-x: auto; padding: 4px 4px 18px; scroll-snap-type: x mandatory; }
        .marquee { overflow: hidden; padding: 4px 0 8px; -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent); mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent); }
        .marquee-track { display: flex; gap: 16px; width: max-content; animation-name: scrollx; animation-timing-function: linear; animation-iteration-count: infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        @keyframes scrollx { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .dish { flex: 0 0 190px; }
        .dish-name { font-size: 15px; font-weight: 500; color: var(--ink); padding: 0 2px; min-height: 38px; line-height: 1.25; }

        .closer { text-align: center; padding: 70px 24px 20px; display: flex; flex-direction: column; align-items: center; }
        .closer-doodle { width: 110px; margin-bottom: 8px; }
        .closer h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(26px, 4vw, 38px); color: var(--green); margin-bottom: 24px; }

        @media (max-width: 820px) {
          .hero-wrap-center { padding: 80px 24px; }
          .strip { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        @media (max-width: 480px) {
          .strip { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="hero">
        <div className="hero-wrap-center">
          <p className="eyebrow">ghar ka khana, roz</p>
          <h1>
            <span className="phrase" key={i}>
              {phrase.prefix}<span className="lo">tiffinlo</span>{phrase.suffix}
            </span>
          </h1>
          <p className="sub">Warm, home style tiffins cooked fresh every day and brought right to your door. Now beginning in Peenya and Yashwantpur.</p>
          <Link href="/signup" className="cta"><span>Start my tiffin journey</span><span className="food-icon">🥄</span></Link>
        </div>
      </section>

      <section className="why reveal">
        <SteamAccent />
        <h2>Not a cloud kitchen. A real one.</h2>
        <p className="lead">Food that someone cooks for you with their own hands, the way home does. Made fresh each day, priced gently, carried warm to your door.</p>
      </section>

      <section className="story reveal">
        <div className="story-head">
          <h2>The day you left home, someone started worrying about your food.</h2>
          <p className="story-quote">Beta, tiffinlo laga dena. Baaki tension chhodo.</p>
        </div>
        <div className="strip">
          <div className="panel"><DoodleSad /><span>New city. Mess food, again and again.</span></div>
          <div className="panel"><DoodleThink /><span>Ordering in every night. Not kind to the wallet.</span></div>
          <div className="panel"><DoodleHeart /><span>Back home, someone quietly worries.</span></div>
          <div className="panel"><DoodleHappy /><span>So we cook fresh, daily. You just relax.</span></div>
        </div>
      </section>

      <div className="trust reveal">
        <div className="trust-head">Why parents stop worrying</div>
        <div className="trust-grid">
          {[
            { Icon: IconLeaf, title: 'Fresh daily', desc: 'Cooked same day, brought fresh.' },
            { Icon: IconVeg, title: 'Pure veg', desc: 'No exceptions, always eggless.' },
            { Icon: IconBowl, title: 'Home cooked', desc: 'The way you would at home.' },
            { Icon: IconArrow, title: 'Direct', desc: 'No apps in between, no markup.' },
            { Icon: IconCare, title: 'With care', desc: 'Made like someone is watching.' }
          ].map(({ Icon, title, desc }) => (
            <div className="trust-card" key={title}>
              <div className="trust-icon"><Icon /></div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="menu reveal">
        <div className="menu-head">
          <SteamAccent />
          <h2>A taste of what is cooking</h2>
          <p>A little look at our rotating home style menu. Always pure veg, always eggless. You choose your style when you begin.</p>
        </div>
        {MENU.map((cz, ci) => (
          <div className="cuisine" key={cz.cuisine}>
            <div className="cuisine-name"><span className="veg" />{cz.cuisine}</div>
            <div className="marquee">
              <div className="marquee-track" style={{ animationDuration: `${cz.dishes.length * 5}s`, animationDirection: ci % 2 ? 'reverse' : 'normal' }}>
                {[...cz.dishes, ...cz.dishes].map((dish, di) => (
                  <div className="dish" key={dish + di}>
                    <Photo className="dish-photo" style={{ height: 150, borderRadius: 16, marginBottom: 10 }} src={IMAGES.pool[di % IMAGES.pool.length]} alt={dish} />
                    <div className="dish-name">{dish}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="closer reveal">
        <div className="closer-doodle"><DoodleHappy /></div>
        <h2>Ready to eat like home again?</h2>
        <Link href="/signup" className="cta"><span>Start my tiffin journey</span><span className="food-icon">🥄</span></Link>
      </section>
    </main>
  );
}
