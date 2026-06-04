import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Hospital, CheckCircle2, Loader2, ArrowRight, User, Video, Droplet } from 'lucide-react';
import { appointmentService, searchService } from '../../api/apiService';
import toast from 'react-hot-toast';

const SlotPicker = () => {
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingType, setBookingType] = useState('Donation');
    const [bookingSuccess, setBookingSuccess] = useState(null);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await searchService.getHospitals();
                setHospitals(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHospitals();
    }, []);

    useEffect(() => {
        if (selectedHospital) {
            const fetchSlots = async () => {
                setLoading(true);
                try {
                    const res = await appointmentService.getSlots(selectedHospital._id, date);
                    setSlots(res.data.data);
                    setSelectedSlot(null);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSlots();
        }
    }, [selectedHospital, date]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        setLoading(true);
        try {
            const res = await appointmentService.book({
                slotId: selectedSlot._id,
                type: bookingType,
                isRecurring: bookingType === 'Transfusion'
            });
            setBookingSuccess(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="bg-card-bg border border-accent-green/30 p-12 rounded-[40px] text-center space-y-6 fade-in">
                <div className="w-24 h-24 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold">Booking Confirmed!</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                    Your {bookingType} appointment at <strong className="text-white">{selectedHospital.fullName}</strong> is scheduled for {date} at {selectedSlot.time}.
                </p>
                <div className="pt-6">
                    <button 
                        onClick={() => setBookingSuccess(null)}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
                    >
                        Book Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Step 1: Select Hospital & Type */}
            <div className="space-y-8">
                <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center text-xs">1</span>
                        Choose Service
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'Donation', label: 'Blood Donation', icon: <Droplet size={18} />, color: 'text-accent-red' },
                            { id: 'Transfusion', label: 'Transfusion (21 Days)', icon: <CheckCircle2 size={18} />, color: 'text-accent-green' },
                            { id: 'Consultation', label: 'Doctor Consultation', icon: <Video size={18} />, color: 'text-accent-blue' },
                        ].map(type => (
                            <button
                                key={type.id}
                                onClick={() => setBookingType(type.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                    bookingType === type.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={type.color}>{type.icon}</span>
                                    <span className="text-sm font-bold text-gray-300">{type.label}</span>
                                </div>
                                {bookingType === type.id && <div className="w-2 h-2 rounded-full bg-accent-blue"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Hospital / Blood Bank</label>
                        <select 
                            className="input-field bg-secondary-bg/50 border-white/5"
                            onChange={(e) => setSelectedHospital(hospitals.find(h => h._id === e.target.value))}
                        >
                            <option value="">Select a facility...</option>
                            {hospitals.map(h => <option key={h._id} value={h._id}>{h.fullName} ({h.city})</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Step 2: Select Date & Slot */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-card-bg border border-border-color p-8 rounded-[40px] space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center text-xs">2</span>
                            Select Slot
                        </h3>
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-field bg-secondary-bg border-white/10 w-full md:w-auto"
                        />
                    </div>

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-sm italic">Scanning available slots...</p>
                        </div>
                    ) : selectedHospital ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {slots.length > 0 ? slots.map(slot => (
                                <button
                                    key={slot._id}
                                    disabled={slot.bookedCount >= slot.capacity}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-2 ${
                                        selectedSlot?._id === slot._id 
                                            ? 'bg-accent-blue/10 border-accent-blue text-white' 
                                            : slot.bookedCount >= slot.capacity 
                                                ? 'bg-white/2 border-transparent opacity-40 grayscale cursor-not-allowed'
                                                : 'bg-white/5 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <Clock size={18} className={selectedSlot?._id === slot._id ? 'text-accent-blue' : 'text-gray-500'} />
                                    <span className="text-lg font-black">{slot.time}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">
                                        {slot.capacity - slot.bookedCount} Seats Left
                                    </span>
                                </button>
                            )) : (
                                <div className="col-span-full py-12 text-center bg-white/2 rounded-3xl border border-dashed border-white/10">
                                    <p className="text-gray-500 text-sm italic">No slots defined for this date. Check another day!</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-600 gap-4">
                            <Hospital size={48} className="opacity-20" />
                            <p className="text-sm italic">Please select a hospital first</p>
                        </div>
                    )}

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Selected Appointment</p>
                            <p className="text-lg font-bold">
                                {selectedSlot ? `${date} at ${selectedSlot.time}` : 'Choose a time above'}
                            </p>
                        </div>
                        <button 
                            disabled={!selectedSlot || loading}
                            onClick={handleBook}
                            className="px-12 py-4 bg-accent-blue text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-blue/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> Confirm Booking</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotPicker;
