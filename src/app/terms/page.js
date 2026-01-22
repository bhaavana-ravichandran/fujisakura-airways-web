'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TermsPage() {
  const sections = [
    {
      title: "Platform Usage",
      content: "By accessing and using the Fujisakura Airways platform, you agree to comply with these terms and conditions. Our platform is designed to provide flight booking services and related travel information. Users must be at least 18 years old or have parental consent to use our services. You are responsible for maintaining the confidentiality of your account credentials."
    },
    {
      title: "Booking Responsibilities",
      content: "When making a booking through our platform, you are entering into a contract for travel services. You must provide accurate and complete information for all passengers. It is your responsibility to ensure that all travel documents, including passports and visas, are valid and up-to-date. You must arrive at the airport with sufficient time before departure as recommended by the airline."
    },
    {
      title: "Payments & Refunds",
      content: "All payments must be made through our secure payment system using valid payment methods. Prices are subject to change until payment is confirmed. Refund policies vary depending on the fare type and airline terms. Cancellation and modification fees may apply as per the specific airline's policies. We will process refunds according to the original payment method within the timeframe specified by applicable regulations."
    },
    {
      title: "User Responsibilities",
      content: "Users must not misuse our platform or attempt to gain unauthorized access to our systems. You are prohibited from using our services for any illegal activities or in violation of any applicable laws. Users must not interfere with the proper functioning of our website or services. Any fraudulent activity or misrepresentation may result in immediate account suspension."
    },
    {
      title: "Service Availability",
      content: "While we strive to maintain continuous service availability, we cannot guarantee uninterrupted access to our platform. Scheduled maintenance, technical issues, or external factors may temporarily affect service availability. We reserve the right to modify, suspend, or discontinue any aspect of our services with appropriate notice to users."
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
                Terms of Service
              </h1>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Please read our terms and conditions carefully before using our services.
              </p>
            </div>

            {/* Last Updated */}
            <div 
              className="bg-amber-600 text-white rounded-2xl shadow-lg"
              style={{ padding: '30px', marginBottom: '60px' }}
            >
              <p className="text-amber-100 text-xl font-medium">
                <strong className="text-white">Last Updated:</strong> January 2026 | <strong className="text-white">Effective Date:</strong> January 2026
              </p>
            </div>

            {/* Terms Sections */}
            <div style={{ marginBottom: '80px' }}>
              {sections.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-2xl shadow-lg border-2 border-gray-200"
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

            {/* Important Notice */}
            <div 
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg border-2 border-red-200"
              style={{ 
                padding: '40px',
                marginBottom: '60px'
              }}
            >
              <h2 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '25px' }}>
                Important Notice
              </h2>
              <div 
                className="bg-red-600 text-white rounded-2xl shadow-lg"
                style={{ padding: '25px', marginBottom: '25px' }}
              >
                <p className="text-red-100 text-lg font-semibold">
                  Terms are subject to updates as services evolve.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg" style={{ marginBottom: '20px' }}>
                We may update these terms from time to time to reflect changes in our services, 
                legal requirements, or business practices. We will notify users of significant 
                changes through email or prominent notices on our platform.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Continued use of our services after any modifications constitutes acceptance 
                of the updated terms.
              </p>
            </div>

            {/* Contact and Legal */}
            <div 
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg border-2 border-indigo-200"
              style={{ 
                padding: '40px',
                marginBottom: '60px'
              }}
            >
              <h2 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '25px' }}>
                Questions About Terms
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg" style={{ marginBottom: '35px' }}>
                If you have any questions about these Terms of Service or need clarification 
                on any provisions, please contact our legal team.
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
                  href="mailto:legal@fujisakuraairways.com"
                  className="inline-block text-blue-600 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-colors duration-200 text-center"
                  style={{ padding: '20px 40px', border: '3px solid #2563eb' }}
                >
                  Email Legal Team
                </a>
              </div>
            </div>

            {/* Acceptance Statement */}
            <div className="text-center">
              <div 
                className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl text-white shadow-2xl"
                style={{ padding: '50px' }}
              >
                <h3 className="text-3xl font-bold" style={{ marginBottom: '25px' }}>
                  Agreement
                </h3>
                <p className="text-green-100 leading-relaxed text-xl max-w-4xl mx-auto">
                  By using Fujisakura Airways services, you acknowledge that you have read, 
                  understood, and agree to be bound by these Terms of Service and our Privacy Policy.
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