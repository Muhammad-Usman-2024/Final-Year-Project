import React from 'react';
import { Shield, Key, Clock, Server } from 'lucide-react';

const TokenDetail = () => {
  const strategy = [
    {
      title: 'Access Token',
      icon: <Key size={24} className="text-accent-blue" />,
      detail: 'Short-lived (15 min). Used for API authorization in the Authorization header.',
    },
    {
      title: 'Refresh Token',
      icon: <Clock size={24} className="text-accent-purple" />,
      detail: 'Long-lived (7 days). Stored in an HTTP-only cookie for secure automatic renewal.',
    },
    {
      title: 'Security',
      icon: <Shield size={24} className="text-accent-green" />,
      detail: 'Bcrypt hashing for passwords. HTTP-only cookies prevent XSS token theft.',
    },
    {
      title: 'Tech Stack',
      icon: <Server size={24} className="text-accent-orange" />,
      detail: 'Node.js, Express, MongoDB, Redux Toolkit, Tailwind CSS, Lucide Icons.',
    },
  ];

  return (
    <div className="fade-in">
      <h3 className="text-xl font-bold mb-6 text-center">JWT / Session Strategy</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategy.map((s, i) => (
          <div key={i} className="bg-card-bg p-6 rounded-2xl border border-border-color hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              {s.icon}
              <h4 className="text-base font-semibold">{s.title}</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{s.detail}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-accent-blue/5 rounded-2xl border border-dashed border-accent-blue/40">
        <h4 className="text-accent-blue font-bold mb-3 flex items-center gap-2">
          <Shield size={18} /> Auth Flow Diagram
        </h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-2"><span>1.</span> User logs in → Server sends Access Token (JSON) & Refresh Token (Cookie).</li>
          <li className="flex gap-2"><span>2.</span> Client stores Access Token in Redux state.</li>
          <li className="flex gap-2"><span>3.</span> Access Token expires → Client calls /refresh-token (Cookie sent automatically).</li>
          <li className="flex gap-2"><span>4.</span> Server verifies Cookie → Sends new Access Token.</li>
        </ul>
      </div>
    </div>
  );
};

export default TokenDetail;
