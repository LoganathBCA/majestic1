import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import StoreGallery from '../components/home/StoreGallery';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';

const Home = () => {
  // SEO — set title + meta description for Home page
  useEffect(() => {
    document.title = 'Majestic Sports — Premium Badminton Equipment | Dindigul, Tamil Nadu';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Majestic Sports, Dindigul — Shop 100% genuine badminton rackets, professional court shoes, bags, shuttlecocks and accessories from Yonex, Victor & Li-Ning. Expert WhatsApp consultation and certified racket stringing. Authorized dealer serving Tamil Nadu.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://eaf8614e.majestic1.pages.dev/');
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <FeaturedProducts />
      <StoreGallery />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Home;
