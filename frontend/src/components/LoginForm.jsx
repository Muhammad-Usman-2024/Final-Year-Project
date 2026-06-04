import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/authSlice';
import { authService } from '../api/apiService';
import { Mail, Lock, LogIn, Send, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [loginMethod, setLoginMethod] = useState('password');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);

  const { email, password, otp } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess || user) {
      toast.success('Welcome back!');
      navigate('/app');
    }
  }, [user, isSuccess, isError, message, dispatch, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSendOTP = async () => {
    if (!email) return toast.error('Please enter email');
    try {
      await authService.sendOTP(email);
      setOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (loginMethod === 'password') {
      dispatch(login({ email, password }));
    } else {
      verifyOTP();
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await authService.verifyOTP(email, otp);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/app');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="fade-in w-full">
      <div className="flex gap-4 mb-8 bg-white/[0.03] p-1.5 rounded-[22px] border border-white/5 w-fit backdrop-blur-xl">
        <button 
          className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${loginMethod === 'password' ? 'bg-red-600 text-white shadow-[0_5px_20px_rgba(220,38,38,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}
          onClick={() => setLoginMethod('password')}
        >
          PASSWORD
        </button>
        <button 
          className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${loginMethod === 'otp' ? 'bg-red-600 text-white shadow-[0_5px_20px_rgba(220,38,38,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}
          onClick={() => setLoginMethod('otp')}
        >
          OTP
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-y-6 relative w-full">
        <div className="flex flex-col gap-2 group">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-red-500 transition-colors">
            <Mail size={14}/> Access Key (Email)
          </label>
          <div className="relative">
            <input 
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-gray-700 outline-none focus:border-red-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(220,38,38,0.05)] transition-all"
              type="email" 
              name="email" 
              value={email} 
              onChange={onChange} 
              placeholder="ali@example.com" 
              required 
            />
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-red-500 transition-colors" />
          </div>
        </div>

        {loginMethod === 'password' ? (
          <div className="flex flex-col gap-2 group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-red-500 transition-colors">
              <Lock size={14}/> Authentication (Password)
            </label>
            <div className="relative">
              <input 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-gray-700 outline-none focus:border-red-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(220,38,38,0.05)] transition-all"
                type="password" 
                name="password" 
                value={password} 
                onChange={onChange} 
                placeholder="••••••••" 
                required 
              />
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-red-500 transition-colors" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-red-500 transition-colors">
              <CheckCircle size={14}/> Verification (OTP)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 pl-12 text-sm text-white placeholder:text-gray-700 outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all"
                  type="text" 
                  name="otp" 
                  value={otp} 
                  onChange={onChange} 
                  placeholder="123456" 
                  required={otpSent}
                  disabled={!otpSent}
                />
                <CheckCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-red-500 transition-colors" />
              </div>
              <button 
                type="button" 
                onClick={onSendOTP}
                className="px-6 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                SEND
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-4">
          <button type="submit" className="w-full h-16 rounded-[24px] bg-gradient-to-r from-red-600 to-red-900 text-white font-black tracking-[0.3em] uppercase text-sm shadow-[0_20px_40px_rgba(220,38,38,0.3)] hover:shadow-[0_25px_50px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50" disabled={isLoading}>
            {isLoading ? 'VERIFYING...' : (
              <>
                <LogIn size={20} /> ENTER DASHBOARD <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
