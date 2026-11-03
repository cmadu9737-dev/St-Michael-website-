
import { ArrowRight } from 'lucide-react';
import './Subgroups.css';

import aloysiusImage from '../../assets/aloy.png';
import johnBoscoImage from '../../assets/john.png';
import charlesLwangaImage from '../../assets/Charles.png';

const subgroups = [
  {
    name: 'Saint Aloysius Gonzaga',
    period: 'September – December',
    image: aloysiusImage,
    description:
      'A community of young Catholics growing together in faith, love, and service.'
  },
  {
    name: 'Saint John Bosco',
    period: 'January – April',
    image: johnBoscoImage,
    description:
      'Building friendships, strengthening our faith, and supporting one another.'
  },
  {
    name: 'Saint Charles Lwanga',
    period: 'May – August',
    image: charlesLwangaImage,
    description:
      'Inspired by courage and devotion, we serve God and our community.'
  }
];

function Subgroups() {
  return (
    <section className="subgroups-section" id="subgroups">
      <div className="subgroups-container">

        <div className="subgroups-heading">
          <span className="subgroups-eyebrow">OUR CYON FAMILY</span>
          <h2>United in Faith, One in Family</h2>
          <p>
            Get to know the three subgroups that make up our
            St. Michael CYON family.
          </p>
          <div className="heading-divider"></div>
        </div>

        <div className="subgroups-grid">
          {subgroups.map((group, index) => (
            <article className="subgroup-card" key={group.name}>
              <div className="subgroup-image">
                <img src={group.image} alt={group.name} />

                <span className="subgroup-number">
                  0{index + 1}
                </span>
              </div>

              <div className="subgroup-card-content">
                <span className="subgroup-period">
                  {group.period}
                </span>

                <h3>{group.name}</h3>

                <p>{group.description}</p>

                <a href="#contact" className="subgroup-link">
                  Learn More
                  <ArrowRight size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Subgroups;
