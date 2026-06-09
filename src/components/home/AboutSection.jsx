import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container about-container">
        <div className="about-grid">
          {/* Text Column (Left) */}
          <div className="about-content">
            <span className="section-subtitle">Our Heritage</span>
            <h2 className="section-title">Engineered For Champions</h2>
            <div className="section-divider"></div>
            
            <p className="body-lg about-lead">
              At Majestic Sports, we curate elite badminton gear from Yonex, Li-Ning, and Victor — directly from authorized distributors — for players who demand nothing but the best from their equipment.
            </p>
            
            <p className="about-description">
              We are more than a store. Every order comes with a direct WhatsApp consultation from our certified coaches and master stringers who custom-tune your racket tension, grip size, and shoe fit to your exact playstyle and court conditions.
            </p>
            
            <ul className="about-pillars">
              <li className="about-pillar-item">
                <div className="pillar-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <div>
                  <h3 className="pillar-title">Curated Elite Gear</h3>
                  <p className="pillar-desc">100% authentic products from Yonex, Victor & Li-Ning — tournament-tested and verified.</p>
                </div>
              </li>
              
              <li className="about-pillar-item">
                <div className="pillar-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="pillar-title">Direct Expert Advice</h3>
                  <p className="pillar-desc">Skip the cart — chat live with certified coaches who tailor your gear selection.</p>
                </div>
              </li>

              <li className="about-pillar-item">
                <div className="pillar-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="pillar-title">Electronic Precision Stringing</h3>
                  <p className="pillar-desc">Pro stringing on calibrated Alpha machines — custom tension to the exact pound.</p>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: 'var(--space-md)' }}>
              <Link to="/about" className="btn btn-outline" style={{ textTransform: 'uppercase' }}>
                Read Our Story
              </Link>
            </div>
          </div>
          
          {/* Image Column (Right) */}
          <div className="about-image-wrapper">
            <div className="about-image-card">
              <img
                src="/images/store_interior.jpg"
                alt="Majestic Sports store — Yonex, Victor, Li-Ning rackets and shoes on display"
                className="about-image"
                loading="lazy"
                width="600"
                height="600"
                decoding="async"
              />
              <div className="about-image-overlay"></div>
              <div className="about-experience-badge">
                <span className="badge-number">100%</span>
                <span className="badge-label">Authentic Gear</span>
              </div>
            </div>

            {/* Mini photo strip below the main image */}
            <div className="about-photo-strip">
              <div className="about-photo-thumb">
                <img
                  src="/images/store_rackets_display.jpg"
                  alt="Victor & Li-Ning racket display"
                  loading="lazy"
                />
                <span className="photo-thumb-label">Rackets</span>
              </div>
              <div className="about-photo-thumb">
                <img
                  src="/images/store_shoes_wall.jpg"
                  alt="Premium badminton shoes wall"
                  loading="lazy"
                />
                <span className="photo-thumb-label">Footwear</span>
              </div>
              <div className="about-photo-thumb">
                <img
                  src="/images/store_stringing_machine.jpg"
                  alt="Alpha professional stringing machine"
                  loading="lazy"
                />
                <span className="photo-thumb-label">Stringing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
