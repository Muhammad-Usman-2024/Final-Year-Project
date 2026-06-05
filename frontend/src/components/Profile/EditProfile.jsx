import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, Activity, Save, Loader2, ClipboardList, ShieldCheck } from 'lucide-react';
import { profileService } from '../../api/apiService';
import toast from 'react-hot-toast';
import { formatPhoneNumber } from '../../utils/phoneFormat';

const EditProfile = ({ data, onUpdate }) => {
  const isSuperAdmin = data?.user?.role === 'SuperAdmin';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: data?.user?.fullName || '',
    phone: data?.user?.phone ? formatPhoneNumber(data.user.phone) : '',
    personalInfo: {
      dob: data?.user?.personalInfo?.dob?.split('T')[0] || '',
      gender: data?.user?.personalInfo?.gender || 'Male',
      city: data?.user?.personalInfo?.city || '',
      address: data?.user?.personalInfo?.address || '',
    },
    medicalHistory: {
      chronicDiseases: data?.user?.medicalHistory?.chronicDiseases || 'None',
      currentMedications: data?.user?.medicalHistory?.currentMedications || 'None',
      allergies: data?.user?.medicalHistory?.allergies || 'None',
      previousSurgeries: data?.user?.medicalHistory?.previousSurgeries || 'None',
      recentTravel: data?.user?.medicalHistory?.recentTravel || 'None',
      hivHepStatus: data?.user?.medicalHistory?.hivHepStatus || 'All negative',
    }
  });

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update Personal Info
      await profileService.updateProfile({
        fullName: formData.fullName,
        phone: formatPhoneNumber(formData.phone),
        personalInfo: isSuperAdmin ? {} : formData.personalInfo
      });

      if (!isSuperAdmin) {
        await profileService.updateMedicalHistory(formData.medicalHistory);
      }

      toast.success('Profile updated successfully!');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Section */}
        <div className="bg-card-bg border border-border-color p-8 rounded-[20px] space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <User size={14} /> Personal Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  name="fullName"
                  className="input-field pl-10" 
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  name="phone"
                  className="input-field pl-10" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 3XX XXX XXXX"
                  required
                />
              </div>
            </div>

            {!isSuperAdmin && <div className="space-y-2">
              <label className="text-sm text-gray-400">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  name="dob"
                  type="date"
                  className="input-field pl-10" 
                  value={formData.personalInfo.dob}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                />
              </div>
            </div>}

            {!isSuperAdmin && <div className="space-y-2">
              <label className="text-sm text-gray-400">Gender</label>
              <select 
                name="gender"
                className="input-field bg-secondary-bg"
                value={formData.personalInfo.gender}
                onChange={(e) => handleChange(e, 'personalInfo')}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>}

            {!isSuperAdmin && <div className="space-y-2">
              <label className="text-sm text-gray-400">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  name="city"
                  className="input-field pl-10" 
                  value={formData.personalInfo.city}
                  onChange={(e) => handleChange(e, 'personalInfo')}
                  placeholder="Enter city"
                />
              </div>
            </div>}

            {!isSuperAdmin && <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Address</label>
              <textarea 
                name="address"
                className="input-field min-h-[80px] py-3" 
                value={formData.personalInfo.address}
                onChange={(e) => handleChange(e, 'personalInfo')}
                placeholder="Enter complete address"
              />
            </div>}
          </div>
        </div>

        {/* Medical History Section */}
        {!isSuperAdmin && <div className="bg-card-bg border border-border-color p-8 rounded-[20px] space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <ClipboardList size={14} /> Medical History
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Chronic Diseases</label>
              <input 
                name="chronicDiseases"
                className="input-field" 
                value={formData.medicalHistory.chronicDiseases}
                onChange={(e) => handleChange(e, 'medicalHistory')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Current Medications</label>
              <input 
                name="currentMedications"
                className="input-field" 
                value={formData.medicalHistory.currentMedications}
                onChange={(e) => handleChange(e, 'medicalHistory')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Allergies</label>
              <input 
                name="allergies"
                className="input-field" 
                value={formData.medicalHistory.allergies}
                onChange={(e) => handleChange(e, 'medicalHistory')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Previous Surgeries</label>
              <input 
                name="previousSurgeries"
                className="input-field" 
                value={formData.medicalHistory.previousSurgeries}
                onChange={(e) => handleChange(e, 'medicalHistory')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Recent Travel (Last 6 Months)</label>
              <input 
                name="recentTravel"
                className="input-field" 
                value={formData.medicalHistory.recentTravel}
                onChange={(e) => handleChange(e, 'medicalHistory')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">HIV / Hep B / Hep C Status</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-green" size={18} />
                <input 
                  name="hivHepStatus"
                  className="input-field pl-10" 
                  value={formData.medicalHistory.hivHepStatus}
                  onChange={(e) => handleChange(e, 'medicalHistory')}
                />
              </div>
            </div>
          </div>
        </div>}

        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn w-full flex items-center justify-center gap-2 h-14 text-lg"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
