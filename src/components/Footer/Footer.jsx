
import {
  MapPin,
  ArrowUp,
  Globe,
  MessageCircle
} from 'lucide-react';

import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-container">

        <div className="footer-main">

          <div className="footer-about">
            <h2>ST. MICHAEL <span>CYON</span></h2>

            <p className="footer-location-name">
              Catholic Youth Organization of Nigeria
            </p>

            <p>
              St. Michael Catholic Church, Akwakuma,
              Owerri, Imo State.
            </p>

            <div className="footer-contact">
              <div>
                <MapPin size={16} />
                <span>Akwakuma, Owerri, Imo State</span>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#subgroups">Our Subgroups</a>
            <a href="#events">Events & Activities</a>
            <a href="#announcements">Announcements</a>
            <a href="#members">CYON Executives</a>
            <a href="#birthdays">Upcoming Birthdays</a>
          </div>

          <div className="footer-connect">
            <h3>Stay Connected</h3>

            <p>
              Be part of our family as we grow in faith,
              fellowship, and service.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="Website">
                <Globe size={18} />
              </a>

              <a href="#" aria-label="Contact">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} St. Michael Catholic Church CYON,
            Akwakuma. All rights reserved.
          </p>

          <a href="#home" className="back-to-top">
            Back to top <ArrowUp size={15} />
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
