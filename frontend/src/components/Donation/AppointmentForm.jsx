import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { donationService, profileService, searchService } from '../../api/apiService';
import toast from 'react-hot-toast';

const AppointmentForm = ({ user }) => {
  const [formData, setFormData] = useState({
    hospitalId: '',
    hospitalName: '',
    bloodGroup: '',
    date: new Date().toISOString().split('T')[0],
    slot: '',
    type: 'Whole blood',
    specialNotes: ''
  });

  const [slots, setSlots] = useState([]);
  const [profileUser, setProfileUser] = useState(user || null);
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({
    registeredDonors: 0,
    thisMonth: 0,
    scheduledToday: 0,
    pendingApproval: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const displayUser = profileUser || user || {};
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingData(true);
      try {
        const [profileRes, hospitalsRes, statsRes] = await Promise.all([
          user?._id ? profileService.getProfile(user._id) : Promise.resolve(null),
          searchService.getHospitals(),
          donationService.getStats()
        ]);

        const freshUser = profileRes?.data?.data?.user || user || null;
        const hospitalList = hospitalsRes?.data?.data || [];
        setProfileUser(freshUser);
        setHospitals(hospitalList);
        setStats(statsRes?.data?.data || {
          registeredDonors: 0,
          thisMonth: 0,
          scheduledToday: 0,
          pendingApproval: 0
        });

        setFormData((prev) => ({
          ...prev,
          bloodGroup: freshUser?.bloodGroup || '',
          hospitalId: hospitalList[0]?._id || '',
          hospitalName: hospitalList[0]?.fullName || ''
        }));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load donation data');
      } finally {
        setLoadingData(false);
      }
    };

    fetchInitialData();
  }, [user]);

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
    if (formData.hospitalId && formData.date) fetchSlots();
    else setSlots([]);
  }, [formData.date, formData.hospitalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hospitalId) return toast.error('Please select a hospital');
    if (!formData.bloodGroup) return toast.error('Please select blood group');
    if (!formData.slot) return toast.error('Please select a time slot');
    setBooking(true);
    try {
      await donationService.bookAppointment(formData);
      toast.success('Appointment booked successfully!');
      const statsRes = await donationService.getStats();
      setStats(statsRes?.data?.data || stats);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fade-in max-w-4xl mx-auto bg-card-bg border border-border-color rounded-[20px] p-10 flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="animate-spin text-accent-red" />
        Loading donation data...
      </div>
    );
  }

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Registered donors', value: stats.registeredDonors || 0 },
          { label: 'This month', value: stats.thisMonth || 0 },
          { label: 'Scheduled today', value: stats.scheduledToday || 0 },
          { label: 'Pending approval', value: stats.pendingApproval || 0 }
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
            <input className="input-field bg-white/5" value={displayUser.fullName || 'No data'} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">CNIC</label>
            <input className="input-field bg-white/5" value={displayUser.cnic || 'No data'} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Blood group</label>
            <select
              className="input-field bg-secondary-bg"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
            >
              <option value="">No data</option>
              {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
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
              onChange={(e) => {
                const selectedHospital = hospitals.find((hospital) => hospital._id === e.target.value);
                setFormData({
                  ...formData,
                  hospitalId: selectedHospital?._id || '',
                  hospitalName: selectedHospital?.fullName || '',
                  slot: ''
                });
              }}
            >
              <option value="">{hospitals.length ? 'Select hospital' : 'No data'}</option>
              {hospitals.map((hospital) => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.fullName}{hospital.personalInfo?.city || hospital.city ? `, ${hospital.personalInfo?.city || hospital.city}` : ''}
                </option>
              ))}
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
            ) : !formData.hospitalId ? (
              <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-gray-500 text-sm">
                No data
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slots.length ? slots.map((s, i) => (
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
                )) : (
                  <div className="col-span-full p-8 rounded-xl border border-dashed border-white/10 text-center text-gray-500 text-sm">
                    No data
                  </div>
                )}
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
            disabled={booking || !formData.hospitalId || !formData.bloodGroup || !formData.slot}
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
