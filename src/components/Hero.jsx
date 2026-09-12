import { useState, useEffect, useRef } from 'react';
import config from '../config/lahoriTikka.config';
import { ChevronLeft, ChevronRight, ArrowRight, Flame } from 'lucide-react';

export default function Hero() {
  // Configured banners with specified images for the slides
  const banners = [
    {
      title: "Crispy Outside. Juicy Inside.",
      subtitle: "Char-grilled over live coals for that signature smoky desi flavor. Serving authentic Lahori karahi, platters, and BBQ right in F-8 Markaz & Park View City.",
      // Slide 1: Chicken wings hero photo
      image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1400&q=80",
      ctaText: "Explore Live Menu",
      ctaLink: "#menu"
    },
    {
      title: "Aap Layein, Ham Pakayein",
      subtitle: "Bring your own raw meat or marinades, and let our master Tandoor chefs grill it to perfection with our secret Lahori spices.",
      // Slide 2: Raw lamb rack photo
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80",
      ctaText: "Reserve a Table",
      ctaLink: "#reservation"
    },
    {
      title: "Free Delivery in F, G & E Sectors",
      subtitle: "Enjoy hot and fresh meals delivered straight to your doorstep within 30 minutes across all Islamabad F, G, and E sectors.",
      // Slide 3: Reusing chicken wings photo (Note: Replace with dedicated delivery photo later)
      image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1400&q=80",
      ctaText: "Order Now",
      ctaLink: "#menu"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext(); // Swipe left
    }
    if (touchEndX.current - touchStartX.current > 50) {
      handlePrev(); // Swipe right
    }
  };

  const currentBanner = banners[currentIndex];

  return (
    <>
      <style>{`
        @keyframes kenBurnsZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        .hero-bg-zoom {
          animation: kenBurnsZoom 5s ease-out infinite alternate;
        }
        @keyframes progressLine {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .carousel-progress-bar {
          animation: progressLine 5s linear infinite;
        }
      `}</style>

      <section 
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#000'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full-Bleed Banner Wrapper */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }} className="hero-fullscreen-wrapper">
          
          {/* Background Image with Ken Burns Effect */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            overflow: 'hidden',
            zIndex: 1
          }}>
            <img 
              key={currentIndex}
              src={currentBanner.image} 
              alt={currentBanner.title}
              className="hero-bg-zoom"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Dark Gradient Overlay for Text Readability */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.2) 100%)',
              zIndex: 2
            }} />
          </div>

          {/* Foreground Content Container */}
          <div style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(200, 16, 46, 0.85)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              width: 'fit-content',
              backdropFilter: 'blur(4px)'
            }}>
              <Flame size={14} color="#FFD700" /> Original Taste Since {config.since}
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              margin: 0,
              maxWidth: '650px',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}>
              {currentBanner.title}
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: '#e2e8f0',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '560px',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)'
            }}>
              {currentBanner.subtitle}
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
              <a href={currentBanner.ctaLink || '#menu'} className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                <span>{currentBanner.ctaText}</span>
                <ArrowRight size={16} />
              </a>
              <a href="#reservation" className="btn-accent" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                Reserve Table
              </a>
            </div>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
              width: '46px', height: '46px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#ffffff',
              transition: 'background 0.2s ease'
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            style={{
              position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
              width: '46px', height: '46px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: '#ffffff',
              transition: 'background 0.2s ease'
            }}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Indicators & Progress Bar Container */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '0', right: '0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: currentIndex === idx ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    backgroundColor: currentIndex === idx ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Thin Animated Progress Bar Underline */}
            <div style={{ width: '120px', height: '3px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
              <div key={currentIndex} className="carousel-progress-bar" style={{ height: '100%', backgroundColor: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Responsive media query override for mobile height */}
      <style>{`
        @media (max-width: 768px) {
          .hero-fullscreen-wrapper {
            height: 380px !important;
          }
        }
      `}</style>
    </>
  );
}