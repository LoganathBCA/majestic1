import React from 'react';
import { Link } from 'react-router-dom';

const StoreGallery = () => {
  const photos = [
    {
      id: 'sg1',
      src: '/images/store_interior.jpg',
      alt: 'Majestic Sports store — full interior with Yonex bags, rackets & apparel',
      label: 'Our Showroom',
      wide: true,
    },
    {
      id: 'sg2',
      src: '/images/store_rackets_display.jpg',
      alt: 'Victor & Li-Ning badminton rackets wall display',
      label: 'Racket Collection',
      wide: false,
    },
    {
      id: 'sg3',
      src: '/images/store_stringing_machine.jpg',
      alt: 'Alpha professional electronic stringing machine',
      label: 'Pro Stringing Station',
      wide: false,
    },
    {
      id: 'sg4',
      src: '/images/store_shoes_wall.jpg',
      alt: 'Premium badminton shoes — Victor, Yonex, Li-Ning, Hundred',
      label: 'Footwear Wall',
      wide: false,
    },
    {
      id: 'sg5',
      src: '/images/store_shoes_display.jpg',
      alt: 'Majestic Sports shoe display — Play Hard, Stay Majestic',
      label: 'Full Footwear Range',
      wide: false,
    },
  ];

  return (
    <section className="home-store-gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Visit Our Store</span>
          <h2 className="section-title">Inside Majestic Sports</h2>
          <div className="section-divider" style={{ margin: '12px auto 0' }}></div>
        </div>

        <p className="home-gallery-lead">
          Step inside our showroom — stocked with an extensive wall of tournament rackets from Yonex, Victor & Li-Ning, 
          a professional Alpha stringing station, and a full footwear collection.
        </p>

        <div className="home-gallery-mosaic">
          {/* Wide featured card */}
          <div className="home-gallery-card home-gallery-card--wide">
            <img
              src={photos[0].src}
              alt={photos[0].alt}
              loading="lazy"
            />
            <div className="home-gallery-card-overlay">
              <span className="home-gallery-card-label">{photos[0].label}</span>
            </div>
          </div>

          {/* Right column — 4 equal cards */}
          <div className="home-gallery-right-col">
            {photos.slice(1).map((photo) => (
              <div className="home-gallery-card" key={photo.id}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                />
                <div className="home-gallery-card-overlay">
                  <span className="home-gallery-card-label">{photo.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip below gallery */}
        <div className="home-gallery-cta-strip">
          <div className="home-gallery-cta-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Our physical store is open — visit us for a hands-on consultation with our coaches</span>
          </div>
          <Link to="/about" className="btn btn-outline home-gallery-cta-btn">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StoreGallery;
