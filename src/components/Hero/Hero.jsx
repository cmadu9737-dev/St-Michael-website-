
import { ArrowRight, CalendarDays } from 'lucide-react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-overlay">
        <div className="hero-content">
          <span className="hero-label">
            ST. MICHAEL CATHOLIC CHURCH • CYON
          </span>

          <h1>
            Faith. Fellowship.
            <span> Service.</span>
          </h1>

          <div className="hero-divider"></div>

          <p className="hero-welcome">
            Welcome to the official website of St. Michael Catholic
            Youth Organization, Akwakuma, Owerri.
          </p>

          <p className="hero-description">
            Growing together in faith, building lasting friendships,
            and serving God and humanity with love.
          </p>

          <div className="hero-buttons">
            <a href="#subgroups" className="hero-primary-button">
              Explore Our Subgroups
              <ArrowRight size={19} />
            </a>

            <a href="#events" className="hero-secondary-button">
              <CalendarDays size={19} />
              View Upcoming Events
            </a>
          </div>

          <div className="hero-location">
            Akwakuma, Owerri – Imo State, Nigeria
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
