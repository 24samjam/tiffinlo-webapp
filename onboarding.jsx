// pages/onboarding.jsx. Story driven onboarding.
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AVATAR_LETTERS, STATES } from '../data';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState({ name: '', who: '', whoElse: '', home: '', cuisine: '', veg: '' });

  useEffect(() => {
    setState((p) => ({ ...p, name: localStorage.getItem('tiffinlo_user_name') || '' }));
  }, []);

  const total = 6;
  const progress = (step / (total - 1)) * 100;
  const set = (k, v) => setState((p) => ({ ...p, [k]: v }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    localStorage.setItem('tiffinlo_onboarding', JSON.stringify(state));
    if (auth.currentUser) {
      setDoc(doc(db, 'users', auth.currentUser.uid), {
        who: state.who === 'Other' ? state.whoElse : state.who,
        home: state.home, cuisine: state.cuisine, veg: state.veg
      }, { merge: true }).catch(() => {});
    }
    router.push('/journey');
  };

  const cuisines = ['North Indian', 'South Indian', 'Punjabi', 'Bengali', 'Gujarati', 'Surprise me'];

  return (
    <main className="main">
      <style jsx>{`
        .main { min-height: calc(100vh - 240px); padding-top: 22px; }
        .topbar { max-width: 540px; margin: 0 auto 30px; width: 100%; display: flex; align-items: center; gap: 14px; padding: 0 24px; }
        .back { border: none; background: none; cursor: pointer; color: var(--sage); font-size: 22px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .back:hover { background: rgba(126,154,126,0.16); }
        .back.hide { visibility: hidden; }
        .progress { flex: 1; height: 5px; background: rgba(32,80,59,0.1); border-radius: 999px; overflow: hidden; }
        .progress span { display: block; height: 100%; background: var(--green); border-radius: 999px; transition: width 0.45s ease; }
        .mark { font-family: var(--serif); font-weight: 600; font-size: 18px; color: var(--green); }
        .mark .lo { color: var(--clay); }
        .stage { max-width: 540px; margin: 0 auto; padding: 0 24px 60px; animation: slide 0.45s ease; }
        @keyframes slide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .speaker { display: flex; align-items: center; gap: 9px; margin-bottom: 16px; }
        .em { font-size: 13px; letter-spacing: 0.4px; color: var(--sage); }
        h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(27px, 6vw, 36px); line-height: 1.12; letter-spacing: -0.6px; color: var(--green); margin-bottom: 12px; }
        h2 .lo { color: var(--clay); }
        .helper { font-size: 15px; color: #5a665d; margin-bottom: 26px; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: var(--cream); border: 1px solid rgba(32,80,59,0.2); color: var(--green); font-size: 13px; font-weight: 500; padding: 7px 13px; border-radius: 999px; margin-bottom: 22px; }
        .badge .sq { width: 13px; height: 13px; border: 1.5px solid var(--green); border-radius: 3px; display: flex; align-items: center; justify-content: center; }
        .badge .sq::after { content: ''; width: 6px; height: 6px; background: var(--green); border-radius: 50%; }
        .opts { display: flex; flex-direction: column; gap: 12px; }
        .opts.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .opt { text-align: left; background: #fff; border: 1.5px solid var(--line); border-radius: 16px; padding: 18px 20px; font-size: 16px; color: var(--ink); cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.16s; }
        .opt:hover { border-color: var(--sage); transform: translateY(-1px); }
        .opt.sel { border-color: var(--green); background: var(--cream); }
        .opt .emoji { font-size: 20px; }
        .opt small { display: block; color: #8a948a; font-size: 13px; margin-top: 2px; }
        .field { margin-top: 16px; }
        .field label { display: block; font-size: 13px; color: var(--sage); margin-bottom: 7px; }
        .field input, .field select { width: 100%; font-size: 16px; color: var(--ink); background: #fff; border: 1.5px solid var(--line); border-radius: 14px; padding: 15px 16px; outline: none; }
        .field input:focus, .field select:focus { border-color: var(--green); }
        .btn { width: 100%; background: var(--green); color: var(--cream); font-weight: 500; font-size: 16px; border: none; border-radius: 14px; padding: 16px; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
        .btn:hover:not(:disabled) { background: var(--forest); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .summary { background: var(--green); border-radius: 20px; padding: 24px; color: var(--cream); margin: 22px 0; }
        .summary .row { display: flex; justify-content: space-between; padding: 9px 0; font-size: 15px; border-bottom: 1px solid rgba(244,239,227,0.14); }
        .summary .row:last-child { border-bottom: none; }
        .summary .row span { color: var(--sage); }
        @media (max-width: 560px) { .opts.grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="topbar">
        <button className={`back ${step <= 1 ? 'hide' : ''}`} onClick={back}>‹</button>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="mark">tiffin<span className="lo">lo</span></div>
      </div>

      <div className="stage" key={step}>
        {step === 0 && (
          <>
            <div className="speaker"><Avatar /><span className="em">tiffinlo</span></div>
            <h2>{state.name ? `Hello, ${state.name}.` : 'Hello there.'}</h2>
            <p className="helper">Just a few gentle questions so we can cook the kind of meal someone at home would make for you. It helps us get your plate exactly right.</p>
            <button className="btn" onClick={next}>Let us begin</button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="speaker"><Avatar /><span className="em">tiffinlo</span></div>
            <h2>So, what is life like right now?</h2>
            <div className="opts">
              {[
                { v: 'Student', label: 'A student, far from home', e: '📚' },
                { v: 'Working', label: 'Working, no time to cook', e: '💼' },
                { v: 'Other', label: 'Something else entirely', e: '🙂' }
              ].map((o) => (
                <button key={o.v} className={`opt ${state.who === o.v ? 'sel' : ''}`}
                  onClick={() => { set('who', o.v); if (o.v !== 'Other') setTimeout(next, 240); }}>
                  <span className="emoji">{o.e}</span><span>{o.label}</span>
                </button>
              ))}
            </div>
            {state.who === 'Other' && (
              <>
                <div className="field">
                  <label>Tell us a little. What is your story?</label>
                  <input type="text" placeholder="In a few words" value={state.whoElse}
                    onChange={(e) => set('whoElse', e.target.value)} autoFocus />
                </div>
                <button className="btn" onClick={next} disabled={!state.whoElse.trim()}>Continue</button>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="speaker"><Avatar /><span className="em">tiffinlo</span></div>
            <h2>And where is home, originally?</h2>
            <p className="helper">So there is always a little taste of it waiting on your plate.</p>
            <div className="field">
              <label>Your home state</label>
              <select value={state.home} onChange={(e) => set('home', e.target.value)}>
                <option value="">Select your state</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn" onClick={next} disabled={!state.home}>That is home</button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="speaker"><Avatar /><span className="em">tiffinlo</span></div>
            <h2>{state.home ? `A bit of ${state.home} on your plate. What is your comfort food?` : 'So, what is your comfort food?'}</h2>
            <p className="helper">Pick the one that tastes like a Sunday at home.</p>
            <div className="opts grid">
              {cuisines.map((c) => (
                <button key={c} className={`opt ${state.cuisine === c ? 'sel' : ''}`}
                  onClick={() => { set('cuisine', c); setTimeout(next, 240); }}>{c}</button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="speaker"><Avatar /><span className="em">tiffinlo</span></div>
            <div className="badge"><span className="sq" /> 100 percent pure veg, always eggless</div>
            <h2>How do you like it cooked?</h2>
            <p className="helper">We cook the way home does. Tell us your style.</p>
            <div className="opts">
              {[
                { v: 'Regular', label: 'Regular veg', sub: 'the everyday ghar ka khana spread' },
                { v: 'Jain', label: 'Jain', sub: 'no onion, garlic or root vegetables' },
                { v: 'No onion garlic', label: 'No onion and garlic', sub: 'satvik, light and clean' }
              ].map((o) => (
                <button key={o.v} className={`opt ${state.veg === o.v ? 'sel' : ''}`}
                  onClick={() => { set('veg', o.v); setTimeout(next, 240); }}>
                  <div>{o.label}<small>{o.sub}</small></div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="speaker"><Avatar /><span className="em">tiffinlo</span></div>
            <h2>You are all set, {state.name || 'friend'}.</h2>
            <p className="helper">{state.home ? `${state.home} flavours, every day. Pure veg, eggless, brought straight to you.` : 'Pure veg, eggless, brought straight to you.'}</p>
            <div className="summary">
              <div className="row"><span>You</span><strong>{state.who === 'Other' ? (state.whoElse || 'You') : (state.who || 'You')}</strong></div>
              <div className="row"><span>Home flavour</span><strong>{state.cuisine || 'chef choice'}</strong></div>
              <div className="row"><span>Cooked</span><strong>{state.veg || 'Regular'}</strong></div>
              <div className="row"><span>Kitchen</span><strong>100 percent pure veg, eggless</strong></div>
            </div>
            <button className="btn" onClick={finish}>Start my tiffin journey</button>
            <p className="helper" style={{ textAlign: 'center', marginTop: 16 }}>Next, pick your days, your plan, and where it lands.</p>
          </>
        )}
      </div>
    </main>
  );
}
