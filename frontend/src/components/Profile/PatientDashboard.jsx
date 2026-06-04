import React from 'react';
import { Activity, Beaker, Calendar, Clock, TrendingUp } from 'lucide-react';

const PatientDashboard = ({ clinicalData }) => {
  const ferritinLevel = clinicalData?.latestFerritin || 850;
  const maxFerritin = 2500;
  const ferritinPercentage = Math.min((ferritinLevel / maxFerritin) * 100, 100);

  return (
    <div className="fade-in space-y-8">
      {/* Clinical Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg border border-border-color p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue"><Activity size={20} /></div>
            <h4 className="font-bold text-sm">Diagnosis</h4>
          </div>
          <p className="text-xl font-bold">{clinicalData?.diagnosisType || 'Thalassemia Major'}</p>
          <p className="text-xs text-gray-500 mt-1">Genotype: {clinicalData?.genotype || 'β0/β0'}</p>
        </div>

        <div className="bg-card-bg border border-border-color p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent-purple/10 rounded-lg text-accent-purple"><Calendar size={20} /></div>
            <h4 className="font-bold text-sm">Transfusion Interval</h4>
          </div>
          <p className="text-xl font-bold">{clinicalData?.transfusionInterval || 21} Days</p>
          <p className="text-xs text-gray-500 mt-1">Next transfusion: 25 May 2026</p>
        </div>

        <div className="bg-card-bg border border-border-color p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent-orange/10 rounded-lg text-accent-orange"><Beaker size={20} /></div>
            <h4 className="font-bold text-sm">Chelation Therapy</h4>
          </div>
          <p className="text-xl font-bold">Deferasirox</p>
          <p className="text-xs text-gray-500 mt-1">Dosage: 1500mg daily</p>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ferritin Level Chart */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Serum Ferritin Level</h3>
            <span className={`text-sm font-bold ${ferritinLevel > 1000 ? 'text-accent-red' : 'text-accent-green'}`}>
              {ferritinLevel} ng/mL
            </span>
          </div>
          <div className="bg-card-bg border border-border-color p-6 rounded-2xl space-y-4">
            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-green via-accent-orange to-accent-red transition-all duration-1000"
                style={{ width: `${ferritinPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
              <span>Low (Safe)</span>
              <span>1000 (Target)</span>
              <span>2500+ (High)</span>
            </div>
            <p className="text-xs text-gray-400 italic pt-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-accent-red" /> 
              Your ferritin level has increased by 15% since last month.
            </p>
          </div>
        </div>

        {/* Transfusion History */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Transfusion History</h3>
          <div className="bg-card-bg border border-border-color rounded-2xl overflow-hidden divide-y divide-white/5">
            {(clinicalData?.transfusions || [
              { date: '01 May 2026', units: 2, hospital: 'Children Hospital' },
              { date: '10 April 2026', units: 2, hospital: 'Children Hospital' },
              { date: '20 March 2026', units: 1, hospital: 'Bait-ul-Maal' },
            ]).map((t, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <h4 className="text-sm font-bold">{t.hospital}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock size={12} /> {t.date}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-accent-blue">{t.units} Units</span>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Packed Cells</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
