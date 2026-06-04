import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, ShieldCheck, User, Video, CheckCircle2, XCircle, MoreVertical, Loader2 } from 'lucide-react';
import { appointmentService } from '../../api/apiService';
import AppointmentPass from './AppointmentPass';
import toast from 'react-hot-toast';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await appointmentService.getMyBookings();
            setAppointments(res.data.data);
            if (res.data.data.length > 0 && !selectedId) {
                setSelectedId(res.data.data[0]._id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        setActionLoading(id);
        try {
            await appointmentService.cancel(id);
            fetchBookings();
            toast.success('Appointment cancelled');
        } catch (err) {
            toast.error('Cancellation failed');
        } finally {
            setActionLoading(null);
        }
    };

    const activeAppointment = appointments.find(a => a._id === selectedId);

    if (loading) return <div className="h-96 bg-white/5 rounded-[40px] animate-pulse"></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List Column */}
            <div className="lg:col-span-1 space-y-6">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Recent Bookings</h4>
                
                <div className="space-y-4">
                    {appointments.length > 0 ? appointments.map((booking) => (
                        <div 
                            key={booking._id} 
                            onClick={() => setSelectedId(booking._id)}
                            className={`p-6 rounded-[32px] border cursor-pointer transition-all ${
                                selectedId === booking._id 
                                    ? 'bg-accent-blue/10 border-accent-blue/40 ring-1 ring-accent-blue/20' 
                                    : 'bg-card-bg border-border-color hover:border-white/20'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                    booking.status === 'Scheduled' ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20' :
                                    booking.status === 'Completed' ? 'bg-accent-green/10 text-accent-green border-accent-green/20' :
                                    'bg-white/5 text-gray-500 border-white/5'
                                }`}>
                                    {booking.status}
                                </span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                    ID: #{booking._id.substring(20)}
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <h5 className="font-bold text-white truncate">{booking.hospitalId?.fullName}</h5>
                                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold">
                                    <div className="flex items-center gap-1"><Calendar size={12} /> {booking.date}</div>
                                    <div className="flex items-center gap-1"><Clock size={12} /> {booking.slotId?.time}</div>
                                </div>
                            </div>

                            {booking.status === 'Scheduled' && (
                                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/5">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleCancel(booking._id); }}
                                        disabled={actionLoading === booking._id}
                                        className="p-2 text-gray-500 hover:text-accent-red transition-colors"
                                    >
                                        {actionLoading === booking._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white/2 rounded-[32px] border border-dashed border-white/10">
                            <p className="text-gray-500 text-sm italic">No bookings yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pass / Details Column */}
            <div className="lg:col-span-2">
                {activeAppointment ? (
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Digital Pass</h4>
                        <AppointmentPass appointment={activeAppointment} />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4 py-20 bg-white/2 rounded-[40px] border border-dashed border-white/5">
                        <ShieldCheck size={64} className="opacity-10" />
                        <p className="text-sm italic">Select a booking to view your pass</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
