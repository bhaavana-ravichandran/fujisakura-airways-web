'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setFormData({ fullName: '', email: '', message: '' });
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)',
        minHeight: '100vh'
      }}
    >
      <Header />
      
      <main className="flex-1 relative z-10" style={{ 
        minHeight: 'calc(100vh - 140px)', 
        paddingTop: '180px',
        paddingBottom: '80px',
        paddingLeft: '60px',
        paddingRight: '60px'
      }}>
        <div className="max-w-6xl mx-auto">
          {/* Main Content Card - Much more visible */}
          <div 
            className="bg-white rounded-3xl shadow-2xl border-4 border-gray-300"
            style={{ 
              padding: '60px 50px',
              marginBottom: '80px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Header Section */}
            <div className="text-center" style={{ marginBottom: '80px' }}>
              <h1 className="text-6xl font-bold text-gray-900" style={{ marginBottom: '30px' }}>
                Contact Us
              </h1>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Get in touch with our team. We're here to help with any questions or concerns.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '60px' }}>
              {/* Contact Information */}
              <div 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl border-2 border-blue-100"
                style={{ padding: '40px' }}
              >
                <h2 className="text-4xl font-bold text-gray-900" style={{ marginBottom: '40px' }}>
                  Contact Details
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div className="flex items-start" style={{ gap: '25px' }}>
                    <div className="bg-blue-600 rounded-2xl shadow-lg" style={{ padding: '15px' }}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl" style={{ marginBottom: '8px' }}>
                        Email
                      </h3>
                      <p className="text-gray-700 text-lg">support@fujisakuraairways.com</p>
                    </div>
                  </div>

                  <div className="flex items-start" style={{ gap: '25px' }}>
                    <div className="bg-green-600 rounded-2xl shadow-lg" style={{ padding: '15px' }}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl" style={{ marginBottom: '8px' }}>
                        Phone
                      </h3>
                      <p className="text-gray-700 text-lg">+91 90000 00000</p>
                    </div>
                  </div>

                  <div className="flex items-start" style={{ gap: '25px' }}>
                    <div className="bg-purple-600 rounded-2xl shadow-lg" style={{ padding: '15px' }}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl" style={{ marginBottom: '8px' }}>
                        Working Hours
                      </h3>
                      <p className="text-gray-700 text-lg">Monday – Friday</p>
                      <p className="text-gray-700 text-lg">9:00 AM to 6:00 PM IST</p>
                    </div>
                  </div>
                </div>

                {/* Quick Response Info */}
                <div 
                  className="bg-blue-600 rounded-2xl text-white shadow-lg"
                  style={{ padding: '25px', marginTop: '40px' }}
                >
                  <h4 className="font-bold text-white text-xl" style={{ marginBottom: '12px' }}>
                    Quick Response
                  </h4>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div 
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl border-2 border-gray-200"
                style={{ padding: '40px' }}
              >
                <h2 className="text-4xl font-bold text-gray-900" style={{ marginBottom: '40px' }}>
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div>
                    <label htmlFor="fullName" className="block text-lg font-bold text-gray-700" style={{ marginBottom: '12px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white shadow-sm text-lg"
                      placeholder="Enter your full name"
                      style={{ padding: '18px 20px' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-lg font-bold text-gray-700" style={{ marginBottom: '12px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white shadow-sm text-lg"
                      placeholder="Enter your email address"
                      style={{ padding: '18px 20px' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-lg font-bold text-gray-700" style={{ marginBottom: '12px' }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none bg-white shadow-sm text-lg"
                      placeholder="How can we help you?"
                      style={{ padding: '18px 20px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-colors duration-200 shadow-xl"
                    style={{ padding: '20px' }}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification - Perfectly Centered */}
      {showToast && (
        <div 
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border-4 border-green-300"
            style={{ 
              padding: '60px 50px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              animation: 'slideIn 0.4s ease-out',
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              transform: 'translate(0, 0)'
            }}
          >
            <div className="text-center">
              <div 
                className="bg-green-100 rounded-full flex items-center justify-center border-4 border-green-300 mx-auto"
                style={{ 
                  width: '80px',
                  height: '80px',
                  marginBottom: '30px'
                }}
              >
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="font-bold text-gray-900 text-4xl" style={{ marginBottom: '20px' }}>
                Message Sent Successfully!
              </h3>
              
              <p className="text-gray-600 text-xl leading-relaxed max-w-md mx-auto" style={{ marginBottom: '40px' }}>
                Thank you for reaching out. Our support team will contact you shortly.
              </p>
              
              <button
                onClick={() => setShowToast(false)}
                className="bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
                style={{ padding: '18px 50px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}