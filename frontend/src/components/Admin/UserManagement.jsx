import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, UserX, UserCheck, MoreVertical, Loader2 } from 'lucide-react';
import { adminService } from '../../api/apiService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminService.getUsers({ search: searchTerm, role: roleFilter });
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, roleFilter]);

    const handleToggleStatus = async (id) => {
        setActionLoading(id);
        try {
            await adminService.toggleUserStatus(id);
            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        setActionLoading(id);
        try {
            await adminService.updateUserRole(id, newRole);
            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="bg-card-bg border border-border-color rounded-[40px] overflow-hidden">
            {/* Filters Header */}
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02]">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="input-field pl-12 bg-secondary-bg/50 border-white/5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        className="input-field bg-secondary-bg/50 border-white/5 text-xs font-bold uppercase tracking-widest"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="Patient">Patients</option>
                        <option value="Donor">Donors</option>
                        <option value="Hospital">Hospitals</option>
                        <option value="Doctor">Doctors</option>
                        <option value="Admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                            <th className="px-8 py-6">User</th>
                            <th className="px-8 py-6">Role</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-8 py-20 text-center text-gray-500">
                                    <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                                    Fetching user data...
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{user.fullName}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className={`bg-transparent text-xs font-bold border rounded-lg px-3 py-1.5 focus:border-accent-blue transition-all ${
                                                user.role === 'Admin' 
                                                ? 'text-accent-blue border-accent-blue/30 cursor-not-allowed opacity-80' 
                                                : 'text-gray-400 border-white/10'
                                            }`}
                                            disabled={actionLoading === user._id || user.role === 'Admin'}
                                        >
                                            <option value="Patient">Patient</option>
                                            <option value="Donor">Donor</option>
                                            <option value="Hospital">Hospital</option>
                                            <option value="Doctor">Doctor</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            user.isActive 
                                                ? 'bg-accent-green/10 text-accent-green border-accent-green/20' 
                                                : 'bg-accent-red/10 text-accent-red border-accent-red/20'
                                        }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleToggleStatus(user._id)}
                                                disabled={actionLoading === user._id || user.role === 'Admin'}
                                                className={`p-2 rounded-xl transition-all ${
                                                    user.role === 'Admin'
                                                        ? 'bg-gray-500/10 text-gray-500 cursor-not-allowed opacity-50'
                                                        : user.isActive 
                                                            ? 'bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-white' 
                                                            : 'bg-accent-green/10 text-accent-green hover:bg-accent-green hover:text-white'
                                                }`}
                                                title={user.role === 'Admin' ? 'Admin status cannot be changed' : (user.isActive ? 'Deactivate Account' : 'Activate Account')}
                                            >
                                                {actionLoading === user._id ? <Loader2 className="animate-spin" size={16} /> : (user.isActive ? <UserX size={16} /> : <UserCheck size={16} />)}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-20 text-center text-gray-500">No users match your filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
