import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Activity, ShieldCheck, ArrowRight, HeartPulse, Hospital, Lock, ChevronDown, CheckCircle2, Droplet, Stethoscope, Clock, Shield, Calendar, UserPlus, Languages, Mail, Phone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';
import heroBg from '../assets/hero_bg.png';
import contactUsBg from '../assets/contactus.jpg';
import donationBg from '../assets/donationimage.png';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const nextLang = currentLanguage.startsWith('ur') ? 'en' : 'ur';
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  return (
    <div className={`min-h-screen w-full bg-white text-slate-900 font-inter overflow-x-hidden selection:bg-red-500/30 ${currentLanguage.startsWith('ur') ? 'font-noto-urdu' : ''}`}>

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full p-4 md:px-12 flex justify-between items-center z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center">
          <img src={logo} alt="BloodSync Logo" className="h-10 sm:h-12 w-auto object-contain" />
        </div>
        <nav className="flex items-center gap-4 md:gap-6">
          <a href="#features" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors">{t('navbar.features')}</a>
          <a href="#how-it-works" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors">{t('navbar.howItWorks')}</a>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-bold text-gray-700"
          >
            <Languages size={16} className="text-red-600" />
            <span>{currentLanguage.startsWith('ur') ? 'English' : 'اردو'}</span>
          </button>

          <Link to="/login" className="px-4 md:px-6 py-2.5 rounded-full bg-black hover:bg-gray-800 text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl">
            {t('navbar.login')}
          </Link>
        </nav>
      </header>

      {/* --- 1. HERO SECTION --- */}
      <section className="pt-28 md:pt-40 pb-24 px-6 relative flex flex-col items-center justify-center min-h-[95vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Pakistani Blood Donation Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-gray-50/40"></div>
        </div>

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-100 rounded-full blur-[100px] pointer-events-none -z-10 opacity-70"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-center max-w-5xl tracking-tighter leading-[1.1] font-outfit mb-6 text-black">
            {t('hero.title1')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">{t('hero.title2')}</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-2xl text-center max-w-3xl mb-12 font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link to="/login" className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
              {t('hero.cta1')} <ArrowRight size={20} className={`group-hover:translate-x-1 transition-transform ${currentLanguage.startsWith('ur') ? 'rotate-180' : ''}`} />
            </Link>
            <a href="#mission" className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white border border-gray-200 text-black font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
              {t('hero.cta2')}
            </a>
          </div>
        </div>
      </section>

      {/* --- 2. MISSION SECTION --- */}
      <section id="mission" className="py-24 px-6 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-sm font-bold text-red-600 tracking-widest uppercase mb-3">{t('mission.badge')}</h2>
            <h3 className="text-4xl md:text-5xl font-black font-outfit text-black mb-6 leading-tight">{t('mission.title')}</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {t('mission.p1')}
            </p>
            <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-red-600 pl-4 italic">
              "{t('mission.quote')}"
            </p>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square bg-gray-50 rounded-full absolute -top-10 -right-10 w-full h-full -z-10"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-600 p-8 rounded-3xl text-white shadow-xl translate-y-8">
                <HeartPulse size={48} className="mb-4 opacity-80" />
                <h4 className="text-2xl font-bold mb-2">{t('mission.urgentTitle')}</h4>
                <p className="text-red-100">{t('mission.urgentDesc')}</p>
              </div>
              <div className="bg-black p-8 rounded-3xl text-white shadow-xl">
                <Shield size={48} className="mb-4 opacity-80" />
                <h4 className="text-2xl font-bold mb-2">{t('mission.verifiedTitle')}</h4>
                <p className="text-gray-300">{t('mission.verifiedDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. HOW IT WORKS (PROCESS) --- */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-sm font-bold text-red-600 tracking-widest uppercase mb-3">{t('process.badge')}</h2>
          <h3 className="text-4xl md:text-5xl font-black font-outfit text-black mb-16">{t('process.title')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: t('process.step1.title'), desc: t('process.step1.desc') },
              { step: '02', title: t('process.step2.title'), desc: t('process.step2.desc') },
              { step: '03', title: t('process.step3.title'), desc: t('process.step3.desc') },
              { step: '04', title: t('process.step4.title'), desc: t('process.step4.desc') },
            ].map((s, i) => (
              <div key={i} className="relative flex flex-col items-center group">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-2xl font-black text-red-600 mb-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                  {s.step}
                </div>
                <h4 className="text-xl font-bold text-black mb-3">{s.title}</h4>
                <p className="text-gray-600 text-sm px-4">{s.desc}</p>
                {i !== 3 && <div className={`hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-red-200 to-transparent ${currentLanguage.startsWith('ur') ? 'right-[60%] left-auto rotate-180' : ''}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. KEY FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-outfit text-black mb-4">{t('features.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t('features.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<HeartPulse size={32} />}
              title={t('features.match.title')}
              desc={t('features.match.desc')}
            />
            <FeatureCard
              icon={<Clock size={32} />}
              title={t('features.alerts.title')}
              desc={t('features.alerts.desc')}
            />
            <FeatureCard
              icon={<Droplet size={32} />}
              title={t('features.inventory.title')}
              desc={t('features.inventory.desc')}
            />
            <FeatureCard
              icon={<ShieldCheck size={32} />}
              title={t('features.security.title')}
              desc={t('features.security.desc')}
            />
            <FeatureCard
              icon={<Activity size={32} />}
              title={t('features.wellness.title')}
              desc={t('features.wellness.desc')}
            />
            <FeatureCard
              icon={<Calendar size={32} />}
              title={t('features.scheduling.title')}
              desc={t('features.scheduling.desc')}
            />
          </div>
        </div>
      </section>

      {/* --- 5. PLATFORM ROLES --- */}
      <section className="relative py-24 px-6 bg-black text-white overflow-hidden">
        <img
          src={donationBg}
          alt="Blood donation dashboard background"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-red-400 tracking-widest uppercase mb-3">{t('roles.badge')}</h2>
              <h3 className="text-4xl md:text-6xl font-black font-outfit mb-5">{t('roles.title')}</h3>
              <p className="text-white/75 text-lg md:text-xl leading-relaxed">{t('roles.subtitle')}</p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-white text-black font-black hover:bg-red-50 hover:text-red-700 transition-colors shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
              {t('roles.cta')} <ArrowRight size={18} className={currentLanguage.startsWith('ur') ? 'rotate-180' : ''} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RoleCard icon={<Heart />} title={t('roles.donor.title')} featured text={t('roles.donor.text')} />
            <RoleCard icon={<Activity />} title={t('roles.patient.title')} text={t('roles.patient.text')} />
            <RoleCard icon={<Hospital />} title={t('roles.hospital.title')} text={t('roles.hospital.text')} />
            <RoleCard icon={<Stethoscope />} title={t('roles.doctor.title')} text={t('roles.doctor.text')} />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-red-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className={`max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x ${currentLanguage.startsWith('ur') ? 'md:divide-x-reverse divide-red-500/50' : 'divide-red-500/50'}`}>
          <StatBox number="15,000+" label={t('stats.donors')} />
          <StatBox number="320+" label={t('stats.hospitals')} />
          <StatBox number="8,500+" label={t('stats.lives')} />
          <StatBox number="1.2m" label={t('stats.response')} />
        </div>
      </section>

      {/* --- 7. THALASSEMIA CARE FOCUS --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-sm font-bold text-red-600 tracking-widest uppercase mb-3">{t('thalassemia.badge')}</h2>
            <h3 className="text-4xl font-black font-outfit text-black mb-6">{t('thalassemia.title')}</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {t('thalassemia.p1')}
            </p>
            <ul className="space-y-4 mb-8">
              {t('thalassemia.list', { returnObjects: true }).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-red-600 shrink-0 mt-1" size={20} />
                  <span className="text-gray-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/3] bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden relative shadow-lg flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
              <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-red-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded uppercase">{t('thalassemia.alert')}</span>
                  <span className="text-xs text-gray-500">{t('thalassemia.now')}</span>
                </div>
                <h4 className="font-bold text-black mb-1">{t('thalassemia.required')}</h4>
                <p className="text-sm text-gray-600 mb-4">{t('thalassemia.at')}</p>
                <button className="w-full bg-black text-white text-sm font-bold py-2 rounded-lg">{t('thalassemia.accept')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 8. SECURITY & TRUST --- */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck size={64} className="text-black mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black font-outfit text-black mb-6">{t('security.title')}</h2>
          <p className="text-gray-600 text-lg mb-12">
            {t('security.p1')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Lock className="text-red-600 mb-3" />
              <h4 className="font-bold text-black mb-2">{t('security.jwt.title')}</h4>
              <p className="text-sm text-gray-600">{t('security.jwt.desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <UserPlus className="text-red-600 mb-3" />
              <h4 className="font-bold text-black mb-2">{t('security.pmdc.title')}</h4>
              <p className="text-sm text-gray-600">{t('security.pmdc.desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Shield className="text-red-600 mb-3" />
              <h4 className="font-bold text-black mb-2">{t('security.rbac.title')}</h4>
              <p className="text-sm text-gray-600">{t('security.rbac.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 10. FINAL CTA --- */}
      <section className="relative overflow-hidden bg-red-700 px-6 py-24 text-white">
        <img
          src={heroBg}
          alt="Blood donation community"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(127,29,29,0.96),rgba(185,28,28,0.88)_48%,rgba(15,23,42,0.92))]"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-50 backdrop-blur-sm">
              <HeartPulse size={16} />
              Live Blood Network
            </span>
            <h2 className="max-w-3xl font-outfit text-4xl font-black leading-tight md:text-6xl">
              Join BloodSync and help every urgent request reach the right donor faster.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-red-50/85 md:text-xl">
              A smarter platform for patients, donors, doctors, and hospitals to coordinate lifesaving blood support in real time.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-black text-red-700 shadow-[0_20px_50px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:bg-red-50"
              >
                Login / Register
                <ArrowRight className={currentLanguage.startsWith('ur') ? 'rotate-180' : ''} size={20} />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                Contact Support
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              { icon: <Clock size={24} />, title: 'Fast Matching', text: 'Real-time alerts help reduce delays during urgent blood needs.' },
              { icon: <ShieldCheck size={24} />, title: 'Verified Access', text: 'Role-based dashboards keep patients, donors, and hospitals organized.' },
              { icon: <Droplet size={24} />, title: 'Blood Ready', text: 'Track requests, appointments, and inventory from one connected platform.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-white/15 bg-black/20 p-5 text-left backdrop-blur-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
                  {item.icon}
                </span>
                <span>
                  <span className="block text-lg font-black text-white">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-red-50/75">{item.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* --- 9. FAQ SECTION --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black font-outfit text-black mb-12 text-center">{t('faq.title')}</h2>
          <div className="space-y-4">
            <FAQItem q={t('faq.q1.q')} a={t('faq.q1.a')} />
            <FAQItem q={t('faq.q2.q')} a={t('faq.q2.a')} />
            <FAQItem q={t('faq.q3.q')} a={t('faq.q3.a')} />
            <FAQItem q={t('faq.q4.q')} a={t('faq.q4.a')} />
          </div>
        </div>
      </section>

      {/* --- 10.5. CONTACT SECTION --- */}
      <section id="contact" className="relative py-24 px-6 text-white overflow-hidden">
        <img
          src={contactUsBg}
          alt="BloodSync contact support"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-red-950/60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.35),transparent_32%)]"></div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-red-100 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              BloodSync Support
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-outfit leading-tight mb-5">
              Contact Us
            </h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Need help with blood requests, donor coordination, or hospital support? Our team is ready to respond quickly and guide you with care.
            </p>
            <a
              href="https://wa.me/+923074272579"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-400 transition-all shadow-[0_18px_45px_rgba(34,197,94,0.28)]"
            >
              <Phone className="h-5 w-5" />
              WhatsApp Chat
            </a>
          </div>

          <div className="grid gap-4">
            <a
              href="mailto:support@bloodsync.com"
              className="group flex items-center gap-5 rounded-2xl border border-white/15 bg-white/10 p-6 text-left backdrop-blur-md transition-all hover:bg-white/15 hover:border-red-300/50"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg group-hover:scale-105 transition-transform">
                <Mail className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-bold uppercase tracking-widest text-red-100 mb-1">Email</span>
                <span className="block text-lg md:text-xl font-black text-white break-all">support@bloodsync.com</span>
              </span>
            </a>

            <a
              href="tel:+923074272579"
              className="group flex items-center gap-5 rounded-2xl border border-white/15 bg-white/10 p-6 text-left backdrop-blur-md transition-all hover:bg-white/15 hover:border-red-300/50"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg group-hover:scale-105 transition-transform">
                <Phone className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-bold uppercase tracking-widest text-red-100 mb-1">Phone</span>
                <span className="block text-lg md:text-xl font-black text-white">+92 307 4272579</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* --- 11. FOOTER --- */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="BloodSync Logo" className="h-10 w-auto object-contain" />
        </div>
        <p className="text-gray-500 font-medium mb-6">
          {t('footer.tagline')}
        </p>
        <div className="flex justify-center gap-6 mb-8 text-sm font-bold text-gray-400">
          <a href="#" className="hover:text-black transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-black transition-colors">{t('footer.terms')}</a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">{t('footer.contact')}</a>
        </div>
        <p className="text-sm text-gray-400">
          {t('footer.rights')}
        </p>
      </footer>

    </div>
  );
};

// Sub-components for cleaner code
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300 group">
    <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-6 text-black group-hover:text-red-600 group-hover:border-red-200 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-black mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

const RoleCard = ({ icon, title, text, featured = false }) => (
  <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${featured ? 'bg-red-600/95 text-white border-red-400/30 shadow-[0_24px_60px_rgba(220,38,38,0.35)]' : 'bg-slate-950/70 text-gray-100 border-white/10 backdrop-blur-md hover:bg-slate-900/85 hover:border-red-300/25'}`}>
    <div className={`${featured ? 'text-white' : 'text-red-200'} mb-8 opacity-90`}>{icon}</div>
    <h4 className="text-2xl font-bold mb-2">{title}</h4>
    <p className={`text-sm leading-relaxed ${featured ? 'text-red-50' : 'text-gray-300'}`}>{text}</p>
  </div>
);

const StatBox = ({ number, label }) => (
  <div className="text-center px-4">
    <h3 className="text-4xl md:text-5xl font-black font-outfit mb-2">{number}</h3>
    <p className="text-red-200 font-bold uppercase tracking-wider text-xs">{label}</p>
  </div>
);

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
      <button
        className="w-full px-6 py-5 text-left font-bold text-black flex justify-between items-center hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {q}
        <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 bg-gray-50 border-t border-gray-200 pt-4 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
