import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, LogIn, ArrowRight, CheckCircle, Send, UserPlus, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/authSlice';
import { authService } from '../api/apiService';
import toast from 'react-hot-toast';
import RegisterForm from '../components/RegisterForm';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const [view, setView] = useState('login'); // login, register, forgot
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: otp + new pass
  const [showPassword, setShowPassword] = useState(false);

  const { email, password, otp } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/app');
  }, [user, navigate]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success('Welcome back!');
      dispatch(reset());
      navigate('/app');
    }
  }, [isError, isSuccess, message, dispatch, navigate]);

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (resetStep === 1) {
      // Mocking forgot password request
      toast.success('Reset link sent to your email!');
      setResetStep(2);
    } else {
      toast.success('Password updated successfully!');
      setView('login');
      setResetStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-800" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50" />

      {/* Card Container */}
      <div className={`w-full ${view === 'register' ? 'max-w-3xl' : 'max-w-md'} bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10 relative z-10 backdrop-blur-sm transition-all duration-500`}>

        {view === 'login' && (
          <div className="fade-in">
            <div className="mb-8 text-center flex flex-col items-center">
                <img src={logo} alt="Logo" className="h-20 w-auto object-contain mb-4" />
              <p className="text-slate-500 font-medium">Please enter your details to login</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={email || ''}
                    onChange={onChange}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password || ''}
                    onChange={onChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest text-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                    Enter Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                New to BloodSync?{' '}
                <button onClick={() => setView('register')} className="text-red-600 font-black hover:text-red-700 transition-colors">
                  Create an Account
                </button>
              </p>
            </div>
          </div>
        )}

        {view === 'register' && (
          <div className="fade-in">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase">Register</h1>
                <p className="text-slate-500 font-medium">Join our life-saving community</p>
              </div>
              <button
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-red-600 transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO LOGIN
              </button>
            </div>

            <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-2 sm:p-6 md:p-8">
              <RegisterForm />
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-red-600 font-black hover:text-red-700 transition-colors">
                  Login Now
                </button>
              </p>
            </div>
          </div>
        )}

        {view === 'forgot' && (
          <div className="fade-in">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <KeyRound size={32} />
              </div>
              <h1 className="text-2xl font-black text-slate-900">Forgot Password?</h1>
              <p className="text-slate-500 font-medium">No worries, we'll send you reset instructions.</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              {resetStep === 1 ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={email || ''}
                      onChange={onChange}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">OTP Code</label>
                    <input
                      type="text"
                      name="otp"
                      value={otp || ''}
                      onChange={onChange}
                      placeholder="Enter OTP"
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-center font-bold tracking-widest focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password || ''}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium"
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
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-200 uppercase tracking-widest text-sm"
              >
                {resetStep === 1 ? 'Send Reset Link' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => { setView('login'); setResetStep(1); }}
                className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm"
              >
                Back to Login
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};

export default LoginPage;
