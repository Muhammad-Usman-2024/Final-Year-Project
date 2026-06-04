import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Thermometer, Weight, Activity, Calendar } from 'lucide-react';

const EligibilitySliders = () => {
  const [metrics, setMetrics] = useState({
    age: 25,
    weight: 65,
    hb: 13.5,
    lastDonation: 120
  });

  const [isEligible, setIsEligible] = useState(true);
  const [failReasons, setFailReasons] = useState([]);

  useEffect(() => {
    const reasons = [];
    if (metrics.age < 18 || metrics.age > 60) reasons.push("Age must be between 18-60");
    if (metrics.weight < 50) reasons.push("Weight must be over 50kg");
    if (metrics.hb < 12.5) reasons.push("Hb level must be over 12.5 g/dL");
    if (metrics.lastDonation < 90) reasons.push("Last donation must be over 90 days ago");

    setFailReasons(reasons);
    setIsEligible(reasons.length === 0);
  }, [metrics]);

  const SliderField = ({ label, value, min, max, unit, name, step = 1 }) => (
    <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/5">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        <span className="text-xl font-bold text-accent-blue">{value} <span className="text-xs text-gray-500">{unit}</span></span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={(e) => setMetrics({...metrics, [name]: Number(e.target.value)})}
        className="w-full accent-accent-red h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-8">
      {/* Eligibility Hero Status */}
      <div className={`p-8 rounded-[30px] border-2 flex flex-col items-center text-center gap-4 transition-all duration-500 ${
        isEligible 
          ? 'bg-accent-green/10 border-accent-green/30 shadow-[0_0_50px_rgba(34,197,94,0.1)]' 
          : 'bg-accent-red/10 border-accent-red/30 shadow-[0_0_50px_rgba(239,68,68,0.1)]'
      }`}>
        <div className={`p-4 rounded-full ${isEligible ? 'bg-accent-green text-white' : 'bg-accent-red text-white'}`}>
          {isEligible ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
        </div>
        <h2 className="text-3xl font-bold">{isEligible ? 'You are Eligible!' : 'Not Eligible Yet'}</h2>
        <p className="text-gray-400 max-w-md">
          {isEligible 
            ? 'Your vitals and history meet the international standards for blood donation. You can proceed to book an appointment.'
            : `Sorry, you don't meet the following criteria: ${failReasons.join(', ')}.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SliderField label="Your Age" value={metrics.age} min={15} max={75} unit="years" name="age" />
        <SliderField label="Your Weight" value={metrics.weight} min={40} max={120} unit="kg" name="weight" />
        <SliderField label="Hb Level" value={metrics.hb} min={8} max={18} step={0.1} unit="g/dL" name="hb" />
        <SliderField label="Days since last donation" value={metrics.lastDonation} min={0} max={365} unit="days" name="lastDonation" />
      </div>

      {/* Next Eligible Calculator */}
      <div className="bg-card-bg border border-border-color p-8 rounded-[24px] space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-accent-red" />
          <h3 className="font-bold">Next Eligible Date Calculator</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold">Select Donation Type</label>
            <select className="input-field bg-white/5">
              <option>Whole Blood (90 days gap)</option>
              <option>Plasma (28 days gap)</option>
              <option>Platelets (7 days gap)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold">Last Donation Date</label>
            <input type="date" className="input-field bg-white/5" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-center">
          <p className="text-sm text-gray-300">Your next eligible date will be: <span className="text-white font-bold">14 August 2026</span></p>
        </div>
      </div>
    </div>
  );
};

export default EligibilitySliders;
