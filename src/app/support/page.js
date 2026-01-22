'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const supportCategories = [
    {
      title: "Booking Assistance",
      description: "Find answers and assistance related to flight bookings and reservations.",
      icon: "✈️"
    },
    {
      title: "Payment & Billing",
      description: "Get help with payment methods, billing issues, and transaction queries.",
      icon: "💳"
    },
    {
      title: "Cancellations & Refunds",
      description: "Learn about our cancellation policies and refund procedures.",
      icon: "🔄"
    },
    {
      title: "Account & Login Support",
      description: "Resolve account access issues and manage your profile settings.",
      icon: "👤"
    }
  ];

  const faqs = [
    {
      question: "How do I book a flight?",
      answer: "You can book a flight by visiting our Flights page, selecting your departure and arrival cities, choosing your preferred dates, and following the booking process through passenger details and payment."
    },
    {
      question: "Can I modify or cancel my booking?",
      answer: "Yes, you can view and manage your bookings through the 'My Bookings' section. Cancellation policies may vary depending on the fare type and timing of your request."
    },
    {
      question: "Is online payment secure?",
      answer: "Absolutely. We use industry-standard encryption and secure payment gateways to protect your financial information during transactions."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team through the Contact page, email us at support@fujisakuraairways.com, or call our helpline during business hours."
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
                Support Center
              </h1>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We're here to help you with any questions or concerns about your travel experience.
              </p>
            </div>

            {/* Support Categories */}
            <div style={{ marginBottom: '80px' }}>
              <h2 className="text-4xl font-bold text-gray-900 text-center" style={{ marginBottom: '50px' }}>
                How can we help you?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '30px' }}>
                {supportCategories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100"
                    style={{ padding: '30px' }}
                  >
                    <div className="text-5xl text-center" style={{ marginBottom: '20px' }}>
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 text-center" style={{ marginBottom: '15px' }}>
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed text-center">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div style={{ marginBottom: '80px' }}>
              <h2 className="text-4xl font-bold text-gray-900 text-center" style={{ marginBottom: '50px' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <button
                      className="w-full text-left flex justify-between items-center hover:bg-white/70 transition-colors duration-200"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      style={{ padding: '25px 30px' }}
                    >
                      <span className="font-bold text-gray-900 text-xl">{faq.question}</span>
                      <span className="text-blue-600 text-3xl font-bold" style={{ marginLeft: '20px' }}>
                        {expandedFaq === index ? '−' : '+'}
                      </span>
                    </button>
                    {expandedFaq === index && (
                      <div className="bg-white/80" style={{ padding: '0 30px 25px 30px' }}>
                        <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center">
              <div 
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-2xl"
                style={{ padding: '50px' }}
              >
                <h3 className="text-3xl font-bold" style={{ marginBottom: '20px' }}>
                  Still need help?
                </h3>
                <p className="text-blue-100 text-xl leading-relaxed max-w-lg mx-auto" style={{ marginBottom: '35px' }}>
                  Our support team is ready to assist you with any questions.
                </p>
                <a
                  href="/contact"
                  className="inline-block bg-white text-blue-600 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-colors duration-200 shadow-lg"
                  style={{ padding: '20px 40px' }}
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}