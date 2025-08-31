import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Hyperspeed, hyperspeedPresets, EduGlow, EduText } from '../blocks/Backgrounds/Hyperspeed';
import CountUp from '../blocks/TextAnimations/CountUp/CountUp';
import developersAPI from '../api/developers.js';


const HomePage = ({ 
  onExploreClick, 
  onHomeClick, 
  onResourcesClick, 
  onAboutClick, 
  onDashboardClick,
  onAdminLogin,
  onProfileClick,
  onLogoutClick, 
  isLoggedIn = false, 
  user = null 
}) => {
  const [admin, setAdmin] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);

  // Fetch admin details on component mount
  useEffect(() => {
    fetchAdminDetails();
  }, []);

  // Function to fetch admin details (can be called to refresh data)
  const fetchAdminDetails = async () => {
    try {
      setAdminLoading(true);
      const response = await developersAPI.getAdmin();
      if (response.success && response.data) {
        setAdmin(response.data);
      } else {
        // Handle case when no admin data is available
        setAdmin(null);
      }
    } catch (error) {
      console.error('Failed to fetch admin details:', error);
      setAdminError('Failed to load admin details');
    } finally {
      setAdminLoading(false);
    }
  };
  const navigateToLabs = () => {
    onExploreClick && onExploreClick();
  };
  
  const navigateToResources = () => {
    onResourcesClick && onResourcesClick();
  };
  
  const navigateToAbout = () => {
    onAboutClick && onAboutClick();
  };

  const handleAdminLogin = () => {
    onAdminLogin && onAdminLogin();
  };

  // Function to validate and get image data URL
  const getImageDataUrl = (base64Data) => {
    if (!base64Data) return null;
    
    // Try different image formats
    const formats = ['jpeg', 'png', 'gif', 'webp'];
    
    for (const format of formats) {
      try {
        const dataUrl = `data:image/${format};base64,${base64Data}`;
        return dataUrl;
      } catch {
        continue;
      }
    }
    
    return null;
  };

  // Function to validate base64 data
  const isValidBase64 = (str) => {
    try {
      // Check if it's a valid base64 string
      const decoded = atob(str);
      return decoded.length > 0;
    } catch {
      return false;
    }
  };
  



  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effect - Full Page */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <div className="w-full h-full relative">
          <Hyperspeed effectOptions={hyperspeedPresets.akira} />
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {/* Navbar */}
        <Navbar 
          onHomeClick={onHomeClick} 
          onLabsClick={navigateToLabs}
          onResourcesClick={navigateToResources}
          onAboutClick={navigateToAbout}
          onDashboardClick={onDashboardClick}
          onAdminLogin={handleAdminLogin}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
          isLoggedIn={isLoggedIn}
          user={user}
          theme="education" 
        />

        {/* Hero Section */}
        <section className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[85vh]">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full lg:w-1/2 px-4 ml-auto mr-auto text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white mb-7 font-heading">
                  <EduGlow className="text-white">
                    CS Lab Portal
                  </EduGlow>
                  <EduText className="block text-2xl font-normal text-primary-400 mt-2 font-sans">
                    Web Technology & Advanced Computer Networks
                  </EduText>
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-white to-primary-500 rounded-full mb-8 mx-auto lg:mx-0"></div>
                <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed font-sans">
                  Master advanced networking concepts and web technologies through hands-on virtual labs and cutting-edge experiments.
                </p>
                
              
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <button
                    onClick={navigateToLabs}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-primary-600 to-indigo-600 text-white font-semibold rounded-lg text-lg hover:from-blue-700 hover:via-primary-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/40 font-sans flex items-center gap-3 border border-blue-500/30 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="relative z-10">Enter Labs</span>
                  </button>
                  <button
                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border-2 border-emerald-400/40 text-white font-semibold rounded-lg text-lg hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-400/60 transition-all duration-300 font-sans flex items-center gap-3 overflow-hidden shadow-lg hover:shadow-emerald-500/20"
                    onClick={navigateToResources}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="relative z-10">View Resources</span>
                  </button>
                </div>
              </div>
              <div className="hidden lg:block w-full lg:w-1/2 px-4 mt-12 lg:mt-0">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-white rounded-xl blur opacity-75"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Network visualization"
                    className="relative rounded-xl border border-primary-500/30 shadow-2xl animate-edu-float"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 font-heading">
            <EduGlow>Lab Features</EduGlow>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Advanced Network Simulation Tools',
                description: 'Experience cutting-edge network simulation with real-time packet analysis and topology visualization.',
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Real-time Collaborative Coding Environment',
                description: 'Code together with peers in our live collaboration platform with instant feedback and version control.',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                title: 'Virtual Machine Clusters',
                description: 'Deploy and manage virtual machine clusters with automated scaling and resource optimization.',
                icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
                color: 'from-purple-500 to-indigo-500'
              },
              {
                title: 'Cloud Infrastructure Integration',
                description: 'Seamlessly integrate with major cloud providers for hybrid and multi-cloud deployments.',
                icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10',
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'Secure Testing Environments',
                description: 'Test applications in isolated, secure environments with comprehensive security monitoring.',
                icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                color: 'from-green-500 to-emerald-600'
              },
              {
                title: 'Performance Analysis Tools',
                description: 'Monitor and analyze application performance with advanced metrics and visualization tools.',
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                color: 'from-pink-500 to-rose-500'
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden border border-white/20 rounded-xl p-6 backdrop-blur-lg bg-gradient-to-br from-slate-900/40 to-slate-800/40 hover:from-slate-800/50 hover:to-slate-700/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Icon with enhanced styling */}
                <div className="relative z-10 h-14 w-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <svg className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon} />
                  </svg>
                </div>

                {/* Title with enhanced typography */}
                <h3 className="relative z-10 text-xl font-bold text-white mb-3 font-heading group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description with better contrast */}
                <p className="relative z-10 text-gray-300 font-sans leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Subtle bottom accent */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            ))}
          </div>
        </section>
          
        {/* Tech Stats Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-heading">
              <EduGlow>Platform Statistics</EduGlow>
            </h2>
            <p className="text-xl text-gray-300 font-sans max-w-3xl mx-auto">
              Real-time metrics showcasing our growing community and technological capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: 150,
                suffix: '+',
                label: 'Lab Experiments',
                description: 'Interactive modules',
                icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'bg-emerald-500/10'
              },
              {
                value: 500,
                suffix: '+',
                label: 'Projects',
                description: 'Achievements',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                color: 'from-purple-500 to-indigo-500',
                bgColor: 'bg-purple-500/10'
              },
              {
                value: 50,
                suffix: '+',
                label: 'Technologies',
                description: 'Tools & frameworks',
                icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
                color: 'from-orange-500 to-red-500',
                bgColor: 'bg-orange-500/10'
              },
              {
                value: 24,
                suffix: '/7',
                label: 'Support',
                description: 'Always available',
                icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                color: 'from-pink-500 to-rose-500',
                bgColor: 'bg-pink-500/10'
              }
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden border border-white/20 rounded-2xl p-8 backdrop-blur-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 hover:from-slate-800/60 hover:to-slate-700/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Icon container */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl ${stat.bgColor} flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-all duration-300 mx-auto`}>
                  <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={stat.icon} />
                  </svg>
                </div>

                {/* Stat value */}
                <div className="relative z-10 text-center mb-4">
                  <h3 className="text-4xl sm:text-5xl font-bold text-white mb-1 font-heading flex items-center justify-center">
                    <CountUp
                      to={stat.value}
                      from={0}
                      duration={2.5}
                      className="text-4xl sm:text-5xl font-bold text-white"
                    />
                    <span className="ml-2 text-2xl sm:text-3xl">{stat.suffix}</span>
                  </h3>
                  <p className="text-lg font-semibold text-white font-heading mb-1">{stat.label}</p>
                  <p className="text-sm text-gray-300 font-sans">{stat.description}</p>
                </div>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Profiles Section */}
        <section id="developer-section" className="py-24 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-900/60 backdrop-blur-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white font-heading">
                <EduGlow>Meet the Creator</EduGlow>
              </h2>
              <p className="text-xl text-gray-300 font-sans max-w-3xl mx-auto leading-relaxed">
                The visionary behind this innovative CS Lab Portal, dedicated to revolutionizing computer science education
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-emerald-400 rounded-full mx-auto mt-8"></div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                {adminLoading ? (
                  <div className="group relative overflow-hidden border border-white/20 rounded-3xl p-8 backdrop-blur-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50">
                    <div className="animate-pulse">
                      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                        <div className="w-32 h-32 bg-primary-500/20 rounded-full"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-8 bg-primary-500/20 rounded w-3/4"></div>
                          <div className="h-4 bg-primary-500/20 rounded w-1/2"></div>
                          <div className="h-4 bg-primary-500/20 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="mt-8 space-y-3">
                        <div className="h-4 bg-primary-500/20 rounded"></div>
                        <div className="h-4 bg-primary-500/20 rounded w-5/6"></div>
                        <div className="h-4 bg-primary-500/20 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                ) : adminError ? (
                  <div className="group relative overflow-hidden border border-red-500/30 rounded-3xl p-8 backdrop-blur-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-heading">Unable to Load Profile</h3>
                    <p className="text-red-400 font-sans">{adminError}</p>
                  </div>
                ) : admin ? (
                  <div className="group relative overflow-hidden border border-white/20 rounded-3xl p-8 backdrop-blur-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 hover:from-slate-800/60 hover:to-slate-700/60 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                    <div className="relative z-10">
                      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8">
                        {/* Enhanced Profile Image */}
                        <div className="flex-shrink-0 relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <div className="relative w-40 h-40 rounded-full border-4 border-white/20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                            {admin.profile_image_url ? (
                              <img
                                src={admin.profile_image_url}
                                alt={`${admin.name || 'Admin'} ${admin.last_name || ''}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center">
                                      <span class="text-4xl font-bold text-purple-300">
                                        ${(admin && admin.name && admin.name.charAt(0).toUpperCase()) || "?"}
                                      </span>
                                    </div>
                                  `;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl font-bold text-purple-300">
                                  {(admin && admin.name && admin.name.charAt(0).toUpperCase()) || "?"}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Status indicator */}
                          <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-4 border-slate-900 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>

                        {/* Enhanced Admin Details */}
                        <div className="flex-1 text-center lg:text-left">
                          <div className="mb-6">
                            <h3 className="text-3xl font-bold text-white mb-2 font-heading">
                              {admin.name || 'Admin'} {admin.last_name || ''}
                            </h3>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4">
                              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm font-semibold font-sans border border-purple-400/30">
                                {admin.role || 'Lead Developer'}
                              </span>
                              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-full text-sm font-semibold font-sans border border-emerald-400/30">
                                Full Stack Developer
                              </span>
                              <span className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 rounded-full text-sm font-semibold font-sans border border-orange-400/30">
                                UI/UX Designer
                              </span>
                            </div>
                            <p className="text-gray-300 mb-2 font-sans flex items-center justify-center lg:justify-start gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {admin.email || 'admin@example.com'}
                            </p>
                            <p className="text-gray-400 text-sm font-sans flex items-center justify-center lg:justify-start gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Developer since {admin.created_at ? new Date(admin.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Unknown date'}
                            </p>

                            {/* Social Links */}
                            <div className="flex justify-center lg:justify-start gap-4 mt-4">
                              <a
                                href="https://github.com/MaheshRaj77"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-600/50 hover:border-slate-500/50"
                              >
                                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span className="text-sm font-medium text-gray-300">GitHub</span>
                              </a>

                              <a
                                href="https://www.linkedin.com/in/mahesh-dev77/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-600/50 hover:border-slate-500/50"
                              >
                                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span className="text-sm font-medium text-gray-300">LinkedIn</span>
                              </a>
                            </div>
                          </div>

                          {/* Skills/Expertise */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-white mb-3 font-heading">Expertise</h4>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                              {[
                                { name: 'React', color: 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-400/30' },
                                { name: 'Node.js', color: 'from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30' },
                                { name: 'Python', color: 'from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/30' },
                                { name: 'MongoDB', color: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-400/30' },
                                { name: 'Express.js', color: 'from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-400/30' },
                                { name: 'UI/UX Design', color: 'from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-400/30' }
                              ].map((skill) => (
                                <span key={skill.name} className={`px-3 py-1 bg-gradient-to-r ${skill.color} rounded-lg text-sm font-sans border hover:scale-105 transition-all duration-300`}>
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Description */}
                      <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center mt-1">
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2 font-heading">About the Creator</h4>
                            <p className="text-gray-300 leading-relaxed font-sans">
                              As the lead developer of this CS Lab Portal, I created this comprehensive platform
                              to provide students with hands-on experience in web technologies and advanced networking concepts.
                              The portal features interactive labs, real-time collaboration tools, and cutting-edge educational resources
                              designed to bridge the gap between theoretical knowledge and practical application.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                ) : (
                  <div className="group relative overflow-hidden border border-white/20 rounded-3xl p-8 backdrop-blur-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 text-center">
                    <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-heading">Creator Profile</h3>
                    <p className="text-gray-400 mb-6 font-sans max-w-md mx-auto">
                      The developer profile is currently being configured. This innovative platform was built to revolutionize computer science education.
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-gray-500 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Profile Setup</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Platform Active</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Footer Component */}
        <Footer
          onHomeClick={onHomeClick}
          onExploreClick={onExploreClick}
          onResourcesClick={onResourcesClick}
          onDashboardClick={onDashboardClick}
          onAdminLogin={onAdminLogin}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}

export default HomePage;
