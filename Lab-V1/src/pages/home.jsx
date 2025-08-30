import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { Hyperspeed, hyperspeedPresets, EduGlow, EduText } from '../blocks/Backgrounds/Hyperspeed';
import CountUp from '../blocks/TextAnimations/CountUp/CountUp';
import developersAPI from '../api/developers.js';


const HomePage = ({ 
  onExploreClick, 
  onHomeClick, 
  onLabsClick, 
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
    const fetchAdminDetails = async () => {
      try {
        setAdminLoading(true);
        const response = await developersAPI.getAdmin();
        if (response.success && response.data) {
          setAdmin(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin details:', error);
        setAdminError('Failed to load admin details');
      } finally {
        setAdminLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);
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
      } catch (error) {
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
    } catch (error) {
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
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white mb-7">
                  <EduGlow className="text-white">
                    CS Lab Portal
                  </EduGlow>
                  <EduText className="block text-2xl font-normal text-blue-400 mt-2">
                    Web Technology & Advanced Computer Networks
                  </EduText>
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-white to-blue-500 rounded-full mb-8 mx-auto lg:mx-0"></div>
                <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
                  Master advanced networking concepts and web technologies through hands-on virtual labs and cutting-edge experiments.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <button 
                    onClick={navigateToLabs}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/50 animate-edu-pulse"
                  >
                    Enter Labs
                  </button>
                  <button 
                    className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-lg text-lg hover:bg-white/10 transition-all"
                    onClick={navigateToResources}
                  >
                    View Resources
                  </button>
                </div>
              </div>
              <div className="hidden lg:block w-full lg:w-1/2 px-4 mt-12 lg:mt-0">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-white rounded-xl blur opacity-75"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Network visualization"
                    className="relative rounded-xl border border-blue-500/30 shadow-2xl animate-edu-float"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            <EduGlow>Lab Features</EduGlow>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              'Advanced Network Simulation Tools',
              'Real-time Collaborative Coding Environment',
              'Virtual Machine Clusters',
              'Cloud Infrastructure Integration',
              'Secure Testing Environments',
              'Performance Analysis Tools',
            ].map((feature) => (
              <div
                key={feature}
                className="border border-blue-500/30 rounded-lg p-6 backdrop-blur-md bg-slate-900/20 hover:border-white/30 transition-all"
              >
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <div className="h-6 w-6 rounded-full bg-blue-500 animate-edu-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature}</h3>
                <p className="text-blue-400">
                  Experience cutting-edge technology with our state-of-the-art laboratory facilities.
                </p>
              </div>
            ))}
          </div>
        </section>
          
        {/* Tech Stats Section */}
        <section className="py-16 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              {[
                { value: 200, suffix: '+', label: 'Network Labs' },
                { value: 50, suffix: '+', label: 'Web Projects' },
                { value: 24, suffix: '/7', label: 'Access' },
                { value: 1000, suffix: '+', label: 'Students' }
              ].map((stat, idx) => (
                <div key={idx} className="w-full md:w-3/12 px-4 text-center mb-8">
                  <div className="border border-blue-500/30 rounded-lg p-6 backdrop-blur-md bg-slate-900/20 hover:border-white/30 transition-all">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex justify-center items-baseline">
                      <CountUp 
                        to={stat.value}
                        from={0}
                        duration={2.5}
                        className="text-3xl sm:text-4xl font-bold text-white"
                      />
                      <span className="ml-1">{stat.suffix}</span>
                    </h2>
                    <p className="text-blue-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Profiles Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900/30 to-slate-900/70 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-16">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-bold mb-6 text-white">
                  <EduText>Meet the Developer</EduText>
                </h2>
                <p className="text-lg leading-relaxed text-gray-200">
                  The mind behind this lab portal and its experiments
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-2xl px-4 mb-8">
                {adminLoading ? (
                  <div className="border border-blue-500/30 rounded-lg p-8 backdrop-blur-md bg-slate-900/20 hover:border-white/30 transition-all text-center">
                    <div className="animate-pulse">
                      <div className="h-6 bg-blue-500/20 rounded w-3/4 mx-auto mb-4"></div>
                      <div className="h-4 bg-blue-500/20 rounded w-1/2 mx-auto mb-2"></div>
                      <div className="h-4 bg-blue-500/20 rounded w-2/3 mx-auto"></div>
                    </div>
                  </div>
                ) : adminError ? (
                  <div className="border border-red-500/30 rounded-lg p-8 backdrop-blur-md bg-slate-900/20 text-center">
                    <p className="text-red-400">{adminError}</p>
                  </div>
                ) : admin ? (
                  <div className="border border-blue-500/30 rounded-lg p-8 backdrop-blur-md bg-slate-900/20 hover:border-white/30 transition-all">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {admin.profile_image && isValidBase64(admin.profile_image) ? (
                          <img
                            src={getImageDataUrl(admin.profile_image)}
                            alt={`${admin.name} ${admin.lastName || ''}`}
                            className="w-24 h-24 rounded-full border-2 border-blue-500/50 object-cover"
                            onError={(e) => {
                              console.log('Image failed to load, trying different formats');
                              // Try different formats if current one fails
                              const currentSrc = e.target.src;
                              if (currentSrc.includes('jpeg')) {
                                e.target.src = currentSrc.replace('jpeg', 'png');
                              } else if (currentSrc.includes('png')) {
                                e.target.src = currentSrc.replace('png', 'gif');
                              } else if (currentSrc.includes('gif')) {
                                e.target.src = currentSrc.replace('gif', 'webp');
                              } else {
                                // If all formats fail, hide the image
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        {/* Fallback avatar - always show */}
                        <div className="w-24 h-24 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-400">
                            {admin.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Admin Details */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {admin.name} {admin.lastName || ''}
                        </h3>
                        <p className="text-blue-400 mb-2">{admin.role}</p>
                        <p className="text-gray-300 mb-3">{admin.email}</p>
                        <p className="text-sm text-gray-400">
                          Developer since {new Date(admin.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6 pt-6 border-t border-blue-500/20">
                      <p className="text-gray-300 leading-relaxed">
                        As the lead developer of this CS Lab Portal, I created this comprehensive platform
                        to provide students with hands-on experience in web technologies and advanced networking concepts.
                        The portal features interactive labs, real-time collaboration tools, and cutting-edge educational resources.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-blue-500/30 rounded-lg p-8 backdrop-blur-md bg-slate-900/20 text-center">
                    <p className="text-gray-400">Admin details not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-slate-900/50 backdrop-blur-sm pt-8 pb-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap text-center lg:text-left">
              <div className="w-full lg:w-6/12 px-4">
                <h4 className="text-3xl font-semibold text-white">
                  Let's stay connected
                </h4>
                <h5 className="text-lg mt-0 mb-2 text-gray-200">
                  Find us on any of these platforms.
                </h5>
                <div className="mt-6 mb-8 flex justify-center lg:justify-start gap-4">
                  <button className="bg-white text-slate-900 shadow-lg h-10 w-10 flex items-center justify-center align-center rounded-full outline-none focus:outline-none hover:bg-blue-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                  <button className="bg-white text-slate-900 shadow-lg h-10 w-10 flex items-center justify-center align-center rounded-full outline-none focus:outline-none hover:bg-blue-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="bg-white text-slate-900 shadow-lg h-10 w-10 flex items-center justify-center align-center rounded-full outline-none focus:outline-none hover:bg-blue-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="flex flex-wrap items-top mb-6">
                  <div className="w-full lg:w-4/12 px-4 ml-auto mb-8 lg:mb-0">
                    <span className="block uppercase text-blue-400 text-sm font-semibold mb-3">Resources</span>
                    <ul className="list-unstyled">
                      <li>
                        <a className="text-gray-300 hover:text-blue-400 font-semibold block pb-2 text-sm" href="#">Documentation</a>
                      </li>
                      <li>
                        <a className="text-gray-300 hover:text-blue-400 font-semibold block pb-2 text-sm" href="#">Tutorials</a>
                      </li>
                      <li>
                        <a className="text-gray-300 hover:text-blue-400 font-semibold block pb-2 text-sm" href="#">API References</a>
                      </li>
                      <li>
                        <button 
                          // onClick={onRegisterClick}
                          className="text-gray-300 hover:text-blue-400 font-semibold block pb-2 text-sm text-left"
                        >
                          Register Account
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <span className="block uppercase text-blue-400 text-sm font-semibold mb-3">Support</span>
                    <ul className="list-unstyled">
                      <li>
                        <a className="text-gray-300 hover:text-blue-400 font-semibold block pb-2 text-sm" href="#">Help Center</a>
                      </li>
                      <li>
                        <a className="text-gray-300 hover:text-blue-400 font-semibold block pb-2 text-sm" href="#">Community</a>
                      </li>
                      <li>
                        <a className="text-gray-300 hover:text-blue-400 font-semibold block pb-2 text-sm" href="#">Contact Us</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-blue-800/30" />
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                <div className="text-sm text-gray-400 font-semibold py-1">
                  Copyright © {new Date().getFullYear()} CS Lab Portal. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
