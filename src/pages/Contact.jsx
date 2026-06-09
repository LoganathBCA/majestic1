import { useState, useEffect } from 'react';
import { buildWhatsAppUrl, WHATSAPP_DISPLAY, SUPPORT_EMAIL, MAPS_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../constants/contact';

const Contact = () => {
  // State for accordion active FAQ index
  const [activeFaq, setActiveFaq] = useState(null);

  // State for FAQ category filter
  const [activeFaqCategory, setActiveFaqCategory] = useState('all');

  // SEO setup
  useEffect(() => {
    document.title = 'Contact Majestic Sports — Badminton Store Dindigul | WhatsApp Consultation';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Contact Majestic Sports in Dindigul, Tamil Nadu. Reach our expert coaches and certified stringers on WhatsApp (+91 90472 70451) or email for badminton gear advice, racket stringing, and product availability. Store at 5/279, Karur Rd, Dindigul.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://eaf8614e.majestic1.pages.dev/contact');
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  const faqCategories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'consultation', label: 'Consultations' },
    { id: 'authenticity', label: 'Authenticity' },
    { id: 'shipping', label: 'Stringing & Shipping' }
  ];

  const faqData = [
    {
      q: 'How does the WhatsApp consultation model work?',
      a: 'When you click "Buy Now" on a product, it opens a direct WhatsApp chat with our coaches or stringers. We confirm your playstyle, tension preferences, and footwear fit before verifying stock and shipping details.',
      category: 'consultation'
    },
    {
      q: 'Do you verify racket authenticity?',
      a: 'Yes. All rackets, shoes, and bags are 100% genuine products sourced directly from manufacturers. Every frame has verification codes engraved, which we check before shipping.',
      category: 'authenticity'
    },
    {
      q: 'What string tension should I choose?',
      a: 'Beginners typically play with lower tension (20-23 lbs) for power, while advanced players prefer higher tension (24-28 lbs+) for control. Our master stringer will help you select the exact tension during consultation.',
      category: 'consultation'
    },
    {
      q: 'How fast do you dispatch orders?',
      a: 'Stock items ship within 24 hours. Customized stringing requires up to 48 hours for electronic calibration and testing. Express tracking is provided for all dispatches.',
      category: 'shipping'
    },
    {
      q: 'Can I request a custom product not shown in the store?',
      a: 'Yes. If you need a specific model, strings, or custom accessory, chat with us on WhatsApp. We have direct factory accounts with Yonex and Victor to source rare equipment.',
      category: 'consultation'
    }
  ];

  // Filter FAQs based on active category
  const filteredFaqs = faqData.filter(
    (faq) => activeFaqCategory === 'all' || faq.category === activeFaqCategory
  );

  return (
    <div className="contact-page animate-fade-in">
      {/* 1. Hero Header */}
      <section className="contact-page-hero">
        <div className="contact-hero-pattern"></div>
        <div className="container contact-hero-container">
          <span className="hero-tag">Consultation Center</span>
          <h1 className="hero-display">Get In Touch</h1>
          <p className="hero-lead">
            Have a question about string tension, balance points, or shoe fits? Reach out to our advisory team of coaches and certified stringers for expert guidance.
          </p>
        </div>
      </section>

      {/* 2. Direct Channels — centred single column */}
      <section className="contact-details-section section">
        <div className="container">
          <div className="contact-channels-centered">
            <div className="contact-channels-header">
              <span className="section-subtitle">Official Channels</span>
              <h2 className="section-title">Direct Connections</h2>
              <div className="section-divider center"></div>
              <p className="channels-desc">
                Prefer immediate messaging? Reach us on WhatsApp, call us, or send an email directly.
              </p>
            </div>

            <div className="channels-list channels-list-centered">
              {/* WhatsApp Card */}
              <div className="channel-card channel-whatsapp">
                <div className="channel-icon-wrapper wa-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-label">Instant WhatsApp Consultation</span>
                  <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="channel-link">
                    {WHATSAPP_DISPLAY} (Chat Now)
                  </a>
                </div>
              </div>

              {/* Telephone Card */}
              <div className="channel-card channel-standard">
                <div className="channel-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-label">CALL US</span>
                  <span className="channel-value">{WHATSAPP_DISPLAY}</span>
                </div>
              </div>

              {/* Email Card */}
              <div className="channel-card channel-standard">
                <div className="channel-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-label">Inquiry Email</span>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="channel-link">{SUPPORT_EMAIL}</a>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="channel-card channel-standard">
                <div className="channel-icon-wrapper" style={{ color: '#e1306c', backgroundColor: 'rgba(225, 48, 108, 0.05)', border: '1px solid rgba(225, 48, 108, 0.15)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-label">Official Instagram</span>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="channel-link">
                    @{INSTAGRAM_HANDLE}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours + Location row */}
            <div className="contact-info-row">
              {/* Hours Card */}
              <div className="hours-card">
                <h4 className="hours-title">Operational Hours</h4>
                <div className="hours-grid">
                  <div>Mon – Fri &amp; Wednesday</div>
                  <div>6:00 AM — 9:30 PM IST</div>
                  <div>Saturday</div>
                  <div>6:00 AM — 9:00 PM IST</div>
                  <div>Sunday</div>
                  <div>6:00 AM — 12:00 PM IST</div>
                </div>
              </div>

              {/* Showroom Location Card */}
              <div className="showroom-location-card">
                <div className="showroom-header">
                  <span className="showroom-title">Dindigul Store</span>
                  <span className="showroom-tag">HQ</span>
                </div>
                <p className="showroom-address">
                  5/279, Karur Rd, inside Strings Badminton Academy,<br />
                  Hanifa Nagar, Dindigul, Tamil Nadu — 624001
                </p>
                <ul className="showroom-amenities">
                  <li className="showroom-amenity-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Electronic Stringing Station
                  </li>
                  <li className="showroom-amenity-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Racket Demo Play Court Net
                  </li>

                </ul>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showroom-directions-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Get Driving Directions
                </a>
              </div>
            </div>

            {/* WhatsApp CTA Banner */}
            <div className="contact-wa-cta-banner">
              <div className="contact-wa-cta-text">
                <h3 className="contact-wa-cta-title">Ready to consult? Chat with us instantly.</h3>
                <p className="contact-wa-cta-desc">Our team is available Mon–Fri &amp; Wed 6 AM – 9:30 PM, Sat 6 AM – 9 PM, Sun 6 AM – 12 PM IST.</p>
              </div>
              <a
                href={buildWhatsAppUrl('Hi Majestic Sports! I would like to consult about badminton gear.')}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-wa-cta-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Open WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Accordion FAQ Section */}
      <section className="contact-faq-section section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-subtitle">FAQ Desk</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-lead-subtitle">
              Quick answers about our consultation process, strings, tension, and shipping policies.
            </p>
            <div className="section-divider center"></div>
          </div>

          {/* FAQ Category Filter navigation */}
          <ul className="faq-filter-nav">
            {faqCategories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFaqCategory(category.id);
                    setActiveFaq(null);
                  }}
                  className={`faq-filter-btn ${activeFaqCategory === category.id ? 'active' : ''}`}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="faq-accordion-wrapper">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const originalIndex = faqData.findIndex((item) => item.q === faq.q);
                const isOpen = activeFaq === originalIndex;

                return (
                  <div
                    key={originalIndex}
                    className={`faq-item ${isOpen ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(originalIndex)}
                    >
                      <span className="faq-question">{faq.q}</span>
                      <span className="faq-icon-indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    <div className="faq-content">
                      <div className="faq-content-inner">
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
                No FAQs available for this category.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
