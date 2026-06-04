import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Droplets, Info, ChevronRight, Loader2 } from 'lucide-react';
import { donationService } from '../../api/apiService';
import toast from 'react-hot-toast';

const AppointmentForm = ({ user }) => {
  const [formData, setFormData] = useState({
    hospitalId: 'services-hospital',
    hospitalName: 'Services Hospital, Lahore',
    date: new Date().toISOString().split('T')[0],
    slot: '',
    type: 'Whole blood',
    specialNotes: ''
  });

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await donationService.getSlots(formData.hospitalId, formData.date);
        setSlots(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    };
    if (formData.date) fetchSlots();
  }, [formData.date, formData.hospitalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.slot) return toast.error('Please select a time slot');
    setBooking(true);
    try {
      await donationService.bookAppointment(formData);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Registered donors', value: '1,248' },
          { label: 'This month', value: '143' },
          { label: 'Scheduled today', value: '28' },
          { label: 'Pending approval', value: '17' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg border border-white/5 p-4 rounded-xl">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card-bg border border-border-color rounded-[20px] p-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">New Donation Appointment</h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Donor name</label>
            <input className="input-field bg-white/5" value={user?.fullName} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">CNIC</label>
            <input className="input-field bg-white/5" value={user?.cnic} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Blood group</label>
            <select className="input-field bg-secondary-bg" value={user?.bloodGroup} disabled>
              <option>{user?.bloodGroup || 'Select Group'}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Donation type</label>
            <select 
              className="input-field bg-secondary-bg"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option>Whole blood (450 ml)</option>
              <option>Plasma</option>
              <option>Platelets</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Preferred hospital / blood bank</label>
            <select 
              className="input-field bg-secondary-bg"
              value={formData.hospitalId}
              onChange={(e) => setFormData({...formData, hospitalId: e.target.value, hospitalName: e.target.options[e.target.selectedIndex].text})}
            >
              <option value="services-hospital">Services Hospital, Lahore</option>
              <option value="indus-hospital">Indus Hospital, Lahore</option>
              <option value="children-hospital">Children Hospital</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Preferred date</label>
            <input 
              type="date" 
              className="input-field bg-secondary-bg" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value, slot: ''})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <label className="text-sm text-gray-400 mb-4 block flex items-center gap-2">
              <Clock size={16} /> AVAILABLE TIME SLOTS — {new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </label>
            
            {loadingSlots ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent-red" /></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slots.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={s.isFull}
                    onClick={() => setFormData({...formData, slot: s.time})}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      s.isFull 
                        ? 'border-dashed border-white/5 text-gray-600 cursor-not-allowed bg-white/2' 
                        : formData.slot === s.time
                        ? 'border-accent-red bg-accent-red text-white'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    {s.time}
                    {s.isFull && <p className="text-[8px] mt-1 font-bold">Full</p>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm text-gray-400">Special notes (optional)</label>
            <textarea 
              className="input-field bg-secondary-bg min-h-[100px] py-3"
              placeholder="Mention any health conditions or concerns..."
              value={formData.specialNotes}
              onChange={(e) => setFormData({...formData, specialNotes: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={booking || !formData.slot}
            className="md:col-span-2 submit-btn flex items-center justify-center gap-2"
          >
            {booking ? <Loader2 className="animate-spin" size={18} /> : <Calendar size={18} />}
            Book appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
