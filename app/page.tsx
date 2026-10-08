'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

// --- Premium Inline SVGs ---
const Icons = {
    Sun: () => (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    Moon: () => (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),

  Menu: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4 text-[#E5B869] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  CheckBadge: () => (
    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E5B869]/20 flex items-center justify-center shrink-0 text-[#E5B869]">
      <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  ArrowRight: () => (
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-3.5 h-3.5 text-[#E5B869]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  MenuBook: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B869]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Share: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B869]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B869]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Headset: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B869]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
    </svg>
  ),
  ChartBar: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B869]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Rocket: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B869]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePricingTab, setActivePricingTab] = useState<'month1' | 'growth' | 'social' | 'custom'>('month1');
  const [formSent, setFormSent] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLegalModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (activeLegalModal || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeLegalModal, mobileMenuOpen]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      restaurantName: formData.get('restaurantName'),
      yourName: formData.get('yourName'),
      emailAddress: formData.get('emailAddress'),
      phoneNumber: formData.get('phoneNumber'),
      message: formData.get('message'),
      _subject: `New Consultation Request from ${formData.get('restaurantName')}`,
      _captcha: "false" // Disable captcha for smooth UX
    };

    try {
      // Using FormSubmit for zero-config email sending
      const response = await fetch('https://formsubmit.co/ajax/riznexdigitalsolutions@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormSent(true);
      } else {
        alert('Failed to send request. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      alert('Failed to send request. Please try again later.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-slate-50 dark:bg-[#07080B] text-slate-800 dark:text-slate-100 font-sans selection:bg-[#E5B869] selection:text-black overflow-x-hidden antialiased">
      
      {/* AMBIENT GLOW EFFECTS (STRICTLY CONTAINED) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-gradient-to-b from-[#E5B869]/10 via-[#C89B3C]/5 to-transparent blur-[120px] pointer-events-none -z-10 overflow-hidden" />

      {/* TOP NAVIGATION HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        scrolled 
          ? 'bg-slate-50/90 dark:bg-[#07080B]/90 backdrop-blur-xl border-b border-slate-200/[0.08] dark:border-white/[0.08] py-3 shadow-2xl shadow-black/80' 
          : 'bg-slate-50/60 dark:bg-[#07080B]/60 backdrop-blur-md py-3.5 sm:py-5 border-b border-slate-200/[0.04] dark:border-white/[0.04]'
      }`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex justify-between items-center gap-2">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative p-1 rounded-xl bg-gradient-to-br from-black/10 dark:from-white/10 to-black/5 dark:to-white/5 border border-slate-200/10 dark:border-white/10 group-hover:border-[#E5B869]/40 transition-colors">
              <img 
                src="/images/new-logo.jpg" 
                alt="Riznex Logo" 
                className="h-7 sm:h-9 w-auto object-contain rounded-lg" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                Riznex
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse"></span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#E5B869] font-semibold mt-0.5">
                Digital Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] border border-slate-200/[0.08] dark:border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-md">
            {[
              { label: 'Services', href: '#services' },
              { label: 'Platforms', href: '#platforms' },
              { label: 'Packages', href: '#packages' },
              { label: '⚡ Live Demo', href: '/demo' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Contact', href: '#contact' },
            ].map(item => (
              <a 
                key={item.label} 
                href={item.href}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  item.href === '/demo'
                    ? 'text-[#E5B869] font-bold bg-[#E5B869]/10 border border-[#E5B869]/40 hover:bg-[#E5B869]/20 animate-pulse drop-shadow-[0_0_8px_rgba(229,184,105,0.6)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Header CTAs & Mobile Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Direct Client Login Button (Always Visible On Mobile & Desktop) */}
            <Link 
              href="/client-login" 
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-black/[0.05] dark:bg-white/[0.05] border border-slate-200/10 dark:border-white/10 hover:bg-black/[0.1] dark:hover:bg-white/[0.1] hover:border-slate-200/20 dark:hover:border-white/20 transition-all shadow-sm"
            >
              <Icons.Lock /> <span>Client Login</span>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 sm:p-2 rounded-xl text-slate-900 dark:text-slate-200 bg-black/5 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/[0.1] transition-all shadow-sm"
                aria-label="Toggle Theme"
              >
                {mounted ? (theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />) : <div className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

            {/* Desktop Get Started */}
            <a 
              href="#contact" 
              className="hidden sm:inline-flex relative group overflow-hidden px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] shadow-lg shadow-[#E5B869]/20 hover:shadow-[#E5B869]/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Get Started <Icons.ArrowRight />
              </span>
            </a>

            {/* Mobile Menu Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-slate-200/10 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-3.5 p-5 rounded-2xl bg-white/98 dark:bg-[#0D0F17]/98 border border-slate-200/15 dark:border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-3.5 rounded-xl text-xs font-black text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] shadow-[0_0_15px_rgba(229,184,105,0.4)] flex items-center justify-between animate-pulse"
            >
              <span className="flex items-center gap-2">⚡ Explore Interactive Live Demo</span>
              <Icons.ArrowRight />
            </Link>
            {[
              { label: 'Services Overview', href: '#services' },
              { label: 'Supported Platforms', href: '#platforms' },
              { label: 'Packages & Pricing', href: '#packages' },
              { label: 'How Riznex Works', href: '#how-it-works' },
              { label: 'Contact Us', href: '#contact' },
            ].map(item => (
              <a 
                key={item.label} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:text-[#E5B869] transition-all flex items-center justify-between"
              >
                <span>{item.label}</span>
                <Icons.ArrowRight />
              </a>
            ))}
            <div className="pt-3 border-t border-slate-200/[0.08] dark:border-white/[0.08] flex flex-col gap-2.5">
              <Link 
                href="/client-login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-black/[0.06] dark:bg-white/[0.06] border border-slate-200/10 dark:border-white/10"
              >
                <Icons.Lock /> Access Client Portal
              </Link>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-xs font-black text-black text-center bg-gradient-to-r from-[#E5B869] to-[#C89B3C] shadow-md shadow-[#E5B869]/20"
              >
                Request Free Consultation
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 px-3.5 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left w-full min-w-0">
              


              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-5 break-words w-full">
                We Manage Your Entire Digital Operation. <br />
                So You Can Focus on <span className="text-[#E5B869]">the Food.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-7 max-w-2xl font-normal">
                Riznex delivers end-to-end digital operations for ambitious UK restaurants. We unify your delivery platforms, streamline menus, manage customer reputation, and automate weekly profit reporting.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
                <Link 
                  href="/demo" 
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] shadow-xl shadow-[#E5B869]/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <Icons.Sparkles /> <span>Explore Live Demo</span> <Icons.ArrowRight />
                </Link>
                <a 
                  href="#services" 
                  className="px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-black/[0.05] dark:bg-white/[0.05] border border-slate-200/10 dark:border-white/10 hover:bg-black/[0.1] dark:hover:bg-white/[0.1] hover:border-slate-200/20 dark:hover:border-white/20 transition-all text-center flex items-center justify-center gap-2"
                >
                  View Services
                </a>
                <Link 
                  href="/client-login" 
                  className="px-4 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Icons.Lock /> Client Portal
                </Link>
              </div>

              {/* Value Points */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-5 border-t border-slate-200/[0.08] dark:border-white/[0.08] w-full">
                {[
                  'Delivery Platforms',
                  'Social & Marketing',
                  'Weekly P&L Reports',
                  'Dedicated Manager'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 min-w-0">
                    <Icons.CheckBadge />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Live Hub Visual (Completely Overflow Proof) */}
            <div className="lg:col-span-5 w-full min-w-0">
              <div className="relative p-4 sm:p-6 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none backdrop-blur-xl">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-3.5 mb-4 border-b border-slate-200/[0.08] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-md shadow-emerald-500/50 shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white tracking-wide uppercase truncate">Live Performance Hub</h2>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">Consolidated Weekly Metrics</p>
                    </div>
                  </div>
                  <Link 
                    href="/demo"
                    className="text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E5B869]/15 text-[#E5B869] border border-[#E5B869]/30 hover:bg-[#E5B869]/25 transition-all shrink-0 flex items-center gap-1"
                  >
                    <span>Try Demo</span> <Icons.ArrowRight />
                  </Link>
                </div>

                {/* 4 Stat KPIs */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-slate-200/[0.06] dark:border-white/[0.06] min-w-0">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5 truncate">Gross Sales</span>
                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">£18,420</div>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-semibold mt-1">
                      <Icons.TrendingUp /> +12.5%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-slate-200/[0.06] dark:border-white/[0.06] min-w-0">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5 truncate">Total Orders</span>
                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">1,284</div>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-semibold mt-1">
                      <Icons.TrendingUp /> +8.7%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-slate-200/[0.06] dark:border-white/[0.06] min-w-0">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5 truncate">Net Profit</span>
                    <div className="text-lg sm:text-2xl font-black text-[#E5B869] tracking-tight truncate">£4,280</div>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-semibold mt-1">
                      <Icons.TrendingUp /> 23.2%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-slate-200/[0.06] dark:border-white/[0.06] min-w-0">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5 truncate">Expenses / Ops</span>
                    <div className="text-lg sm:text-2xl font-black text-slate-700 dark:text-slate-200 tracking-tight truncate">£3,840</div>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-rose-400 font-semibold mt-1">
                      ↓ 7.1%
                    </div>
                  </div>
                </div>

                {/* Revenue Rhythm Bar Visual */}
                <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-slate-200/[0.06] dark:border-white/[0.06] mb-4 w-full">
                  <div className="flex justify-between items-center mb-2 text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Weekly Revenue Rhythm</span>
                    <span className="text-[9px] text-slate-500 font-mono">May 2026</span>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-16 pt-2 border-b border-slate-200/[0.06] dark:border-white/[0.06] w-full relative">
                    {[45, 60, 50, 75, 55, 88, 70, 95, 65, 100].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                        <div 
                          style={{ 
                            height: mounted ? `${val}%` : '0%',
                            transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 75}ms`
                          }} 
                          className={`w-full rounded-t-sm ${
                            val >= 85 
                              ? 'bg-gradient-to-t from-[#C89B3C] to-[#E5B869] shadow-lg shadow-[#E5B869]/20' 
                              : 'bg-black/20 dark:bg-white/20'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 mt-1.5 font-mono">
                    <span>Wk 1</span>
                    <span>Wk 2</span>
                    <span>Wk 3</span>
                    <span>Wk 4</span>
                  </div>
                </div>

                {/* Platform Split Responsive Grid (2 cols on mobile, 4 on desktop) */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">Active Platform Share</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center w-full">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[9px] font-bold text-emerald-400 block truncate">Uber Eats</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">42%</span>
                    </div>
                    <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <span className="text-[9px] font-bold text-orange-400 block truncate">Just Eat</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">28%</span>
                    </div>
                    <div className="p-1.5 sm:p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                      <span className="text-[9px] font-bold text-teal-400 block truncate">Deliveroo</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">19%</span>
                    </div>
                    <div className="p-1.5 sm:p-2 rounded-lg bg-slate-500/10 border border-slate-500/20">
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block truncate">In-Store</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">11%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INTERACTIVE LIVE DEMO (COMPACT & CLEAR SHOWCASE) ── */}
      <section id="demo-showcase" className="py-8 sm:py-12 bg-gradient-to-r from-slate-50 dark:from-[#0A0C13] via-slate-100 dark:via-[#101422] to-slate-50 dark:to-[#0A0C13] border-t border-slate-200/[0.08] dark:border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5B869]/15 text-[#E5B869] text-[11px] font-bold uppercase tracking-wider mb-2.5 border border-[#E5B869]/30">
                <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse"></span>
                <span>⚡ Interactive Demo</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                See How Your Restaurant Dashboard Will Look
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
                Test-drive our system before purchasing. Explore realistic UK delivery splits (Uber Eats, Just Eat, Deliveroo), staff payroll, OCR supplier invoices, and net profit calculations.
              </p>
            </div>

            {/* Right Action Button */}
            <div className="flex flex-col items-center md:items-end gap-2.5 shrink-0 w-full md:w-auto">
              <Link
                href="/demo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm text-black bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] shadow-xl shadow-[#E5B869]/25 hover:scale-[1.03] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>⚡ Explore Live Demo</span>
                <Icons.ArrowRight />
              </Link>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Instant Access • No Login Required</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORMS BANNER */}
      <section id="platforms" className="py-8 sm:py-12 border-y border-slate-200/[0.08] dark:border-white/[0.08] bg-slate-50 dark:bg-[#0A0C13] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            Seamlessly Integrated With Top UK Delivery Platforms & Social Channels
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10">
            <span className="text-lg sm:text-2xl font-black text-emerald-400 tracking-tight">Uber <span className="font-light text-slate-900 dark:text-white">Eats</span></span>
            <span className="text-lg sm:text-2xl font-black text-orange-500 tracking-wider">JUST EAT</span>
            <span className="text-lg sm:text-2xl font-black text-teal-400 tracking-tight">deliveroo</span>
            <span className="text-base sm:text-xl font-bold text-blue-500">Facebook</span>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">Instagram</span>
            <span className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">TikTok</span>
            <span className="text-sm sm:text-lg font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span className="text-blue-400 font-extrabold">G</span>oogle Business
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES: RESPONSIVE BENTO GRID */}
      <section id="services" className="py-16 sm:py-24 px-3.5 sm:px-6 lg:px-8 relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5B869]/10 border border-[#E5B869]/25 text-[#E5B869] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
              Comprehensive Services
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words">
              One Dedicated Partner. <br />
              <span className="text-[#E5B869]">Your Complete Digital Operation.</span>
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
              We take the heavy digital burden off your shoulders so your staff can focus 100% on cooking exceptional food.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            
            {/* 1. Menu Management */}
            <div className="rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none hover:border-[#E5B869]/60 p-5 sm:p-7 transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-center mb-4">
                <Icons.MenuBook />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">Menu Management</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                Keep menus synced across Uber Eats, Just Eat, and Deliveroo. We add categories, modify prices, configure modifier add-ons, and optimize dishes to maximize order basket values.
              </p>
            </div>

            {/* 2. Social Media Management */}
            <div className="rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none hover:border-[#E5B869]/60 p-5 sm:p-7 transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-center mb-4">
                <Icons.Share />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">Social Media Marketing</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                Engage hungry locals through eye-catching food reels, static posts, and strategic story campaigns on Instagram, TikTok, and Facebook that convert browsers into repeat diners.
              </p>
            </div>

            {/* 3. Business Profiles & Maps */}
            <div className="rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none hover:border-[#E5B869]/60 p-5 sm:p-7 transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-center mb-4">
                <Icons.MapPin />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">Business Profiles & Maps</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                Optimize your Google Business Profile, Apple Maps, and local search presence. Verified opening hours, location details, high-res menus, and local search visibility.
              </p>
            </div>

            {/* 4. Customer Support & Reviews */}
            <div className="rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none hover:border-[#E5B869]/60 p-5 sm:p-7 transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-center mb-4">
                <Icons.Headset />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">Customer Support & Reviews</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                We safeguard your restaurant&apos;s 5-star reputation. We handle online guest reviews, reply politely to feedback across platforms, and promptly resolve customer inquiries.
              </p>
            </div>

            {/* 5. Business & Financial Reporting */}
            <div className="rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none hover:border-[#E5B869]/60 p-5 sm:p-7 transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-center mb-4">
                <Icons.ChartBar />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">Automated Financial Reporting</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                No more guessing where your money goes. Receive weekly consolidated P&L statements that break down platform commissions, VAT, supplier invoices, staff wages, and genuine profits.
              </p>
            </div>

            {/* 6. Growth & Order Surges */}
            <div className="rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none hover:border-[#E5B869]/60 p-5 sm:p-7 transition-all flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-center mb-4">
                <Icons.Rocket />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">Growth & Order Surges</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                Launch data-driven meal deals, promotional discounts, and localized ad campaigns on Uber Eats and social media to capture high-volume orders during peak dinner rushes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CLIENT TESTIMONIAL LOGOS */}
      <section className="py-10 sm:py-14 bg-white dark:bg-[#050608] border-y border-slate-200/[0.06] dark:border-white/[0.06] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 text-center mb-6">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#E5B869]">
            Trusted By Established UK Restaurants
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto px-3.5">
          {[
            { name: 'Hungry Birds', src: '/images/clients/hungry-birds.jpg' },
            { name: 'Taste of Tandoori', src: '/images/clients/taste-of-tandoori.png' },
            { name: 'Tasty Bun', src: '/images/clients/tasty-bun.jpg' },
            { name: 'The Best Fry', src: '/images/clients/the-best-fry.png' },
          ].map((client, i) => (
            <div 
              key={i} 
              className="flex items-center justify-center p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-slate-200/[0.08] dark:border-white/[0.08]"
            >
              <img 
                src={client.src} 
                alt={client.name} 
                className="h-10 sm:h-14 w-auto object-contain max-w-[120px] rounded-lg" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES & PRICING */}
      <section id="packages" className="py-16 sm:py-24 px-3.5 sm:px-6 lg:px-8 relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5B869]/10 border border-[#E5B869]/25 text-[#E5B869] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
              Clear & Transparent Pricing
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words">
              Choose The Right Level <br />
              <span className="text-[#E5B869]">Of Growth & Support.</span>
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-xs sm:text-base">
              No hidden fees, no long-term lock-ins. Simple investment that pays for itself in higher sales.
            </p>

            {/* Mobile Tab Switcher */}
            <div className="sm:hidden flex items-center justify-center mt-6 p-1 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-slate-200/10 dark:border-white/10 mx-auto w-full max-w-[24rem]">
              <button
                onClick={() => setActivePricingTab('month1')}
                className={`flex-1 py-2 px-0.5 text-center rounded-lg text-[9px] font-bold transition-all ${
                  activePricingTab === 'month1' ? 'bg-[#E5B869] text-black shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1st Month
              </button>
              <button
                onClick={() => setActivePricingTab('growth')}
                className={`flex-1 py-2 px-0.5 text-center rounded-lg text-[9px] font-bold transition-all ${
                  activePricingTab === 'growth' ? 'bg-[#E5B869] text-black shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Growth
              </button>
              <button
                onClick={() => setActivePricingTab('social')}
                className={`flex-1 py-2 px-0.5 text-center rounded-lg text-[9px] font-bold transition-all ${
                  activePricingTab === 'social' ? 'bg-[#E5B869] text-black shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Social
              </button>
              <button
                onClick={() => setActivePricingTab('custom')}
                className={`flex-1 py-2 px-0.5 text-center rounded-lg text-[9px] font-bold transition-all ${
                  activePricingTab === 'custom' ? 'bg-[#E5B869] text-black shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto w-full">
            
            {/* Plan 1: 1st Month Setup & Reporting */}
            <div className={`rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#0D0F17]/90 border transition-all flex flex-col relative w-full ${
              activePricingTab === 'month1' ? 'border-[#E5B869]/50 shadow-2xl shadow-[#E5B869]/10' : 'border-slate-200/10 dark:border-white/10'
            } ${activePricingTab !== 'month1' ? 'hidden sm:flex' : 'flex'}`}>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black/[0.06] dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200/10 dark:border-white/10 mb-2">
                    Phase 1: Foundation
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">Restaurant Setup & Reporting</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] sm:text-xs text-slate-500 line-through block font-medium">£500</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#E5B869] tracking-tight">£300</div>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-400">Save £200</span>
                </div>
              </div>

              <div className="space-y-5 flex-grow mb-6 text-xs sm:text-sm">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]"></span> Delivery Platform Menu Setup
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Professional Menu Setup</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Add Categories, Items, Extras & Add-ons</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Price & Competitor Review</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Offers & Discounts Setup</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Sales-Boosting Menu Improvements</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Ongoing Support & Updates</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]"></span> Social Media & Profile Setup
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Create New & Review Existing Accounts</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Update Business Information</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Set Up Business Profiles</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Improve Profile Appearance</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Customer Review Management</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Branding & Profile Consistency</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]"></span> Sales & Business Reports
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Sales & Expenses Summary</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Supplier Purchases & Platform Fees</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Profit & Loss Report & Top Selling Items</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Business Performance Review</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Monthly Comparison</li>
                    <li className="flex items-center gap-2"><Icons.Check /> 24/7 Live Dashboard Access</li>
                  </ul>
                  <div className="mt-4 p-2.5 rounded-lg bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-900 dark:text-white font-medium leading-tight">Experience your future dashboard in action.</span>
                    <Link href="/demo" className="shrink-0 px-3 py-1.5 rounded text-[9px] font-bold text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] hover:scale-105 transition-transform flex items-center gap-1 shadow-md shadow-[#E5B869]/20">
                      <Icons.Sparkles /> View Demo
                    </Link>
                  </div>
                </div>
              </div>

              <a 
                href="#contact" 
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] text-center shadow-lg shadow-[#E5B869]/20"
              >
                Start With Month 1 Setup
              </a>
            </div>

            {/* Plan 2: 2nd Month+ Monthly Growth Package */}
            <div className={`rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-slate-100 dark:from-[#131622] to-white dark:to-[#0A0C14] border border-[#E5B869]/60 shadow-2xl shadow-[#E5B869]/15 flex flex-col relative w-full ${
              activePricingTab !== 'growth' ? 'hidden sm:flex' : 'flex'
            }`}>

              <div className="flex justify-between items-start mb-6 pt-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#E5B869]/20 text-[#E5B869] border border-[#E5B869]/30 mb-2">
                    Phase 2: Continuous Growth
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">Monthly Growth Package</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] sm:text-xs text-slate-500 line-through block font-medium">£300</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#E5B869] tracking-tight">
                    £250 <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal">/mo</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-400">Cancel Anytime</span>
                </div>
              </div>

              <div className="space-y-5 flex-grow mb-6 text-xs sm:text-sm">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E5B869] pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]"></span> Social Media & Advertising
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> 4 Strategic Posts Per Week (8 Static & 8 Reels)</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Content Creation & Publishing</li>
                    <li className="flex items-center gap-2"><Icons.Check /> FB, Instagram & TikTok Management</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Deals, Offers & Promo Campaign Setup</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Brand Consistency Across All Platforms</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Monthly Performance Report</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E5B869] pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]"></span> Customer Support & Management
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Up to 12 Hours Daily Support (7 Days)</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Daily Review Replies & Monitoring</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Menu Updates & Amendments</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Price Changes, Additions & Removals</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Platform Settings Adjustments</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Business Support & Guidance</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E5B869] pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]"></span> Sales & Business Reports
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Sales & Expenses Summary</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Supplier Purchases & Platform Charges</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Profit & Loss Report & Top Selling Items</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Business Performance & Customer Growth</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Monthly Comparison</li>
                    <li className="flex items-center gap-2"><Icons.Check /> 24/7 Live Dashboard Access</li>
                  </ul>
                  <div className="mt-4 p-2.5 rounded-lg bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-900 dark:text-white font-medium leading-tight">Experience your future dashboard in action.</span>
                    <Link href="/demo" className="shrink-0 px-3 py-1.5 rounded text-[9px] font-bold text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] hover:scale-105 transition-transform flex items-center gap-1 shadow-md shadow-[#E5B869]/20">
                      <Icons.Sparkles /> View Demo
                    </Link>
                  </div>
                </div>
              </div>

              <a 
                href="#contact" 
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] text-center shadow-lg shadow-[#E5B869]/30"
              >
                Choose Monthly Growth Package
              </a>
            </div>

            {/* Plan 3: Social Media Growth Package */}
            <div className={`rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#0D0F17]/90 border border-slate-200/10 dark:border-white/10 transition-all flex flex-col relative w-full ${
              activePricingTab !== 'social' ? 'hidden sm:flex' : 'flex'
            }`}>

              <div className="flex justify-between items-start mb-6 pt-2 h-[7.5rem]">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black/[0.06] dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200/10 dark:border-white/10 mb-2">
                    Social Media & Advertising
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">Social Media Growth Package</h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed pr-2">
                      Professional posts, reels, and local ad campaigns to turn scrollers into loyal diners.
                    </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    £200 <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal">/mo</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 flex-grow mb-6 text-xs sm:text-sm">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span> Social Media Management
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> 12 Professional Posts & 12 Reels Per Month</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Facebook, Instagram & TikTok Management</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Content Creation & Publishing</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Captions, Hashtags & Content Scheduling</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Food, Product & Promotional Offer Content</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Monthly Content Calendar</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span> Social Media Growth
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Brand Consistency Across All Platforms</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Profile & Bio Optimisation</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Trending Content & Reel Ideas</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Best Posting Time Optimisation</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Customer Comments & Engagement Support</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Competitor & Social Media Review</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span> Paid Advertising
                  </h4>


                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Facebook & Instagram Ad Campaign Setup</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Monthly Promotional Ad Campaigns</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Audience Targeting & Location Targeting</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Ad Creative & Copy Preparation</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Campaign Monitoring & Optimisation</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Monthly Advertising Performance Report</li>
                  </ul>
                </div>
              </div>

              <a 
                href="#contact" 
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white dark:text-black bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-center shadow-lg transition-colors"
              >
                Choose Social Media Package
              </a>
            </div>

            {/* Plan 4: Custom Business Solution */}
            <div className={`rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#0D0F17]/90 border border-slate-200/10 dark:border-white/10 transition-all flex flex-col relative w-full ${
              activePricingTab !== 'custom' ? 'hidden sm:flex' : 'flex'
            }`}>

              <div className="flex flex-col items-start mb-6 pt-2 h-[7.5rem]">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black/[0.06] dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200/10 dark:border-white/10 mb-2">
                  CUSTOM BUSINESS SOLUTION
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">Build Your Own Package</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Pricing depends on the services, workload and support required. Tell us what you need &mdash; we will create the right package for your business.
                </p>
              </div>

              <div className="space-y-5 flex-grow mb-6 text-xs sm:text-sm">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span> Custom Services
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Choose Required Services & Photography</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Custom Social Media Management</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Custom Posts, Reels & Content</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Menu & Platform Management</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Customer Review & Profile Management</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Sales & Business Reporting</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span> Marketing & Advertising
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Facebook, Instagram & TikTok Advertising</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Custom Campaign Setup</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Audience & Location Targeting</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Ad Creative & Copywriting</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Campaign Monitoring & Optimisation</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Promotional Campaign Management</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 pb-1.5 mb-2.5 border-b border-slate-200/[0.08] dark:border-white/[0.08] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span> Business Support
                  </h4>


                  <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Icons.Check /> Custom Reporting & Analytics</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Competitor & Market Research</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Offers & Promotions Setup</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Brand & Profile Optimisation</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Ongoing Business Support</li>
                    <li className="flex items-center gap-2"><Icons.Check /> Flexible Monthly Requirements</li>
                  </ul>
                </div>
              </div>

              <a 
                href="#contact" 
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white border border-slate-200/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 text-center shadow-lg transition-colors"
              >
                Request Custom Quote
              </a>
            </div>

          </div>

          {/* Interactive Demo Callout Banner */}
          <div className="mt-10 sm:mt-12 max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl shadow-black/40">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#E5B869]/20 flex items-center justify-center text-[#E5B869] shrink-0 border border-[#E5B869]/30">
                <Icons.Sparkles />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Want to test-drive before subscribing?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore our live simulated dashboard with realistic UK restaurant sales, charts, and OCR invoices.</p>
              </div>
            </div>
            <Link 
              href="/demo"
              className="px-6 py-3 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shadow-lg shadow-[#E5B869]/20 flex items-center gap-1.5"
            >
              <span>Explore Live Demo</span> <Icons.ArrowRight />
            </Link>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 px-3.5 sm:px-6 lg:px-8 border-t border-slate-200/[0.08] dark:border-white/[0.08] bg-slate-50 dark:bg-[#0A0C13] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#E5B869] block mb-2">Simple Onboarding</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">How Riznex Powers Your Restaurant</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">We handle all technical hurdles so you can focus entirely on food quality.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {[
              {
                step: '01',
                title: 'Discover & Audit',
                desc: 'We analyze your current delivery platform accounts, menus, commission fees, and Google profile to identify immediate margin gains.'
              },
              {
                step: '02',
                title: 'Set Up & Synchronize',
                desc: 'We clean up category layouts, craft high-res branding, configure modifier add-ons, and establish automated reporting templates.'
              },
              {
                step: '03',
                title: 'Daily Operations',
                desc: 'Our team monitors orders, posts fresh social content, replies to reviews, and adjusts promotions during peak weekend rushes.'
              },
              {
                step: '04',
                title: 'Weekly P&L Insights',
                desc: 'Every week you receive a clear financial summary showing net sales, commissions, wages, expenses, and true take-home profits.'
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none flex flex-col"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#E5B869] mb-2.5 font-mono">{step.step}</div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT & CONSULTATION FORM */}
      <section id="contact" className="py-16 sm:py-24 px-3.5 sm:px-6 lg:px-8 border-t border-slate-200/[0.08] dark:border-white/[0.08] relative w-full overflow-hidden">
        <div className="max-w-4xl mx-auto w-full">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#E5B869] block mb-2">Get Started Today</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">Ready to Take Control of Your Restaurant&apos;s Growth?</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Send us a quick message. Our team will review your menu and delivery platforms and get in touch within 24 hours.</p>
          </div>

          <div className="p-5 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0D0F17]/95 border border-slate-200/10 dark:border-white/10 backdrop-blur-xl shadow-2xl w-full">
            {formSent ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#E5B869]/20 text-[#E5B869] mx-auto flex items-center justify-center mb-3">
                  <Icons.Check />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Thank you! Your inquiry has been received.</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  A Riznex restaurant specialist will review your details and contact you shortly to schedule your introductory walkthrough.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Restaurant Name</label>
                    <input 
                      type="text" 
                      name="restaurantName"
                      required 
                      placeholder="e.g. Spice Lounge UK" 
                      className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-slate-200/[0.1] dark:border-white/[0.1] rounded-xl px-3.5 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B869] focus:ring-1 focus:ring-[#E5B869] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      name="yourName"
                      required 
                      placeholder="e.g. Tariq Khan" 
                      className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-slate-200/[0.1] dark:border-white/[0.1] rounded-xl px-3.5 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B869] focus:ring-1 focus:ring-[#E5B869] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="emailAddress"
                      required 
                      placeholder="manager@restaurant.co.uk" 
                      className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-slate-200/[0.1] dark:border-white/[0.1] rounded-xl px-3.5 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B869] focus:ring-1 focus:ring-[#E5B869] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      required 
                      placeholder="e.g. +44 7911 123456" 
                      className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-slate-200/[0.1] dark:border-white/[0.1] rounded-xl px-3.5 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B869] focus:ring-1 focus:ring-[#E5B869] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">How can we assist you?</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    required 
                    placeholder="Tell us about your current delivery platforms, weekly issues, or goals..." 
                    className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-slate-200/[0.1] dark:border-white/[0.1] rounded-xl px-3.5 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B869] focus:ring-1 focus:ring-[#E5B869] transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={formSubmitting}
                  className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] shadow-lg shadow-[#E5B869]/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {formSubmitting ? 'Sending Request...' : 'Send Free Consultation Request'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* FOOTER (PROMINENT, 100% VISIBLE & RESPONSIVE) */}
      <footer className="py-12 sm:py-16 border-t border-slate-200/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#050609] text-xs text-slate-500 dark:text-slate-400 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 w-full">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/images/new-logo.jpg" alt="Riznex Logo" className="h-7 w-auto object-contain rounded" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">Riznex Digital Solutions</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Dedicated digital management, marketing, and reporting software for ambitious UK restaurants.
              </p>
              <div className="text-[10px] text-slate-500">
                Serving Restaurants Nationwide across England, Scotland & Wales.
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-xs mb-3 uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#services" className="hover:text-slate-900 dark:hover:text-white transition-colors">Services Overview</a></li>
                <li><a href="#platforms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Platform Integrations</a></li>
                <li><a href="#packages" className="hover:text-slate-900 dark:hover:text-white transition-colors">Packages & Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 3: Client Area & Legal */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-xs mb-3 uppercase tracking-wider">Client & Legal</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/client-login" className="hover:text-[#E5B869] transition-colors font-medium">Client Login</Link></li>
                <li><Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">Admin Portal</Link></li>
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('privacy')} 
                    className="hover:text-[#E5B869] transition-colors text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('terms')} 
                    className="hover:text-[#E5B869] transition-colors text-left cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('cookies')} 
                    className="hover:text-[#E5B869] transition-colors text-left cursor-pointer"
                  >
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-xs mb-3 uppercase tracking-wider">Direct Contact</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mb-2">
                Email: <br />
                <a href="mailto:riznexdigitalsolutions@gmail.com" className="text-[#E5B869] hover:underline font-mono text-[11px] break-all">
                  riznexdigitalsolutions@gmail.com
                </a>
              </p>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                Operating Hours: <br />
                Monday – Sunday (7 Days Availability)
              </p>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-200/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Riznex Digital Solutions. All rights reserved.</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => setActiveLegalModal('privacy')} 
                className="hover:text-[#E5B869] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button 
                onClick={() => setActiveLegalModal('terms')} 
                className="hover:text-[#E5B869] transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <span>·</span>
              <button 
                onClick={() => setActiveLegalModal('cookies')} 
                className="hover:text-[#E5B869] transition-colors cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE LEGAL MODAL */}
      {activeLegalModal && (
        <div 
          className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveLegalModal(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-[#0D0F17] border border-slate-200/15 dark:border-white/15 p-5 sm:p-8 shadow-2xl flex flex-col overflow-hidden text-slate-700 dark:text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200/10 dark:border-white/10 shrink-0">
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#E5B869] block mb-0.5">
                  Legal Compliance · UK GDPR
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                  {activeLegalModal === 'privacy' && 'Privacy Policy'}
                  {activeLegalModal === 'terms' && 'Terms of Service'}
                  {activeLegalModal === 'cookies' && 'Cookie Policy'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="p-1.5 sm:p-2 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-slate-200/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Close Modal"
              >
                <Icons.Close />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto pr-1 sm:pr-2 space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {activeLegalModal === 'privacy' && (
                <>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">Last Updated: September 2026</p>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">1. Introduction & Overview</h4>
                    <p>Riznex Digital Solutions (&quot;Riznex&quot;, &quot;we&quot;, &quot;our&quot;) is dedicated to protecting the privacy and security of our restaurant partners and their clients. We adhere strictly to the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">2. Restaurant Data We Collect</h4>
                    <p>To provide unified restaurant management and reporting services, we process:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                      <li>Business contact details (restaurant name, manager name, email, phone number).</li>
                      <li>Delivery platform data via authorized access (Uber Eats, Just Eat, Deliveroo sales figures, order counts, and commission statements).</li>
                      <li>Invoices, supplier statements, and operational expenses uploaded for automated profit analysis.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">3. How We Use Your Data</h4>
                    <p>We process restaurant data exclusively to deliver agreed business management services: updating and synchronizing menus, generating weekly consolidated profit-and-loss reports, replying to online guest reviews, and executing promotional marketing.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">4. Data Confidentiality & Security</h4>
                    <p>Your financial metrics, sales numbers, and customer feedback are treated with strict commercial confidentiality. We implement industry-standard encryption protocols and never sell, trade, or share client restaurant data with unauthorized third parties.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">5. Your Rights & Inquiries</h4>
                    <p>Under UK GDPR, you have the right to request access to, correction of, or complete deletion of your business records. For any data inquiries, contact our Data Protection Officer at <a href="mailto:riznexdigitalsolutions@gmail.com" className="text-[#E5B869] underline">riznexdigitalsolutions@gmail.com</a>.</p>
                  </div>
                </>
              )}

              {activeLegalModal === 'terms' && (
                <>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">Last Updated: September 2026</p>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">1. Agreement to Terms</h4>
                    <p>By engaging Riznex Digital Solutions or accessing our reporting dashboard, you agree to comply with and be bound by these Terms of Service. These terms apply to all restaurant operators and clients.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">2. Scope of Services</h4>
                    <p>Riznex acts as an authorized digital manager for food & beverage establishments across the UK. Services include delivery aggregator synchronization (Uber Eats, Just Eat, Deliveroo), social media marketing, local SEO profile management, and weekly financial reporting.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">3. Pricing, Invoicing & Billing</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                      <li><strong>Phase 1 (1st Month Setup & Reporting):</strong> £300 one-time fee (standard £500) covering complete digital overhaul, menu restructuring, and baseline reports.</li>
                      <li><strong>Phase 2 (Ongoing Monthly Growth):</strong> £250 per month on a rolling basis, covering daily account management, social content, and weekly P&L summaries.</li>
                      <li>Payments are invoiced monthly. Services can be paused or cancelled with 14 days written notice prior to the next billing cycle.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">4. Account Ownership & Client Responsibilities</h4>
                    <p>Clients retain full legal ownership of their primary delivery platform accounts and commercial trademarks. Clients are responsible for notifying Riznex of price adjustments, stock shortages (86-ing items), or altered trading hours.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">5. Governing Law</h4>
                    <p>These terms and any dispute arising from them shall be governed by and construed in accordance with the laws of England and Wales.</p>
                  </div>
                </>
              )}

              {activeLegalModal === 'cookies' && (
                <>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">Last Updated: September 2026</p>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">1. What Are Cookies?</h4>
                    <p>Cookies are small text files placed on your device by websites that you visit. They are widely used to make websites work efficiently, provide secure authentication, and supply reporting insights to site operators.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">2. How Riznex Uses Cookies</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                      <li><strong>Strictly Necessary Cookies:</strong> Essential for authenticating restaurant managers into the Riznex Client Dashboard and maintaining secure session tokens.</li>
                      <li><strong>Performance & Analytics Cookies:</strong> Anonymous telemetry that helps us optimize page load speed, mobile navigation responsiveness, and report generation times.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm text-[#E5B869]">3. Managing Your Cookies</h4>
                    <p>You can adjust your browser settings to refuse all or some browser cookies, or to alert you when websites set cookies. Please note that disabling essential cookies will prevent successful login to your Riznex Dashboard.</p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3.5 mt-3.5 border-t border-slate-200/10 dark:border-white/10 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-500">Riznex Digital Solutions UK</span>
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



