import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppUrl } from '../constants/contact';

const About = () => {
  // SEO — set title + meta description for About page
  useEffect(() => {
    document.title = 'About Majestic Sports — Premium Badminton Store | Dindigul, Tamil Nadu';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'About Majestic Sports, Dindigul — Tamil Nadu\'s premier badminton equipment store. Authorized dealer of Yonex, Victor & Li-Ning. Expert coach consultations, certified racket stringing, and 100% authentic gear sourced directly from manufacturers.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://eaf8614e.majestic1.pages.dev/about');
    // Scroll to top when page mounts
    window.scrollTo(0, 0);
  }, []);

  // 1. Precision Process Timeline State
  const [activeProcessStep, setActiveProcessStep] = useState(1);

  const precisionSteps = [
    {
      id: 1,
      title: 'Selective Sourcing',
      subtitle: 'Direct Authorized Curation',
      description: 'We partner directly with Yonex, Li-Ning, and Victor. Every racket frame, shoe line, and accessory is curated by our expert team to guarantee 100% authenticity and elite court performance.',
      metric: 'Authorized Partner',
      value: 'Yonex / Li-Ning / Victor',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Custom Consultation',
      subtitle: 'Style & Ergonomics Matching',
      description: 'Skip the standard shopping cart. Connect with a live certified coach on WhatsApp to analyze your swing speed and select a setup tailored to your playstyle.',
      metric: 'Advisory Channel',
      value: 'Direct Live Coaches',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Precision Stringing',
      subtitle: 'Electronic Calibration',
      description: 'Certified master stringers customize every racket on our Alpha electronic stringing machines, calibrating tension to the exact pound based on your court temperature and playstyle. Our in-store Alpha machine is visible in every stringing consultation — no black boxes.',
      metric: 'Stringing Method',
      value: 'Electronic Calibrated',
      image: '/images/store_stringing_machine.jpg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Laser Integrity Check',
      subtitle: 'Zero-Tolerance Inspection',
      description: 'Every racket frame undergoes alignment tests. Serial numbers are physically laser-verified against manufacturer databases, and accessories are weight-audited.',
      metric: 'Verification Rate',
      value: '100% Quality Audited',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Elite Dispatch',
      subtitle: 'Custom Hard-Box Packaging',
      description: 'Rackets are sensitive instruments. We package them in customized, double-wall cardboard hard boxes with inserts to ensure they arrive in showroom condition.',
      metric: 'Shipping Protection',
      value: 'Double-Wall Hard Box',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      )
    }
  ];

  // 2. Spec & Tension Advisor State
  const [advisorStep, setAdvisorStep] = useState(1);
  const [playstyle, setPlaystyle] = useState(null);
  const [level, setLevel] = useState(null);
  const [climate, setClimate] = useState(null);

  // 3. Customer Reviews data
  const reviews = [
    {
      id: 'r1',
      name: 'sakthi dominator',
      initials: 'SD',
      avatarColor: 'avatar-blue',
      rating: 5,
      date: '6 months ago',
      title: 'Elite Gear Collection & Custom Advice',
      body: 'Majestic Sports is one of the best places for badminton gear. They have an excellent collection of rackets, shoes, bags, and accessories from all major brands. The staff are friendly, knowledgeable, and genuinely help you choose what suits your level and playing style.\n\nTheir stringing service is fast and very professional, and the pricing is fair for the quality they offer. The overall shopping experience is smooth and satisfying.\n\nIf you\'re a badminton enthusiast, Majestic Sports is definitely worth a visit. Highly recommended!'
    },
    {
      id: 'r2',
      name: 'Amirtha',
      initials: 'A',
      avatarColor: 'avatar-dark',
      rating: 5,
      date: '8 months ago',
      title: 'Wonderful Experience & Helpful Staff',
      body: 'I had a wonderful experience at this badminton sports store! The shop is well-stocked with everything a badminton player could need – from high-quality rackets and shuttlecocks to shoes, grips, and accessories. The staff are very knowledgeable and friendly; they helped me choose the perfect racket based on my playing style and even gave useful tips on maintenance. The prices are fair, and the quality of products is excellent.\n\nI\'ll definitely recommend this store to anyone who loves badminton, whether you\'re a beginner or an advanced player. A truly reliable place for all badminton needs!'
    },
    {
      id: 'r3',
      name: 'Muthukumar Sivakumar',
      initials: 'MS',
      avatarColor: 'avatar-accent',
      rating: 5,
      date: '8 months ago',
      title: 'Highly Recommended for All Levels',
      body: 'Excellent store for all badminton lovers! They have a wide range of rackets, shoes, shuttlecocks, and accessories from top brands at reasonable prices. The staff is knowledgeable and friendly; they helped me choose the perfect racket for my playing style. Highly recommended for both beginners and professionals!'
    },
    {
      id: 'r4',
      name: 'Mansur Arif',
      initials: 'MA',
      avatarColor: 'avatar-blue',
      rating: 5,
      date: '8 months ago',
      title: 'Best Sports Shop in Town',
      body: 'One of the best sports shop in town. I\'ve been shopping here for years for badminton and sportswear. They always have the latest collections and seasonal offers. Knowledgeable staff, really knows their products and make shopping easy.. Highly recommended..!'
    },
    {
      id: 'r5',
      name: 'K Kalimuthu',
      initials: 'KK',
      avatarColor: 'avatar-dark',
      rating: 5,
      date: '8 months ago',
      title: 'Great Customer Service',
      body: 'Very good collection and reasonable prices. The staff is friendly and guided me well in selecting the right gear. Definitely one of the best badminton stores around'
    },
    {
      id: 'r6',
      name: 'Vinothkumar R',
      initials: 'VR',
      avatarColor: 'avatar-accent',
      rating: 5,
      date: '8 months ago',
      title: 'Perfect Fitting Shoes & Great Service',
      body: 'I recently purchased a pair of shoes from majestic Sports - Dindigul and I\'m so impressed! The selection was amazing, and the staff were super helpful in finding the perfect fit. The shoes are comfortable, stylish, and exactly what I was looking for. Great customer service and a wonderful shopping experience. Highly recommend!'
    },
    {
      id: 'r7',
      name: 'Raja Nandhu',
      initials: 'RN',
      avatarColor: 'avatar-blue',
      rating: 5,
      date: '7 months ago',
      title: 'Leading Brand Selection',
      body: 'Quality and selection of items: All the essential badminton items - rackets, shuttlecocks, shoes and equipment - are available here from all the leading brands .'
    }
  ];

  // Results calculation
  const getAdvisorRecommendations = () => {
    let frame = '';
    let tension = '';
    let stringModel = '';
    let whyFrame = '';
    let whyString = '';

    // Frame recommendation based on playstyle
    if (playstyle === 'power') {
      frame = 'Head-Heavy & Stiff Frame (e.g., Yonex Astrox 99 Pro / Li-Ning Axforce 80)';
      whyFrame = 'Head-heavy frames concentrate weight in the racket head to deliver maximum whip and momentum for downward smashes, while a stiff shaft ensures maximum energy transfer.';
    } else if (playstyle === 'control') {
      frame = 'Even-Balanced & Medium-Stiff Frame (e.g., Yonex Arcsaber 11 Pro / Victor Thruster Ryuga)';
      whyFrame = 'Even balance offers absolute precision and structural stability, giving you superior control in net-play, fast defensive blocks, and accurate placement.';
    } else {
      frame = 'Head-Light & Aerodynamic Frame (e.g., Yonex Nanoflare 800 Pro / Li-Ning Halbertec 8000)';
      whyFrame = 'Head-light configurations reduce air resistance and swing weight, enabling lightning-fast defensive recovery, speed-oriented flat drives, and supreme agility.';
    }

    // Tension and String model based on level and climate
    if (level === 'beginner') {
      stringModel = 'Yonex BG65 (Max Durability & Soft Feel)';
      whyString = 'For beginners, a highly durable string with soft impact cushioning prevents snapping from off-center hits while providing comfortable repulsion.';
      tension = climate === 'cold' ? '20 - 22 lbs' : '21 - 23 lbs';
    } else if (level === 'intermediate') {
      stringModel = 'Yonex BG80 or Exbolt 65 (Crisp Feel & Repulsion)';
      whyString = 'Intermediate players benefit from high-repulsion strings that boost drive power and depth, balancing speed with placement control.';
      tension = climate === 'cold' ? '23 - 25 lbs' : '24 - 26 lbs';
    } else {
      stringModel = 'Yonex BG80 Power or BG66 Ultimax (Elite Control & Speed)';
      whyString = 'Advanced and competitive players use thin high-performance core strings for optimal shuttle feedback, high pitch impact sounds, and precise net touch.';
      tension = climate === 'cold' ? '26 - 28 lbs' : '27 - 29 lbs';
    }

    return { frame, tension, stringModel, whyFrame, whyString };
  };

  const { frame, tension, stringModel, whyFrame, whyString } = getAdvisorRecommendations();

  // Prefilled WhatsApp message
  const handleAdvisorWhatsApp = () => {
    const playstyleLabel = playstyle === 'power' ? 'Power Smasher' : playstyle === 'control' ? 'Control & Placement' : 'Speed & All-Round';
    const levelLabel = level === 'beginner' ? 'Beginner' : level === 'intermediate' ? 'Intermediate' : 'Advanced/Competitive';
    const climateLabel = climate === 'cold' ? 'Cold/AC Court' : 'Hot/Humid Court';

    const message = `Hi Majestic Sports! I ran your Spec & Tension Advisor and got these details:
- Playstyle: ${playstyleLabel}
- Experience: ${levelLabel}
- Climate: ${climateLabel}

Recommended Spec:
- Frame: ${frame}
- Tension: ${tension}
- String: ${stringModel}

I'd like to consult with a coach about getting a setup matching this configuration!`;

    window.open(buildWhatsAppUrl(message), '_blank');
  };

  const resetAdvisor = () => {
    setPlaystyle(null);
    setLevel(null);
    setClimate(null);
    setAdvisorStep(1);
  };

  return (
    <div className="about-page animate-fade-in">
      {/* 1. Hero Section */}
      <section className="about-hero animate-fade-in">
        <div className="about-hero-pattern"></div>
        <div className="container about-hero-container">
          <span className="hero-tag">Established for Champions</span>
          <h1 className="hero-display">
            Engineered For the Court. <br />
            <span>Curated For Excellence.</span>
          </h1>
          <p className="hero-lead">
            We are players, coaches, and stringers who believe that your gear should be a seamless extension of your ambition. Majestic Sports exists to match you with badminton equipment that unlocks your absolute peak performance.
          </p>
        </div>
      </section>

      {/* 2. Brand Story / Heritage (Asymmetrical Alternating Grid) */}
      <section className="about-story section">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <span className="section-subtitle">Our Journey</span>
              <h2 className="section-title">Born From a Passion For Badminton Excellence</h2>
              <div className="section-divider"></div>
              <p className="body-lg story-lead">
                Majestic Sports was built by badminton players who were frustrated with generic online stores selling unverified gear. We decided to build the store we always wished existed.
              </p>
              <p className="story-desc">
                Our physical showroom stocks an extensive range of tournament-grade rackets, professional shoes, and premium accessories — every piece inspected and verified before it reaches you. We connect buyers with certified coaches on WhatsApp to customize racket tension, grip size, and setup to your exact playstyle and court conditions.
              </p>
            </div>
            <div className="story-visual">
              <div className="story-image-card">
                <img
                  src="/images/store_interior.jpg"
                  alt="Majestic Sports store interior — full rackets and shoe display"
                  className="story-image"
                  loading="lazy"
                />
                <div className="story-image-overlay"></div>
                <div className="story-badge">
                  <span className="story-badge-num">100%</span>
                  <span className="story-badge-txt">Authorized Dealer</span>
                </div>
              </div>
            </div>
          </div>

          <div className="story-grid story-grid-reverse">
            <div className="story-visual">
              <div className="story-image-card">
                <img
                  src="/images/store_rackets_display.jpg"
                  alt="Victor and Li-Ning premium badminton rackets on display"
                  className="story-image"
                  loading="lazy"
                />
                <div className="story-image-overlay"></div>
              </div>
            </div>
            <div className="story-text">
              <span className="section-subtitle">Authenticity First</span>
              <h2 className="section-title">Zero Compromise on Authenticity</h2>
              <div className="section-divider"></div>
              <p className="body-lg story-lead">
                We stock an extensive wall of Victor, Li-Ning, Yonex, and Hundred badminton rackets — each 100% authentic and tournament-grade.
              </p>
              <p className="story-desc">
                As direct authorized partners, we physically inspect every racket frame, laser-verify serial numbers against manufacturer databases, and carefully hand-package each product before dispatch to ensure it arrives in showroom condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Majestic Precision Process Timeline */}
      <section className="about-process-section section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-subtitle">The Pipeline</span>
            <h2 className="section-title">The Majestic Precision Process</h2>
            <p className="section-lead-subtitle">
              How we inspect, customize, verify, and pack your elite gear. Click each stage to see details.
            </p>
            <div className="section-divider center"></div>
          </div>

          {/* Desktop Timeline Navigation */}
          <div className="timeline-desktop">
            <div className="timeline-nav">
              <div className="timeline-track-line"></div>
              <div
                className="timeline-track-progress"
                style={{ width: `${((activeProcessStep - 1) / (precisionSteps.length - 1)) * 100}%` }}
              ></div>
              <ul className="timeline-steps-container">
                {precisionSteps.map((step) => (
                  <li
                    key={step.id}
                    className={`timeline-step-item ${activeProcessStep === step.id ? 'active' : ''} ${step.id < activeProcessStep ? 'completed' : ''}`}
                  >
                    <button
                      className="timeline-step-btn"
                      onClick={() => setActiveProcessStep(step.id)}
                      aria-label={`Go to step ${step.id}: ${step.title}`}
                    >
                      {step.id}
                    </button>
                    <span className="timeline-step-label">{step.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline Content display */}
            <div className="timeline-content-wrapper">
              {precisionSteps.map((step) => {
                if (step.id !== activeProcessStep) return null;
                return (
                  <div key={step.id} className="process-details-card animate-fade-in">
                    <div className="process-card-icon-box">
                      {step.icon}
                    </div>
                    <div className="process-card-info">
                      <span className="process-card-subtitle">{step.subtitle}</span>
                      <h3 className="process-card-title">{step.title}</h3>
                      <p className="process-card-desc">{step.description}</p>
                      {step.image && (
                        <div className="process-card-photo">
                          <img src={step.image} alt={`${step.title} — in store`} loading="lazy" />
                        </div>
                      )}
                    </div>
                    <div className="process-card-metric">
                      <span className="process-metric-title">{step.metric}</span>
                      <div className="process-metric-value">{step.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Accordion Timeline */}
          <div className="timeline-mobile">
            <div className="vertical-timeline-container">
              {precisionSteps.map((step) => {
                const isActive = activeProcessStep === step.id;
                return (
                  <div key={step.id} className={`vertical-timeline-item ${isActive ? 'active' : ''} ${step.id < activeProcessStep ? 'completed' : ''}`}>
                    <div
                      className="vertical-timeline-header"
                      onClick={() => setActiveProcessStep(isActive ? 0 : step.id)}
                    >
                      <button
                        className="vertical-timeline-header-btn"
                        aria-expanded={isActive}
                        aria-label={`${isActive ? 'Collapse' : 'Expand'} step ${step.id}: ${step.title}`}
                        tabIndex="0"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveProcessStep(isActive ? 0 : step.id);
                          }
                        }}
                        style={{ display: 'contents' }}
                      >
                      <div className="vertical-timeline-node">
                        {step.id}
                      </div>
                      <div className="vertical-timeline-title-wrapper">
                        <span className="vertical-timeline-subtitle">{step.subtitle}</span>
                        <h4 className="vertical-timeline-title">{step.title}</h4>
                      </div>
                      <div className="vertical-timeline-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      </button>
                    </div>

                    <div className="vertical-timeline-content-outer">
                      <div className="vertical-timeline-content-inner">
                        <div className="vertical-timeline-icon-box">
                          {step.icon}
                        </div>
                        <p className="vertical-timeline-desc">{step.description}</p>
                        <div className="vertical-timeline-card-metric">
                          <span className="vertical-timeline-metric-title">{step.metric}</span>
                          <div className="vertical-timeline-metric-value">{step.value}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Spec & Tension Advisor */}
      <section className="about-advisor-section section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-subtitle">Diagnostic Tool</span>
            <h2 className="section-title">Spec & Tension Advisor</h2>
            <p className="section-lead-subtitle">
              Answer 3 brief questions to receive coach-recommended racket frame specifications, string models, and tension ratings tailored to your conditions.
            </p>
            <div className="section-divider center"></div>
          </div>

          <div className="advisor-widget-card">
            <div className="advisor-widget-header">
              <span className="advisor-widget-title">Setup Diagnostics</span>
              <span className="advisor-step-indicator">
                {advisorStep === 'result' ? 'Completed' : `Step ${advisorStep} of 3`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="advisor-progress-container">
              <div
                className="advisor-progress-bar"
                style={{
                  width: advisorStep === 'result' ? '100%' : `${((advisorStep - 1) / 3) * 100}%`
                }}
              ></div>
            </div>

            {/* Step 1: Playstyle */}
            {advisorStep === 1 && (
              <div className="advisor-step-container animate-fade-in">
                <h3 className="advisor-question-title">1. Select Your Primary Playstyle</h3>
                <div className="advisor-options-grid">
                  <button
                    className={`advisor-option-btn ${playstyle === 'power' ? 'selected' : ''}`}
                    onClick={() => {
                      setPlaystyle('power');
                      setAdvisorStep(2);
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        </svg>
                      </div>
                      {playstyle === 'power' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Power Smasher</span>
                    <p className="option-desc">Heavy offensive play, smash frequency, back-court baseline dominance.</p>
                  </button>

                  <button
                    className={`advisor-option-btn ${playstyle === 'control' ? 'selected' : ''}`}
                    onClick={() => {
                      setPlaystyle('control');
                      setAdvisorStep(2);
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="6" />
                          <circle cx="12" cy="12" r="2" />
                        </svg>
                      </div>
                      {playstyle === 'control' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Control & Net-Play</span>
                    <p className="option-desc">Deceptive net drops, placements, driving control, defensive redirecting.</p>
                  </button>

                  <button
                    className={`advisor-option-btn ${playstyle === 'speed' ? 'selected' : ''}`}
                    onClick={() => {
                      setPlaystyle('speed');
                      setAdvisorStep(2);
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      </div>
                      {playstyle === 'speed' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Speed & All-Round</span>
                    <p className="option-desc">Fast-paced double flat drives, quick defensive recovery, balanced agility.</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Experience Level */}
            {advisorStep === 2 && (
              <div className="advisor-step-container animate-fade-in">
                <h3 className="advisor-question-title">2. Select Your Current Experience Level</h3>
                <div className="advisor-options-grid">
                  <button
                    className={`advisor-option-btn ${level === 'beginner' ? 'selected' : ''}`}
                    onClick={() => {
                      setLevel('beginner');
                      setAdvisorStep(3);
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20V10" />
                          <path d="M12 20V4" />
                          <path d="M6 20v-6" />
                        </svg>
                      </div>
                      {level === 'beginner' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Beginner</span>
                    <p className="option-desc">Focusing on basic contact consistency, fundamental footwork, and general form.</p>
                  </button>

                  <button
                    className={`advisor-option-btn ${level === 'intermediate' ? 'selected' : ''}`}
                    onClick={() => {
                      setLevel('intermediate');
                      setAdvisorStep(3);
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20V6" />
                          <path d="M12 20V10" />
                          <path d="M6 20v-4" />
                        </svg>
                      </div>
                      {level === 'intermediate' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Intermediate</span>
                    <p className="option-desc">Developing power control, reliable clears, backhand drives, playing club matches regularly.</p>
                  </button>

                  <button
                    className={`advisor-option-btn ${level === 'advanced' ? 'selected' : ''}`}
                    onClick={() => {
                      setLevel('advanced');
                      setAdvisorStep(3);
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20V4" />
                          <path d="M12 20V8" />
                          <path d="M6 20v-8" />
                        </svg>
                      </div>
                      {level === 'advanced' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Advanced / Competitive</span>
                    <p className="option-desc">Playing tournament level, training frequently, possessing advanced mechanical smash power.</p>
                  </button>
                </div>
                <div className="advisor-nav-actions">
                  <button className="advisor-btn-back" onClick={() => setAdvisorStep(1)}>
                    ← Playstyle
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Climate */}
            {advisorStep === 3 && (
              <div className="advisor-step-container animate-fade-in">
                <h3 className="advisor-question-title">3. What climate do you play in?</h3>
                <div className="advisor-options-grid">
                  <button
                    className={`advisor-option-btn ${climate === 'cold' ? 'selected' : ''}`}
                    onClick={() => {
                      setClimate('cold');
                      setAdvisorStep('result');
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      {climate === 'cold' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Cold / Air-Conditioned</span>
                    <p className="option-desc">Indoor AC halls, colder seasons (strings expand less, higher risk of popping; requires slightly lower tension).</p>
                  </button>

                  <button
                    className={`advisor-option-btn ${climate === 'hot' ? 'selected' : ''}`}
                    onClick={() => {
                      setClimate('hot');
                      setAdvisorStep('result');
                    }}
                  >
                    <div className="option-header-row">
                      <div className="option-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2" />
                          <path d="M12 20v2" />
                          <path d="M4.22 4.22l1.42 1.42" />
                          <path d="M18.36 18.36l1.42 1.42" />
                          <path d="M2 12h2" />
                          <path d="M20 12h2" />
                          <path d="M5.64 18.36l-1.42 1.42" />
                          <path d="M19.78 5.64l-1.42 1.42" />
                        </svg>
                      </div>
                      {climate === 'hot' && (
                        <span className="option-select-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="option-title">Hot / Humid / Standard</span>
                    <p className="option-desc">Standard non-AC sports clubs, warm tropical climates (strings relax quicker; requires slightly higher tension).</p>
                  </button>
                </div>
                <div className="advisor-nav-actions">
                  <button className="advisor-btn-back" onClick={() => setAdvisorStep(2)}>
                    ← Experience Level
                  </button>
                </div>
              </div>
            )}

            {/* Results Screen */}
            {advisorStep === 'result' && (
              <div className="advisor-results-panel">
                <div className="advisor-results-left">
                  <div className="advisor-blueprint-card">
                    <div className="blueprint-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span>Custom Tuning Spec Sheet</span>
                    </div>
                    <div className="blueprint-body">
                      <div className="blueprint-row">
                        <span className="blueprint-label">Frame Configuration</span>
                        <div className="blueprint-value">{playstyle === 'power' ? 'Stiff / Head-Heavy' : playstyle === 'control' ? 'Even-Balance' : 'Aero-Speed / Head-Light'}</div>
                      </div>
                      <div className="blueprint-row">
                        <span className="blueprint-label">Recommended Tension</span>
                        <div className="blueprint-value value-highlight">{tension}</div>
                      </div>
                      <div className="blueprint-row">
                        <span className="blueprint-label">Suggested String bed</span>
                        <div className="blueprint-value">{stringModel}</div>
                      </div>
                      <div className="blueprint-row">
                        <span className="blueprint-label">Climate Profile</span>
                        <div className="blueprint-value">{climate === 'cold' ? 'AC Hall / Low Thermal Expand' : 'Standard / Tropical High Humid'}</div>
                      </div>
                    </div>
                    <div className="blueprint-footer">
                      <span className="blueprint-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        100% Calibrated Match
                      </span>
                    </div>
                  </div>
                </div>

                <div className="advisor-results-right">
                  <div className="results-explanation-card">
                    <h4 className="explanation-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                      </svg>
                      Frame Spec Rationale
                    </h4>
                    <p className="explanation-desc">{whyFrame}</p>
                  </div>

                  <div className="results-explanation-card">
                    <h4 className="explanation-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                      </svg>
                      Tension & Stringing Rationale
                    </h4>
                    <p className="explanation-desc">{whyString}</p>
                  </div>

                  <div className="advisor-results-cta">
                    <button className="advisor-wa-btn glow-pulse" onClick={handleAdvisorWhatsApp}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      Consult Spec on WhatsApp
                    </button>
                    <button className="advisor-reset-btn" onClick={resetAdvisor}>
                      Reset Diagnostics
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Philosophy Pillars */}
      <section className="about-pillars-section section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-subtitle">The Pillars</span>
            <h2 className="section-title">The Majestic Experience</h2>
            <div className="section-divider center"></div>
          </div>
          <div className="pillars-cards-grid">
            <div className="pillar-card">
              <div className="pillar-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h3 className="pillar-card-title">Elite Curation</h3>
              <p className="pillar-card-desc">
                We don\'t sell everything—only the equipment that proves itself under professional tournament conditions. Every racket, shoe, and string line is carefully audited.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="pillar-card-title">Human Advising</h3>
              <p className="pillar-card-desc">
                No automated bots. You chat directly with active coaches and certified stringers who recommend rackets and string tension based on your playstyle.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className="pillar-card-title">Secure Delivery</h3>
              <p className="pillar-card-desc">
                Your rackets are valuable. We pack them in high-density customized hard boxes so they arrive at your door in immaculate, ready-to-play condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6b. Store Gallery Section */}
      <section className="about-store-gallery section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-subtitle">Visit Our Store</span>
            <h2 className="section-title">Inside Majestic Sports</h2>
            <p className="section-lead-subtitle">
              Walk through our premium showroom — from a wall of tournament rackets to our professional Alpha stringing station and an extensive footwear collection.
            </p>
            <div className="section-divider center"></div>
          </div>

          <div className="store-gallery-grid">
            {/* Large featured image */}
            <div className="gallery-item gallery-item-featured">
              <img
                src="/images/store_interior.jpg"
                alt="Majestic Sports store — full interior view with Yonex bags, rackets, and clothing"
                loading="lazy"
              />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">Our Showroom</span>
              </div>
            </div>

            {/* Rackets */}
            <div className="gallery-item">
              <img
                src="/images/store_rackets_display.jpg"
                alt="Victor and Li-Ning badminton rackets wall display"
                loading="lazy"
              />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">Racket Collection</span>
              </div>
            </div>

            {/* Stringing machine */}
            <div className="gallery-item">
              <img
                src="/images/store_stringing_machine.jpg"
                alt="Alpha professional electronic stringing machine"
                loading="lazy"
              />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">Pro Stringing Station</span>
              </div>
            </div>

            {/* Shoes wall */}
            <div className="gallery-item">
              <img
                src="/images/store_shoes_wall.jpg"
                alt="Premium badminton shoes — Victor, Yonex, Li-Ning, Hundred"
                loading="lazy"
              />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">Footwear Wall</span>
              </div>
            </div>

            {/* Shoes display 2 */}
            <div className="gallery-item">
              <img
                src="/images/store_shoes_display.jpg"
                alt="Majestic Sports shoe display — Play Hard, Stay Majestic"
                loading="lazy"
              />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">Full Footwear Range</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews */}
      <section className="about-reviews-section section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-subtitle">What Our Players Say</span>
            <h2 className="section-title">Customer Reviews</h2>
            <p className="section-lead-subtitle">
              Real experiences from badminton players who trusted Majestic Sports for their gear.
            </p>
            <div className="section-divider center"></div>
          </div>

          {/* Stars summary row */}
          <div className="reviews-summary-row">
            <div className="reviews-summary-score">
              <span className="reviews-big-score">5.0</span>
              <div className="reviews-stars-row">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#f5a623" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="reviews-count-label">Based on verified purchases</span>
            </div>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-card-header">
                  <div className={`review-avatar ${review.avatarColor}`}>{review.initials}</div>
                  <div className="review-meta">
                    <span className="review-name">{review.name}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-stars">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i <= review.rating ? '#f5a623' : 'none'} stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <h4 className="review-title">{review.title}</h4>
                <p className="review-body">{review.body}</p>
                <div className="review-verified-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                  </svg>
                  Verified Purchase
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 8. Call to Action (CTA Block) */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-container">
            <div className="about-cta-grid">
              <div className="about-cta-content">
                <h2 className="cta-title">Ready to Elevate Your Game?</h2>
                <p className="cta-desc">
                  Explore our premium showcase catalog, or click below to start a consultation directly with one of our advisory board coaches on WhatsApp.
                </p>
                <div className="cta-btn-group">
                  <Link to="/shop" className="btn btn-primary cta-btn">
                    Browse Gear
                  </Link>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary cta-btn-wa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    Chat With Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
