import React from 'react';
import { QrCode, MapPin, Calendar, Clock, User, Heart, ShieldCheck, Download, ExternalLink } from 'lucide-react';

const AppointmentPass = ({ appointment }) => {
    if (!appointment) return null;

    return (
        <div className="bg-card-bg border border-border-color rounded-[40px] overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]">
            {/* Header / Brand */}
            <div className="bg-gradient-to-r from-accent-blue/20 via-accent-purple/20 to-accent-blue/20 p-8 border-b border-white/5 relative">
                <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/5 rounded-2xl text-accent-blue">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white tracking-tight">Verified Booking</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Appointment ID: #{appointment._id.substring(18)}</p>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        appointment.status === 'Scheduled' ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20' : 'bg-gray-100/5 text-gray-400 border-white/5'
                    }`}>
                        {appointment.status}
                    </span>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Details Column */}
                    <div className="space-y-8">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2 px-1">Medical Facility</label>
                            <div className="flex items-center gap-3 text-white">
                                <Hospital size={20} className="text-accent-blue" />
                                <span className="text-lg font-bold">{appointment.hospitalId?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 ml-8">
                                <MapPin size={14} />
                                <span>{appointment.hospitalId?.city}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2 px-1">Date</label>
                                <div className="flex items-center gap-2 text-white">
                                    <Calendar size={18} className="text-accent-purple" />
                                    <span className="font-bold">{appointment.date}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2 px-1">Arrival Time</label>
                                <div className="flex items-center gap-2 text-white">
                                    <Clock size={18} className="text-accent-green" />
                                    <span className="font-bold">{appointment.slotId?.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 pt-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2 px-1">Service Type</label>
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                                    appointment.type === 'Donation' ? 'bg-accent-red/10 text-accent-red' :
                                    appointment.type === 'Transfusion' ? 'bg-accent-green/10 text-accent-green' :
                                    'bg-accent-blue/10 text-accent-blue'
                                }`}>
                                    {appointment.type}
                                </span>
                                {appointment.isRecurring && <span className="text-[10px] text-accent-green font-bold flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={12} /> Auto-Recurring</span>}
                            </div>
                        </div>
                    </div>

                    {/* QR Code Column */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="relative p-6 bg-white rounded-[40px] shadow-2xl group-hover:scale-105 transition-transform">
                            {/* Visual QR Placeholder with stylized look */}
                            <div className="w-48 h-48 bg-gray-900 rounded-[32px] flex items-center justify-center relative overflow-hidden">
                                <QrCode size={120} className="text-white/80" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/20 to-transparent"></div>
                                <div className="absolute bottom-2 right-2 p-2 bg-white rounded-lg">
                                    <ShieldCheck size={16} className="text-accent-blue" />
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
                                <Download size={20} />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] text-center">Scan at Reception</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                        <ExternalLink size={16} /> Get Directions
                    </button>
                    {appointment.meetingLink && (
                        <a 
                            href={appointment.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-accent-blue/10 text-accent-blue text-xs font-bold rounded-xl border border-accent-blue/20 hover:bg-accent-blue hover:text-white transition-all"
                        >
                            Join Video Call
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentPass;
