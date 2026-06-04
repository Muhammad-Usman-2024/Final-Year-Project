import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../store/authSlice';
import { User, UserPlus, Phone, Mail, IdCard, Lock, ArrowUpRight, Activity, Hospital, ShieldCheck, ChevronDown, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    password: '',
    confirmPassword: '',
    role: 'Donor',
    bloodGroup: 'A+',
    pmdcLicense: '',
    hospitalName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { fullName, email, phone, cnic, password, confirmPassword, role, bloodGroup, pmdcLicense, hospitalName } = formData;

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
      dispatch(reset());
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      dispatch(register(formData));
    }
  };

  const roles = [
    { id: 'Donor', icon: <Activity />, label: 'Donor', desc: 'Donate blood' },
    { id: 'Patient', icon: <Activity />, label: 'Patient', desc: 'Need blood' },
    { id: 'Hospital', icon: <Hospital />, label: 'Hospital', desc: 'Medical facility' },
    { id: 'Doctor', icon: <User />, label: 'Doctor', desc: 'Medical expert' },
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h4 className="text-[10px] text-red-600 font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            Choose Your Role
            <span className="h-[1px] bg-red-100 flex-1" />
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {roles.map((r) => {
            const isActive = role === r.id;
            return (
                <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        isActive 
                        ? 'border-red-600 bg-red-600 text-white shadow-xl shadow-red-500/30 scale-105' 
                        : 'border-red-100 bg-white hover:border-red-200 hover:bg-red-50/30'
                    }`}
                >
                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-red-50 text-red-500 group-hover:bg-red-100'}`}>
                        {React.cloneElement(r.icon, { size: 20 })}
                    </div>
                    <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-600'}`}>{r.label}</p>
                    </div>
                    {isActive && (
                        <div className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-0.5 border-2 border-red-600 shadow-md">
                            <CheckCircle2 size={12} />
                        </div>
                    )}
                </button>
            );
            })}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" type="text" name="fullName" value={fullName} onChange={onChange} placeholder="Ali Hassan" required />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CNIC / ID Number</label>
                <div className="relative group">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" type="text" name="cnic" value={cnic} onChange={onChange} placeholder="3520X-XXXXXXX-X" required />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" type="email" name="email" value={email} onChange={onChange} placeholder="ali@example.com" required />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" type="text" name="phone" value={phone} onChange={onChange} placeholder="03XX-XXXXXXX" required />
                </div>
            </div>

            {/* Dynamic Fields */}
            {(role === 'Donor' || role === 'Patient') && (
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Blood Group</label>
                <div className="relative group">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <select className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium cursor-pointer" name="bloodGroup" value={bloodGroup} onChange={onChange}>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option className="bg-white text-slate-900" key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
            </div>
            )}

            {role === 'Doctor' && (
            <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">PMDC License Number</label>
                <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" type="text" name="pmdcLicense" value={pmdcLicense} onChange={onChange} placeholder="Enter your license number" required />
                </div>
            </div>
            )}

            {role === 'Hospital' && (
            <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hospital Name</label>
                <div className="relative group">
                    <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" type="text" name="hospitalName" value={hospitalName} onChange={onChange} placeholder="Enter hospital name" required />
                </div>
            </div>
            )}

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Create Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input 
                        className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        value={password} 
                        onChange={onChange} 
                        placeholder="••••••••" 
                        required 
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input 
                        className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium" 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword" 
                        value={confirmPassword} 
                        onChange={onChange} 
                        placeholder="••••••••" 
                        required 
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
        </div>

        <button 
            type="submit" 
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest text-sm mt-8" 
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <UserPlus size={20} />
                    Complete Registration
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
            )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
