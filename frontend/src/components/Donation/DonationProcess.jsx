import React from 'react';
import { ClipboardList, UserCheck, Activity, Coffee, Award, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

const DonationProcess = () => {
  const steps = [
    { title: 'Registration', time: '5 mins', desc: 'Scan CNIC and confirm appointment', icon: <ClipboardList />, status: 'completed' },
    { title: 'Medical Screening', time: '10 mins', desc: 'Weight, Hb level & BP check', icon: <UserCheck />, status: 'completed' },
    { title: 'Donation Process', time: '15 mins', desc: 'The actual blood collection', icon: <Activity />, status: 'current' },
    { title: 'Recovery & Refreshments', time: '15 mins', desc: 'Rest and have some juice', icon: <Coffee />, status: 'upcoming' },
    { title: 'Certificate Issued', time: 'Instant', desc: 'Download your e-certificate', icon: <Award />, status: 'upcoming' },
  ];

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-12">
      {/* Process Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Donation Day Flow</h2>
        <p className="text-gray-500">Estimated total time: <span className="text-accent-red font-bold">45-60 minutes</span></p>
      </div>

      {/* Step Vertical List */}
      <div className="relative space-y-6 before:absolute before:left-[27px] before:top-8 before:bottom-8 before:w-1 before:bg-white/5">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-6 items-start relative group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-500 ${
              step.status === 'completed' ? 'bg-accent-green/20 border-accent-green text-accent-green shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
              step.status === 'current' ? 'bg-accent-red/20 border-accent-red text-accent-red animate-pulse' :
              'bg-secondary-bg border-white/5 text-gray-600'
            }`}>
              {step.status === 'completed' ? <CheckCircle2 /> : step.icon}
            </div>
            
            <div className="flex-1 bg-card-bg border border-border-color p-6 rounded-2xl group-hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`font-bold ${step.status === 'current' ? 'text-accent-red' : 'text-white'}`}>{step.title}</h4>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{step.time}</span>
              </div>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Card */}
      <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20 p-8 rounded-[32px] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
            <Award size={48} className="text-white/20" />
          </div>
          <div className="text-center md:text-left space-y-4">
            <div>
              <h3 className="text-xl font-bold">Your E-Certificate will appear here</h3>
              <p className="text-sm text-gray-400 mt-1">Once the donation is marked as completed by the hospital.</p>
            </div>
            <button disabled className="flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-500 rounded-xl font-bold cursor-not-allowed">
              <Download size={18} /> Download Certificate
            </button>
          </div>
        </div>
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
      </div>
    </div>
  );
};

export default DonationProcess;
