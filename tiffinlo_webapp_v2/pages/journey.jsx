// pages/journey.jsx. Service journey wizard.
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AREAS, DAYS, PLANS } from '../data';

export default function Journey() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [area, setArea] = useState(null);
  const [days, setDays] = useState([]);
  const [planId, setPlanId] = useState('');
  const [sameForAll, setSameForAll] = useState(true);
  const [addresses, setAddresses] = useState([{ id: 1, label: '', areaName: '', building: '', days: [] }]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tiffinlo_area') || 'null');
      if (saved) setArea(saved);
      else setArea(AREAS[0]);
    } catch (e) { setArea(AREAS[0]); }
  }, []);

  const plan = PLANS.find((p) => p.id === planId);
  const daysPerWeek = days.length;
  const priceFor = (p) => p.perMeal * daysPerWeek * p.weeks;
  const total = plan ? priceFor(plan) : 0;

  const toggleDay = (d) => setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const assignedDays = sameForAll ? days : addresses.flatMap((a) => a.days);
  const allCovered = days.every((d) => assignedDays.includes(d));
  const addressesValid = sameForAll
    ? (addresses[0].areaName && addresses[0].building.trim())
    : (allCovered && addresses.every((a) => a.areaName && a.building.trim() && a.days.length > 0));

  const setAddr = (id, key, val) => setAddresses((prev) => prev.map((a) => a.id === id ? { ...a, [key]: val } : a));
  const toggleAddrDay = (id, d) => setAddresses((prev) => prev.map((a) => {
    if (a.id !== id) return a;
    return { ...a, days: a.days.includes(d) ? a.days.filter((x) => x !== d) : [...a.days, d] };
  }));
  const addAddress = () => setAddresses((prev) => [...prev, { id: Math.max(...prev.map((a) => a.id)) + 1, label: '', areaName: '', building: '', days: [] }]);
  const removeAddress = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  const canNext = () => {
    if (step === 1) return !!area;
    if (step === 2) return daysPerWeek > 0;
    if (step === 3) return !!plan;
    if (step === 4) return addressesValid;
    return true;
  };

  const proceed = () => {
    const finalAddresses = (sameForAll ? [{ ...addresses[0], days }] : addresses).map((a) => {
      const ad = AREAS.find((x) => x.name === a.areaName);
      return { label: a.label || a.areaName, area: { name: a.areaName, pincode: ad ? ad.pincode : '' }, building: a.building, days: a.days };
    });
    localStorage.setItem('tiffinlo_journey', JSON.stringify({
      area, days, plan: { ...plan, daysPerWeek, total }, addresses: finalAddresses, total
    }));
    router.push('/checkout');
  };

  if (!area) return null;
  const stepTitles = ['', 'Where are you?', 'Which days?', 'Pick your plan', 'Where should it land?', 'Looks good?'];

  return (
    <main className="main">
      <style jsx>{`
        .main { min-height: calc(100vh - 240px); }
        .topbar { max-width: 620px; margin: 0 auto 30px; padding: 22px 24px 0; display: flex; align-items: center; gap: 14px; }
        .back { border: none; background: none; cursor: pointer; color: var(--sage); font-size: 22px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .back:hover { background: rgba(126,154,126,0.16); }
        .back.hide { visibility: hidden; }
        .progress { flex: 1; height: 5px; background: rgba(32,80,59,0.1); border-radius: 999px; overflow: hidden; }
        .progress span { display: block; height: 100%; background: var(--green); border-radius: 999px; transition: width 0.45s ease; }
        .stepno { font-family: var(--mono); font-size: 12px; color: var(--sage); }
        .stage { max-width: 620px; margin: 0 auto; padding: 0 24px 40px; animation: slide 0.4s ease; }
        @keyframes slide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(27px, 5vw, 36px); line-height: 1.12; letter-spacing: -0.6px; color: var(--green); margin-bottom: 10px; }
        .helper { color: #5a665d; margin-bottom: 24px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 13px; color: var(--sage); margin-bottom: 8px; }
        .field select, .field input { width: 100%; font-size: 16px; color: var(--ink); background: #fff; border: 1.5px solid var(--line); border-radius: 12px; padding: 14px 15px; outline: none; }
        .field select:focus, .field input:focus { border-color: var(--green); }
        .days { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .day { background: #fff; border: 1.5px solid var(--line); border-radius: 12px; padding: 14px 0; text-align: center; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.16s; }
        .day:hover { border-color: var(--sage); }
        .day.on { background: var(--green); color: var(--cream); border-color: var(--green); }
        .plans { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .plan { background: #fff; border: 1.5px solid var(--line); border-radius: 16px; padding: 18px; cursor: pointer; transition: all 0.16s; }
        .plan:hover { border-color: var(--sage); transform: translateY(-1px); }
        .plan.on { border-color: var(--green); background: var(--cream); }
        .plan .pl { font-size: 15px; font-weight: 500; color: var(--green); }
        .plan .pr { font-family: var(--mono); font-size: 22px; color: var(--ink); margin-top: 8px; }
        .plan .pm { font-size: 12px; color: var(--sage); margin-top: 4px; }
        .toggle { display: flex; align-items: center; gap: 10px; margin: 6px 0 20px; font-size: 14px; color: #4f5a51; cursor: pointer; }
        .toggle .box { width: 20px; height: 20px; border: 1.5px solid var(--sage); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .toggle .box.on { background: var(--green); border-color: var(--green); color: var(--cream); }
        .addr { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 18px; margin-bottom: 14px; }
        .addr-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .addr-head .t { font-weight: 500; color: var(--green); }
        .addr-head .rm { font-size: 13px; color: var(--clay); cursor: pointer; background: none; border: none; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
        .chip { padding: 7px 13px; border-radius: 999px; border: 1.5px solid var(--line); font-size: 13px; cursor: pointer; background: #fff; }
        .chip.on { background: var(--green); color: var(--cream); border-color: var(--green); }
        .chip.dim { opacity: 0.4; cursor: not-allowed; }
        .add { color: var(--green); font-weight: 500; font-size: 14px; cursor: pointer; background: none; border: none; padding: 4px; }
        .coverage { font-size: 13px; margin-top: 6px; }
        .coverage.bad { color: var(--clay); }
        .coverage.ok { color: #2e8b57; }
        .review { background: var(--green); border-radius: 18px; padding: 24px; color: var(--cream); margin-bottom: 16px; }
        .review .row { display: flex; justify-content: space-between; padding: 9px 0; font-size: 15px; border-bottom: 1px solid rgba(244,239,227,0.14); }
        .review .row:last-child { border-bottom: none; font-weight: 600; font-size: 17px; }
        .review .row span { color: var(--sage); }
        .review .addr-line { font-size: 13px; color: rgba(244,239,227,0.85); margin-top: 8px; }
        .btn { width: 100%; background: var(--green); color: var(--cream); font-weight: 500; font-size: 16px; border: none; border-radius: 12px; padding: 16px; cursor: pointer; margin-top: 20px; transition: background 0.2s; }
        .btn:hover:not(:disabled) { background: var(--forest); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .note { font-size: 12px; color: var(--sage); text-align: center; margin-top: 14px; }
        @media (max-width: 560px) { .plans { grid-template-columns: 1fr; } .days { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      <div className="topbar">
        <button className={`back ${step <= 1 ? 'hide' : ''}`} onClick={() => setStep((s) => Math.max(1, s - 1))}>‹</button>
        <div className="progress"><span style={{ width: `${(step / 5) * 100}%` }} /></div>
        <div className="stepno">{step} of 5</div>
      </div>

      <div className="stage" key={step}>
        <h2>{stepTitles[step]}</h2>

        {step === 1 && (
          <>
            <p className="helper">We carried this over from the top of the page. Change it if you like.</p>
            <div className="field">
              <label>Your delivery area</label>
              <select value={area.name} onChange={(e) => setArea(AREAS.find((a) => a.name === e.target.value))}>
                {AREAS.map((a) => <option key={a.name} value={a.name}>{a.name}, {a.pincode}</option>)}
              </select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="helper">Pick the days you want tiffin. Your price is built from this, so choose what suits you.</p>
            <div className="days">
              {DAYS.map((d) => (
                <div key={d} className={`day ${days.includes(d) ? 'on' : ''}`} onClick={() => toggleDay(d)}>{d}</div>
              ))}
            </div>
            {daysPerWeek > 0 && <p className="note" style={{ textAlign: 'left', marginTop: 14 }}>{daysPerWeek} {daysPerWeek === 1 ? 'day' : 'days'} a week selected.</p>}
          </>
        )}

        {step === 3 && (
          <>
            <p className="helper">Each price is for your {daysPerWeek} {daysPerWeek === 1 ? 'day' : 'days'} a week. Longer plans cost less per meal.</p>
            <div className="plans">
              {PLANS.map((p) => (
                <div key={p.id} className={`plan ${planId === p.id ? 'on' : ''}`} onClick={() => setPlanId(p.id)}>
                  <div className="pl">{p.label}</div>
                  <div className="pr">₹{priceFor(p).toLocaleString('en-IN')}</div>
                  <div className="pm">₹{p.perMeal} per meal</div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="helper">Tell us where to bring it. Use one place, or split your days across two.</p>
            <div className="toggle" onClick={() => setSameForAll(!sameForAll)}>
              <span className={`box ${sameForAll ? 'on' : ''}`}>{sameForAll ? '✓' : ''}</span>
              Same place for all my days
            </div>

            {sameForAll ? (
              <div className="addr">
                <div className="field">
                  <label>Area</label>
                  <select value={addresses[0].areaName} onChange={(e) => setAddr(addresses[0].id, 'areaName', e.target.value)}>
                    <option value="">Select area</option>
                    {AREAS.map((a) => <option key={a.name} value={a.name}>{a.name}, {a.pincode}</option>)}
                  </select>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Building and flat</label>
                  <input type="text" placeholder="Flat 4B, Shanti Residency, 3rd Cross" value={addresses[0].building}
                    onChange={(e) => setAddr(addresses[0].id, 'building', e.target.value)} />
                </div>
              </div>
            ) : (
              <>
                {addresses.map((a, idx) => {
                  const takenByOthers = addresses.filter((x) => x.id !== a.id).flatMap((x) => x.days);
                  return (
                    <div className="addr" key={a.id}>
                      <div className="addr-head">
                        <span className="t">Address {idx + 1}</span>
                        {addresses.length > 1 && <button className="rm" onClick={() => removeAddress(a.id)}>Remove</button>}
                      </div>
                      <div className="field">
                        <label>Area</label>
                        <select value={a.areaName} onChange={(e) => setAddr(a.id, 'areaName', e.target.value)}>
                          <option value="">Select area</option>
                          {AREAS.map((ar) => <option key={ar.name} value={ar.name}>{ar.name}, {ar.pincode}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>Building and flat</label>
                        <input type="text" placeholder="Flat 4B, Shanti Residency" value={a.building}
                          onChange={(e) => setAddr(a.id, 'building', e.target.value)} />
                      </div>
                      <label style={{ fontSize: 13, color: 'var(--sage)' }}>Which days come here?</label>
                      <div className="chips">
                        {days.map((d) => {
                          const taken = takenByOthers.includes(d);
                          const on = a.days.includes(d);
                          return (
                            <button key={d} className={`chip ${on ? 'on' : ''} ${taken && !on ? 'dim' : ''}`}
                              onClick={() => !taken && toggleAddrDay(a.id, d)}>{d}</button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <button className="add" onClick={addAddress}>Add another address</button>
                <p className={`coverage ${allCovered ? 'ok' : 'bad'}`}>
                  {allCovered ? 'Every day has a home. You are good to go.' : 'Assign all your selected days to an address to continue.'}
                </p>
              </>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <p className="helper">Quick look before you pay.</p>
            <div className="review">
              <div className="row"><span>Plan</span><strong>{plan.label}</strong></div>
              <div className="row"><span>Days each week</span><strong>{days.join(', ')}</strong></div>
              <div className="row"><span>Per meal</span><strong>₹{plan.perMeal}</strong></div>
              <div className="row"><span>Meals in plan</span><strong>{daysPerWeek * plan.weeks}</strong></div>
              {(sameForAll ? [{ areaName: addresses[0].areaName, building: addresses[0].building, days }] : addresses).map((a, i) => (
                <div className="addr-line" key={i}>→ {a.building}, {a.areaName} ({a.days.join(', ')})</div>
              ))}
              <div className="row" style={{ marginTop: 8 }}><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
            </div>
            <p className="note">No refunds, but you can cancel or skip anytime and it converts to wallet credit.</p>
          </>
        )}

        {step < 5 ? (
          <button className="btn" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>Continue</button>
        ) : (
          <button className="btn" onClick={proceed}>Proceed to payment</button>
        )}
      </div>
    </main>
  );
}
