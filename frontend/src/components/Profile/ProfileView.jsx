import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { User, Activity, Heart, Edit3, Loader2 } from 'lucide-react';
import { profileService } from '../../api/apiService';
import PersonalInfo from './PersonalInfo';
import DonorDashboard from './DonorDashboard';
import PatientDashboard from './PatientDashboard';
import EditProfile from './EditProfile';

const ProfileView = ({ activeSubTab, setActiveSubTab }) => {
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await profileService.getProfile(user._id);
      setProfileData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  const handleUpdate = () => {
    fetchProfile();
    setActiveSubTab('personal'); // Switch back to personal info after update
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="animate-spin text-accent-red" size={40} />
      <p className="text-gray-500 font-medium">Fetching clinical records...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Tab Content */}

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeSubTab === 'personal' && <PersonalInfo data={profileData} />}
        {activeSubTab === 'donor' && <DonorDashboard clinicalData={profileData?.clinicalProfile} />}
        {activeSubTab === 'patient' && <PatientDashboard clinicalData={profileData?.clinicalProfile} />}
        {activeSubTab === 'edit' && <EditProfile data={profileData} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
};


export default ProfileView;
