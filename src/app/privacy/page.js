'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information Collection",
      content: "We collect basic user details necessary for providing our flight booking services. This includes personal information such as name, email address, phone number, and travel preferences that you provide when creating an account or making a booking. We also collect technical information about your device and browsing behavior to improve our services."
    },
    {
      title: "Use of Information",
      content: "The information we collect is used primarily for booking management, account administration, and customer support purposes. We use your contact details to send booking confirmations, flight updates, and important service notifications. Your travel preferences help us provide personalized recommendations and improve your overall experience with our platform."
    },
    {
      title: "Data Protection",
      content: "We implement industry-standard security measures to protect your personal information. This includes encryption of sensitive data, secure server infrastructure, and regular security audits. We maintain strict access controls and ensure that only authorized personnel can access your information for legitimate business purposes."
    },
    {
      title: "Third-Party Services",
      content: "Our platform may integrate with trusted third-party services for payment processing, flight information, and other essential functionalities. These partners are carefully selected and required to maintain the same high standards of data protection. We do not sell or share your personal information with third parties for marketing purposes without your explicit consent."
    }
  ];

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
        <div className="max-w-5xl mx-auto">
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
                Privacy Policy
              </h1>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
            </div>

            {/* Last Updated */}
            <div 
              className="bg-blue-600 text-white rounded-2xl shadow-lg"
              style={{ padding: '30px', marginBottom: '60px' }}
            >
              <p className="text-blue-100 text-xl font-medium">
                <strong className="text-white">Last Updated:</strong> January 2026
              </p>
            </div>

            {/* Privacy Sections */}
            <div style={{ marginBottom: '80px' }}>
              {sections.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg border-2 border-gray-200"
                  style={{ 
                    padding: '40px',
                    marginBottom: '40px'
                  }}
                >
                  <h2 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '25px' }}>
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div 
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-indigo-200"
              style={{ 
                padding: '40px',
                marginBottom: '60px'
              }}
            >
              <h2 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '25px' }}>
                Contact Us About Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg" style={{ marginBottom: '35px' }}>
                If you have any questions about this Privacy Policy or how we handle your personal information, 
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row" style={{ gap: '25px' }}>
                <a
                  href="/contact"
                  className="inline-block bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-colors duration-200 text-center shadow-lg"
                  style={{ padding: '20px 40px' }}
                >
                  Contact Us
                </a>
                <a
                  href="mailto:privacy@fujisakuraairways.com"
                  className="inline-block border-3 border-blue-600 text-blue-600 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-colors duration-200 text-center"
                  style={{ padding: '20px 40px', border: '3px solid #2563eb' }}
                >
                  Email Privacy Team
                </a>
              </div>
            </div>

            {/* Commitment Statement */}
            <div className="text-center">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white shadow-2xl"
                style={{ padding: '50px' }}
              >
                <h3 className="text-3xl font-bold" style={{ marginBottom: '25px' }}>
                  Our Commitment
                </h3>
                <p className="text-blue-100 leading-relaxed text-xl max-w-4xl mx-auto">
                  We are committed to maintaining the highest standards of privacy protection and 
                  transparency in all our data handling practices. Your trust is essential to our mission 
                  of providing exceptional travel services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}