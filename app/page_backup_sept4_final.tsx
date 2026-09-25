'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Pure CSS / SVG Icons
const Icons = {
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>,
  Lock: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>,
  BigLock: () => <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>,
  Check: () => <svg className="w-4 h-4 text-[#C89B3C] shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>,
  CheckCircle: () => <svg className="w-4 h-4 text-[#C89B3C] shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  ArrowRight: () => <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>,
  
  // Custom Line Icons for Services
  MenuIcon: () => <svg className="w-12 h-12 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 11h8"></path></svg>,
  SocialIcon: () => <svg className="w-12 h-12 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 10h4"></path></svg>,
  ProfileIcon: () => <svg className="w-12 h-12 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  SupportIcon: () => <svg className="w-12 h-12 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>,
  ReportIcon: () => <svg className="w-12 h-12 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
  GrowthIcon: () => <svg className="w-12 h-12 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>,

  // How It Works Icons
  Discover: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
  Setup: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  Manage: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
  Improve: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>,
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C89B3C] selection:text-black overflow-x-hidden">
      
      {/* HEADER / NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          <Link href="/" className="flex items-center">
            <img src="/images/new-logo.jpg" alt="Riznex Logo" className="h-10 md:h-12 w-auto mix-blend-screen" />
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 ml-8">
            {['Home', 'Services', 'Packages', 'How It Works', 'About', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-300 hover:text-[#C89B3C] transition-colors">{link}</a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/client-login" className="flex items-center gap-2 px-6 py-2.5 border border-[#C89B3C] text-white text-[0.65rem] font-bold uppercase tracking-widest hover:bg-[#C89B3C]/10 transition-colors rounded-sm">
              <Icons.Lock /> CLIENT LOGIN
            </Link>
            <a href="#contact" className="px-6 py-2.5 bg-[#C89B3C] text-black text-[0.65rem] font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-sm">GET STARTED</a>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
            {['Home', 'Services', 'Packages', 'How It Works', 'About', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-[#C89B3C] py-2 border-b border-white/5">{link}</a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/client-login" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-3 border border-[#C89B3C] text-white text-[0.7rem] font-bold uppercase tracking-widest rounded-sm">
                <Icons.Lock /> CLIENT LOGIN
              </Link>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-[#C89B3C] text-black text-center text-[0.7rem] font-bold uppercase tracking-widest rounded-sm">GET STARTED</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 lg:px-12 bg-black text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C89B3C]/10 via-black to-black pointer-events-none"></div>
        {/* Abstract curve background approximation */}
        <div className="absolute right-0 top-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIj48cGF0aCBkPSJNMCA0MDBRNDAwIDAgODAwIDQwMCIgc3Ryb2tlPSIjQzg5QjNDIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] bg-no-repeat bg-right-top opacity-30 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row items-center gap-12 relative z-10">
          
          {/* Left Text */}
          <div className="xl:w-1/2 flex flex-col items-start">
            <h3 className="text-[#C89B3C] font-semibold text-[0.75rem] md:text-sm mb-4 uppercase tracking-widest">
               DIGITAL SOLUTIONS FOR UK RESTAURANTS
            </h3>
            <h1 className="text-[2.5rem] md:text-5xl lg:text-[4.5rem] font-black tracking-tight leading-[1] mb-6 text-white">
              WE HELP RESTAURANTS<br/>
              RUN SMARTER &<br/>
              GROW ONLINE.
            </h1>
            <p className="text-gray-300 text-sm md:text-[1.05rem] leading-relaxed mb-10 max-w-[32rem] font-normal">
              Riznex Digital Solutions helps UK restaurants manage delivery platforms, social media, customer support and business reporting through one professional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              <a href="#contact" className="px-8 py-3.5 bg-[#C89B3C] text-black font-bold uppercase tracking-widest text-[0.75rem] hover:bg-white transition-all rounded-sm text-center">GET STARTED <Icons.ArrowRight /></a>
              <Link href="/client-login" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border border-[#C89B3C] text-white font-bold uppercase tracking-widest text-[0.75rem] hover:bg-[#C89B3C]/10 transition-all rounded-sm text-center">
                <Icons.Lock /> CLIENT LOGIN
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.7rem] font-semibold text-white tracking-wide">
               <span className="flex items-center"><Icons.CheckCircle /> Delivery Platforms</span>
               <span className="flex items-center"><Icons.CheckCircle /> Social Media</span>
               <span className="flex items-center"><Icons.CheckCircle /> Business Reporting</span>
               <span className="flex items-center"><Icons.CheckCircle /> Ongoing Management</span>
            </div>
          </div>
          
          {/* Right Dashboard Visual */}
          <div className="xl:w-1/2 w-full mt-12 xl:mt-0">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-5 shadow-2xl flex flex-col gap-5 relative">
               
               {/* Top Row: Business Overview */}
               <div className="bg-[#161616] rounded-md border border-white/5 p-5 relative">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-xs font-bold text-white">Business Overview</span>
                     <span className="text-[0.65rem] bg-[#222] text-gray-400 px-3 py-1.5 rounded border border-white/5 font-medium cursor-pointer hover:text-white">This Month ▾</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {/* Sales */}
                     <div className="border border-white/5 bg-[#1C1C1C] p-4 rounded-md flex flex-col relative overflow-hidden">
                        <span className="text-[0.65rem] text-gray-400 mb-1">Total Sales</span>
                        <span className="text-2xl font-bold text-white mb-2 tracking-tight">£18,420</span>
                        <span className="text-[0.6rem] text-[#00C48C] font-bold">↑ 12.5%</span>
                        {/* CSS Line Chart */}
                        <svg className="absolute bottom-2 right-2 w-20 h-10 text-[#C89B3C]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 25 L15 20 L30 22 L45 10 L60 15 L75 8 L100 2"/></svg>
                     </div>
                     {/* Orders */}
                     <div className="border border-white/5 bg-[#1C1C1C] p-4 rounded-md flex flex-col relative overflow-hidden">
                        <span className="text-[0.65rem] text-gray-400 mb-1">Orders</span>
                        <span className="text-2xl font-bold text-white mb-2 tracking-tight">1,284</span>
                        <span className="text-[0.6rem] text-[#00C48C] font-bold">↑ 8.7%</span>
                        <svg className="absolute bottom-2 right-2 w-20 h-10 text-[#C89B3C]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 20 L20 25 L40 15 L60 18 L80 8 L100 5"/></svg>
                     </div>
                     {/* Profit */}
                     <div className="border border-white/5 bg-[#1C1C1C] p-4 rounded-md flex flex-col relative overflow-hidden">
                        <span className="text-[0.65rem] text-gray-400 mb-1">Profit</span>
                        <span className="text-2xl font-bold text-white mb-2 tracking-tight">£4,280</span>
                        <span className="text-[0.6rem] text-[#00C48C] font-bold">↑ 15.3%</span>
                        <svg className="absolute bottom-2 right-2 w-20 h-10 text-[#C89B3C]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 28 L15 20 L30 24 L50 12 L70 16 L85 5 L100 2"/></svg>
                     </div>
                     {/* Expenses */}
                     <div className="border border-white/5 bg-[#1C1C1C] p-4 rounded-md flex flex-col relative overflow-hidden">
                        <span className="text-[0.65rem] text-gray-400 mb-1">Expenses</span>
                        <span className="text-2xl font-bold text-white mb-2 tracking-tight">£3,840</span>
                        <span className="text-[0.6rem] text-red-500 font-bold">↓ 7.1%</span>
                        <svg className="absolute bottom-2 right-2 w-20 h-10 text-[#C89B3C]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 5 L20 10 L40 5 L60 20 L80 15 L100 25"/></svg>
                     </div>
                  </div>
               </div>

               {/* Middle Row: Sales Overview Bar Chart */}
               <div className="bg-[#161616] rounded-md border border-white/5 p-5 h-40 flex flex-col">
                  <span className="text-xs font-bold text-white mb-3">Sales Overview</span>
                  <div className="flex-1 flex items-end justify-between gap-1 relative">
                     <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[0.45rem] text-gray-500 py-1 font-medium">
                        <span>20K</span><span>15K</span><span>10K</span><span>5K</span><span>0</span>
                     </div>
                     <div className="ml-6 flex-1 flex items-end justify-between gap-1 h-full pt-4 pb-1 border-b border-white/10">
                        {[40,30,50,60,35,45,80,60,50,40,90,70,50,60,80,100,60,50,80,90,100].map((h, i) => (
                           <div key={i} className={`w-full rounded-t-sm ${i%3===0 ? 'bg-[#C89B3C]' : i%2===0 ? 'bg-gray-400' : 'bg-gray-600'}`} style={{height: `${h}%`}}></div>
                        ))}
                     </div>
                  </div>
                  <div className="ml-6 flex justify-between text-[0.45rem] text-gray-500 mt-2 font-medium">
                     <span>1 May</span><span>8 May</span><span>15 May</span><span>22 May</span><span>29 May</span>
                  </div>
               </div>

               {/* Bottom Row: Top Platforms */}
               <div className="bg-[#161616] rounded-md border border-white/5 p-5 flex flex-col">
                  <span className="text-xs font-bold text-white mb-4">Top Platforms</span>
                  <div className="grid grid-cols-4 gap-2">
                     <div className="flex flex-col gap-1">
                        <span className="text-[#06C167] text-[0.65rem] font-bold">Uber Eats</span>
                        <div className="flex items-baseline gap-2"><span className="text-white text-base font-bold">£7,820</span><span className="text-gray-400 text-[0.6rem]">42%</span></div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[#F36D00] text-[0.65rem] font-bold">JUST EAT</span>
                        <div className="flex items-baseline gap-2"><span className="text-white text-base font-bold">£5,230</span><span className="text-gray-400 text-[0.6rem]">28%</span></div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[#00CCBC] text-[0.65rem] font-bold">deliveroo</span>
                        <div className="flex items-baseline gap-2"><span className="text-white text-base font-bold">£3,650</span><span className="text-gray-400 text-[0.6rem]">19%</span></div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-[0.65rem] font-bold">Other</span>
                        <div className="flex items-baseline gap-2"><span className="text-white text-base font-bold">£1,720</span><span className="text-gray-400 text-[0.6rem]">11%</span></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* PLATFORM STRIP (White block) */}
      <div className="bg-[#F8F9FA] py-8 border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
           <div className="text-black font-black text-sm lg:text-base max-w-[300px] leading-tight">
             BUILT AROUND THE PLATFORMS<br/>YOUR RESTAURANT ALREADY USES
           </div>
           <div className="flex flex-wrap justify-center lg:justify-end items-center gap-8 lg:gap-10">
             <span className="text-[#06C167] font-black text-2xl md:text-3xl tracking-tighter">Uber <span className="font-medium">Eats</span></span>
             <span className="text-[#F36D00] font-black text-xl md:text-2xl">JUST EAT</span>
             <span className="text-[#00CCBC] font-black text-xl md:text-2xl tracking-tight">deliveroo</span>
             <span className="text-[#1877F2] font-bold text-lg md:text-xl">Facebook</span>
             <span className="font-bold text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500">Instagram</span>
             <span className="text-black font-bold text-lg md:text-xl tracking-tight">TikTok</span>
             <div className="flex flex-col items-center justify-center">
               <span className="text-[#4285F4] font-bold text-lg md:text-xl leading-none">Google</span>
               <span className="text-gray-500 text-[0.55rem] uppercase tracking-widest font-bold mt-1">Business Profile</span>
             </div>
           </div>
        </div>
      </div>
      {/* SERVICES SECTION */}
      <section id="services" className="pt-24 pb-20 px-6 lg:px-12 bg-[#050505] text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[1.75rem] md:text-4xl font-bold tracking-tight uppercase leading-tight text-white">
              ONE PARTNER. YOUR WHOLE <span className="text-[#C89B3C]">DIGITAL OPERATION.</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
             {[
               { i: <Icons.MenuIcon/>, t: 'MENU\nMANAGEMENT', d: 'Keep your menus accurate, optimised and up to date across all platforms.' },
               { i: <Icons.SocialIcon/>, t: 'SOCIAL MEDIA\nMANAGEMENT', d: 'Engaging content, regular posting and brand consistency.' },
               { i: <Icons.ProfileIcon/>, t: 'BUSINESS\nPROFILES', d: 'Optimised profiles that help customers find and trust your restaurant.' },
               { i: <Icons.SupportIcon/>, t: 'CUSTOMER\nSUPPORT', d: 'We handle reviews, messages and customer communications.' },
               { i: <Icons.ReportIcon/>, t: 'BUSINESS\nREPORTING', d: 'Clear reports that help you understand and grow your business.' },
               { i: <Icons.GrowthIcon/>, t: 'GROWTH &\nMARKETING', d: 'Promotions, advertising and strategies that drive more orders.' }
             ].map((c, i) => (
               <div key={i} className="border border-[#C89B3C]/30 rounded-md p-6 flex flex-col items-center text-center transition-colors group cursor-pointer bg-black hover:border-[#C89B3C]">
                 <div className="text-[#C89B3C] mb-6 flex items-center justify-center h-12">{c.i}</div>
                 <h4 className="font-black uppercase tracking-widest text-[0.8rem] mb-4 min-h-[40px] whitespace-pre-line leading-tight">{c.t}</h4>
                 <p className="text-gray-300 text-[0.7rem] leading-relaxed mb-4 flex-grow font-medium">{c.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section id="packages" className="py-24 md:py-32 px-6 lg:px-12 bg-[#F7F5F0] text-black border-t border-[#C89B3C]/30">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[1.75rem] md:text-[2.25rem] font-black tracking-tight uppercase leading-[1.1] text-[#111]">
              CHOOSE THE <span className="text-[#C89B3C]">RIGHT LEVEL</span> OF SUPPORT<br/>FOR YOUR RESTAURANT
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 max-w-6xl mx-auto">
            
            {/* Package 1 */}
            <div className="bg-[#FCFBF8] rounded-xl border border-[#E8E3D5] flex flex-col relative shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                 <span className="bg-[#C89B3C] text-black text-[0.65rem] font-black px-6 py-1.5 rounded-full shadow-sm uppercase tracking-widest">1ST MONTH</span>
              </div>
              
              <div className="text-center px-8 pt-12 pb-8 border-b border-[#E8E3D5]/60">
                 <h3 className="text-[1.5rem] md:text-[1.8rem] font-black uppercase tracking-tighter leading-[1.1] mb-4 text-[#111]">RESTAURANT<br/>SETUP & REPORTING</h3>
                 <p className="text-[#555] text-[0.75rem] max-w-[300px] mx-auto mb-6 font-medium leading-relaxed">
                   We help restaurants improve their menus, set up social media accounts and establish clear business reporting.
                 </p>
                 
                 <div className="flex items-center justify-center gap-3">
                    <div className="text-[#999] line-through font-bold text-xl relative top-1">£250</div>
                    <div className="text-[#C89B3C] text-[3.25rem] font-black leading-none tracking-tighter">£200</div>
                    <div className="bg-[#111] text-[#C89B3C] text-[0.55rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full relative top-1">Special Offer</div>
                 </div>
              </div>
              
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow mb-12">
                    <div>
                       <h4 className="text-[#111] font-black uppercase tracking-widest text-[0.6rem] mb-4 leading-relaxed">DELIVERY PLATFORM<br/>MENU SETUP</h4>
                       <ul className="space-y-2.5 text-[0.65rem] font-medium text-[#444] leading-tight">
                         {['Professional Menu Setup', 'Add Categories & Items', 'Extras & Add-ons Setup', 'Price & Competitor Review', 'Offers & Discounts Setup', 'Sales-Boosting Improvements', 'Ongoing Support & Updates'].map(item => <li key={item} className="flex items-start"><Icons.Check /> <span className="pt-0.5">{item}</span></li>)}
                       </ul>
                    </div>
                    <div>
                       <h4 className="text-[#111] font-black uppercase tracking-widest text-[0.6rem] mb-4 leading-relaxed">SOCIAL MEDIA &<br/>PROFILE SETUP</h4>
                       <ul className="space-y-2.5 text-[0.65rem] font-medium text-[#444] leading-tight">
                         {['Create New Accounts', 'Review Existing Accounts', 'Update Business Information', 'Set Up Business Profiles', 'Improve Profile Appearance', 'Customer Review Management', 'Branding & Consistency'].map(item => <li key={item} className="flex items-start"><Icons.Check /> <span className="pt-0.5">{item}</span></li>)}
                       </ul>
                    </div>
                    <div>
                       <h4 className="text-[#111] font-black uppercase tracking-widest text-[0.6rem] mb-4 leading-relaxed">SALES & BUSINESS<br/>REPORTS</h4>
                       <ul className="space-y-2.5 text-[0.65rem] font-medium text-[#444] leading-tight">
                         {['Sales Summary', 'Expenses Summary', 'Supplier Purchases', 'Platform Fees & Charges', 'Profit & Loss Report', 'Top Selling Items', 'Business Performance Review', 'Monthly Comparison'].map(item => <li key={item} className="flex items-start"><Icons.Check /> <span className="pt-0.5">{item}</span></li>)}
                       </ul>
                    </div>
                 </div>
                 
                 <div className="flex justify-center mt-auto">
                   <a href="#contact" className="px-10 py-3.5 bg-[#C89B3C] text-black font-black uppercase tracking-widest text-[0.7rem] hover:bg-[#111] hover:text-[#C89B3C] transition-colors rounded-sm flex items-center">START WITH MONTH 1 <Icons.ArrowRight /></a>
                 </div>
              </div>
            </div>

            {/* Package 2 */}
            <div className="bg-[#FCFBF8] rounded-xl border border-[#E8E3D5] flex flex-col relative shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                 <span className="bg-[#C89B3C] text-black text-[0.65rem] font-black px-6 py-1.5 rounded-full shadow-sm uppercase tracking-widest">2ND MONTH+</span>
              </div>
              
              <div className="text-center px-8 pt-12 pb-8 border-b border-[#E8E3D5]/60">
                 <h3 className="text-[1.5rem] md:text-[1.8rem] font-black uppercase tracking-tighter leading-[1.1] mb-4 text-[#111]">MONTHLY<br/>GROWTH PACKAGE</h3>
                 <p className="text-[#555] text-[0.75rem] max-w-[300px] mx-auto mb-6 font-medium leading-relaxed">
                   Ongoing support to help restaurants maintain their digital presence, manage accounts and grow their business.
                 </p>
                 
                 <div className="flex items-center justify-center gap-3">
                    <div className="text-[#999] line-through font-bold text-xl relative top-1">£180</div>
                    <div className="flex items-baseline gap-1"><span className="text-[#C89B3C] text-[3.25rem] font-black leading-none tracking-tighter">£150</span><span className="text-[#111] font-black text-xs uppercase tracking-widest">/ MONTH</span></div>
                    <div className="bg-[#111] text-[#C89B3C] text-[0.55rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full relative top-1">Special Offer</div>
                 </div>
              </div>
              
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow mb-12">
                    <div>
                       <h4 className="text-[#111] font-black uppercase tracking-widest text-[0.6rem] mb-4 leading-relaxed">SOCIAL MEDIA &<br/>ADVERTISING</h4>
                       <ul className="space-y-2.5 text-[0.65rem] font-medium text-[#444] leading-tight">
                         {['3 Posts Per Week', '6 Static & 6 Reels/Month', 'Content Creation & Publishing', 'Facebook, Instagram & TikTok', 'Ad Campaign Management', 'Offers & Promotions Setup', 'Brand Consistency', 'Monthly Performance Report'].map(item => <li key={item} className="flex items-start"><Icons.Check /> <span className="pt-0.5">{item}</span></li>)}
                       </ul>
                    </div>
                    <div>
                       <h4 className="text-[#111] font-black uppercase tracking-widest text-[0.6rem] mb-4 leading-relaxed">CUSTOMER SUPPORT &<br/>ACCOUNT MANAGEMENT</h4>
                       <ul className="space-y-2.5 text-[0.65rem] font-medium text-[#444] leading-tight">
                         {['Up to 12 Hours Daily Support', '7 Days a Week Availability', 'Daily Review Replies & Monitoring', 'Menu Updates & Amendments', 'Price Changes & Product Updates', 'Item Additions & Removals', 'Platform Settings Adjustments', 'Business Support & Guidance'].map(item => <li key={item} className="flex items-start"><Icons.Check /> <span className="pt-0.5">{item}</span></li>)}
                       </ul>
                    </div>
                    <div>
                       <h4 className="text-[#111] font-black uppercase tracking-widest text-[0.6rem] mb-4 leading-relaxed">SALES & BUSINESS<br/>REPORTS</h4>
                       <ul className="space-y-2.5 text-[0.65rem] font-medium text-[#444] leading-tight">
                         {['Sales Summary', 'Expenses Summary', 'Supplier Purchases', 'Platform Charges & Commissions', 'Profit & Loss Report', 'Top Selling Items', 'Business Performance Review', 'Monthly Comparison', 'Customer Growth Overview'].map(item => <li key={item} className="flex items-start"><Icons.Check /> <span className="pt-0.5">{item}</span></li>)}
                       </ul>
                    </div>
                 </div>
                 
                 <div className="flex justify-center mt-auto">
                   <a href="#contact" className="px-10 py-3.5 bg-[#C89B3C] text-black font-black uppercase tracking-widest text-[0.7rem] hover:bg-[#111] hover:text-[#C89B3C] transition-colors rounded-sm flex items-center">CHOOSE MONTHLY GROWTH <Icons.ArrowRight /></a>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-black text-white border-y border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[1.5rem] md:text-2xl font-bold tracking-widest uppercase text-white">
              HOW RIZNEX WORKS
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 relative mt-10">
             {/* Dashed line */}
             <div className="hidden lg:block absolute top-[1.25rem] left-[15%] right-[15%] border-t border-dashed border-[#C89B3C]/40 z-0"></div>
             
             {[
               { n: '01', i: <Icons.Discover/>, t: 'DISCOVER', d: 'We understand your restaurant, platforms, current setup and goals.' },
               { n: '02', i: <Icons.Setup/>, t: 'SET UP', d: 'We organise your menus, profiles, branding and reporting structure.' },
               { n: '03', i: <Icons.Manage/>, t: 'MANAGE', d: 'We handle ongoing updates, social media, support and digital operations.' },
               { n: '04', i: <Icons.Improve/>, t: 'REVIEW & IMPROVE', d: 'You receive clear reports and insights to make better decisions.' }
             ].map((s, i) => (
               <div key={i} className="flex flex-col items-start lg:items-center relative z-10 bg-black lg:px-4 w-full lg:w-1/4">
                 <div className="flex items-center gap-4 mb-5 bg-black px-2">
                   <span className="text-[#C89B3C] text-xl font-bold">{s.n}</span>
                   <div className="w-10 h-10 rounded-full border border-[#C89B3C] flex items-center justify-center text-[#C89B3C]">
                     {s.i}
                   </div>
                 </div>
                 <div className="flex flex-col lg:items-center text-left lg:text-center">
                   <h4 className="font-bold uppercase tracking-widest text-[0.7rem] mb-2 text-white">{s.t}</h4>
                   <p className="text-gray-400 text-[0.65rem] leading-relaxed max-w-[200px] font-medium">{s.d}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CLIENT CTA SECTION */}
      <section className="py-20 px-6 lg:px-12 bg-black text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="border border-[#C89B3C]/30 rounded-lg p-10 flex flex-col xl:flex-row items-center justify-between gap-12 bg-black relative overflow-hidden">
             
             {/* Left Text */}
             <div className="xl:w-[45%] flex flex-col items-start relative z-10">
                <div className="flex items-start gap-6 mb-4">
                  <div className="w-16 h-16 border border-[#C89B3C]/40 rounded-lg flex items-center justify-center text-[#C89B3C] shrink-0 mt-2">
                    <Icons.BigLock />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-[2rem] font-black tracking-tight uppercase leading-[1.1] mb-3">
                      ALREADY A RIZNEX CLIENT?
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-md">
                      Access your private dashboard to view your restaurant's reports, performance information, documents and account updates.
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                      <Link href="/client-login" className="px-6 py-2.5 bg-[#C89B3C] text-black font-bold uppercase tracking-widest text-[0.7rem] hover:bg-white transition-colors rounded-sm flex items-center gap-2">
                        CLIENT LOGIN <Icons.ArrowRight />
                      </Link>
                      <div className="flex items-center gap-2 text-gray-400 text-[0.65rem] font-bold uppercase tracking-widest">
                        <Icons.Lock /> SECURE CLIENT AREA
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Middle Checklist */}
             <div className="xl:w-[20%] flex flex-col gap-4 relative z-10">
                {[
                  'Real-time business reports',
                  'Sales & performance tracking',
                  'Platform overview',
                  'Documents & updates',
                  '24/7 secure access'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[0.65rem] font-bold tracking-wide text-gray-300">
                     <Icons.CheckCircle /> {item}
                  </div>
                ))}
             </div>

             {/* Right Dashboard Mockup Image via CSS */}
             <div className="xl:w-[35%] w-full flex justify-end items-end relative z-10 pt-10 xl:pt-0">
                {/* Laptop */}
                <div className="w-[300px] xl:w-[350px] relative">
                  <div className="bg-[#111] border-t border-x border-white/20 rounded-t-lg p-2 pb-0 shadow-2xl relative z-10">
                    <div className="bg-[#050505] rounded-t border border-white/10 border-b-0 h-[200px] p-2 flex flex-col gap-2">
                       <div className="flex justify-between items-center px-1 mb-2">
                          <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div></div>
                       </div>
                       <div className="flex gap-2 h-full">
                         {/* Sidebar */}
                         <div className="w-1/4 h-full bg-[#111] rounded p-1.5 flex flex-col gap-1">
                           <div className="w-full h-2 bg-white/10 rounded mb-2"></div>
                           <div className="w-full h-1.5 bg-[#C89B3C]/30 rounded"></div>
                           <div className="w-full h-1.5 bg-white/5 rounded"></div>
                           <div className="w-full h-1.5 bg-white/5 rounded"></div>
                           <div className="w-full h-1.5 bg-white/5 rounded"></div>
                         </div>
                         {/* Main Content */}
                         <div className="w-3/4 h-full flex flex-col gap-2">
                           <div className="flex gap-2">
                             <div className="w-1/3 h-10 bg-[#111] rounded border border-white/5 p-1"><div className="w-4 h-1 bg-white/20 rounded mb-1"></div><div className="w-6 h-2 bg-white rounded"></div></div>
                             <div className="w-1/3 h-10 bg-[#111] rounded border border-white/5 p-1"><div className="w-4 h-1 bg-white/20 rounded mb-1"></div><div className="w-6 h-2 bg-white rounded"></div></div>
                             <div className="w-1/3 h-10 bg-[#111] rounded border border-white/5 p-1"><div className="w-4 h-1 bg-white/20 rounded mb-1"></div><div className="w-6 h-2 bg-white rounded"></div></div>
                           </div>
                           <div className="w-full flex-1 bg-[#111] rounded border border-white/5 p-2 flex items-end justify-between gap-1">
                              {[30,50,40,70,50,80,90,60,40,70,60,80,100].map((h, i) => (
                                 <div key={i} className="w-full bg-[#C89B3C] rounded-t-sm" style={{height: `${h}%`}}></div>
                              ))}
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                  <div className="h-3 bg-[#222] rounded-b-xl border border-white/20 relative z-20 mx-[-10px]">
                    <div className="w-16 h-1 bg-[#111] mx-auto rounded-b-md"></div>
                  </div>
                  
                  {/* Mobile Phone Mockup Overlay */}
                  <div className="absolute -bottom-4 -right-4 w-[90px] h-[180px] bg-black border-[3px] border-[#333] rounded-2xl shadow-2xl z-30 flex flex-col p-1.5">
                    <div className="w-1/3 h-1 bg-[#333] rounded-full mx-auto mb-2"></div>
                    <div className="w-full h-1/4 bg-[#111] rounded mb-1.5 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-[3px] border-[#C89B3C] border-r-transparent"></div>
                    </div>
                    <div className="flex gap-1 mb-1.5">
                      <div className="w-1/2 h-8 bg-[#111] rounded"></div>
                      <div className="w-1/2 h-8 bg-[#111] rounded"></div>
                    </div>
                    <div className="w-full flex-1 bg-[#111] rounded flex items-end p-1 gap-0.5">
                       {[30,50,40,70,90,60].map((h, i) => (
                          <div key={i} className="w-full bg-[#C89B3C] rounded-t-[1px]" style={{height: `${h}%`}}></div>
                       ))}
                    </div>
                  </div>
                </div>
             </div>

          </div>
        </div>
      </section>
      
      {/* ABOUT / CONTACT SECTION */}
      <section id="about" className="py-24 px-6 lg:px-12 bg-black text-white border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-[1.5rem] md:text-3xl font-black uppercase tracking-tight leading-tight mb-6">
              DIGITAL MANAGEMENT BUILT FOR RESTAURANTS.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              Riznex helps UK restaurants manage the digital side of their business from one professional service. We understand that running a restaurant is demanding, which is why we handle your digital operations so you can focus on the food.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 font-medium">
              From delivery platform management and menu optimisation to social media, customer support and detailed business reporting, we are the digital partner for ambitious independent takeaways and restaurants.
            </p>
            <h2 className="text-[1.25rem] md:text-2xl font-black uppercase tracking-tight leading-tight mb-6 mt-12">
              READY TO TAKE CONTROL OF YOUR RESTAURANT'S DIGITAL OPERATION?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
              Let's build a stronger digital presence, improve your operations and give you clearer visibility over your business.
            </p>
          </div>
          
          <div className="lg:w-1/2" id="contact">
            <div className="bg-[#0A0A0A] border border-[#C89B3C]/20 rounded-md p-8 shadow-2xl">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Restaurant Name</label>
                    <input type="text" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C89B3C] transition-colors text-sm rounded-sm" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Your Name</label>
                    <input type="text" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C89B3C] transition-colors text-sm rounded-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Email</label>
                    <input type="email" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C89B3C] transition-colors text-sm rounded-sm" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Phone</label>
                    <input type="tel" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C89B3C] transition-colors text-sm rounded-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Message</label>
                  <textarea rows={4} className="w-full bg-[#111] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C89B3C] transition-colors text-sm rounded-sm"></textarea>
                </div>
                <button type="button" className="w-full py-4 bg-[#C89B3C] text-black font-bold tracking-widest uppercase text-[0.75rem] hover:bg-white transition-all rounded-sm mt-2">
                  CONTACT RIZNEX
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 px-6 lg:px-12 text-white border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">
          
          <div className="flex flex-col items-start w-full lg:w-1/3">
            <Link href="/" className="mb-6 block">
              <img src="/images/new-logo.jpg" alt="Riznex Logo" className="h-14 w-auto mix-blend-screen" />
            </Link>
          </div>
          
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-[#C89B3C] text-[0.6rem] font-bold uppercase tracking-widest mb-1">QUICK LINKS</span>
              <a href="#home" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Home</a>
              <a href="#services" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Services</a>
              <a href="#packages" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Packages</a>
              <a href="#how-it-works" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">How It Works</a>
              <a href="#about" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">About</a>
              <a href="#contact" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Contact</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#C89B3C] text-[0.6rem] font-bold uppercase tracking-widest mb-1">CLIENT AREA</span>
              <Link href="/client-login" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Client Login</Link>
              <Link href="/dashboard" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Dashboard</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#C89B3C] text-[0.6rem] font-bold uppercase tracking-widest mb-1">LEGAL</span>
              <a href="#" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Privacy Policy</a>
              <a href="#" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Terms & Conditions</a>
              <a href="#" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors uppercase tracking-wider font-semibold">Cookie Policy</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#C89B3C] text-[0.6rem] font-bold uppercase tracking-widest mb-1">CONTACT</span>
              <a href="mailto:riznexdigitalsolutions@gmail.com" className="text-[0.65rem] text-gray-400 hover:text-[#C89B3C] transition-colors flex items-center gap-2 font-semibold">riznexdigitalsolutions@gmail.com</a>
              <span className="text-[0.65rem] text-gray-400 flex items-center gap-2 font-semibold">Serving Restaurants Across the UK</span>
            </div>
          </div>
          
        </div>
      </footer>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}