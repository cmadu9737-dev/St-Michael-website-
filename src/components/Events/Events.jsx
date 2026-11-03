
import {
  CalendarDays,
  Clock
} from 'lucide-react';

import './Events.css';

import harvestImage from '../../assets/harvest.png';
import aloysiusImage from '../../assets/aloybirth.png';
import endOfYearImage from '../../assets/endoftheyear.png';

import youthWeekImage from '../../assets/youthweek.png';
import patronsAwardImage from '../../assets/patron.png';
import culturalFiestaImage from '../../assets/culture.png';

const upcomingEvents = [
  {
    title: 'Youth and Children Harvest',
    date: 'Sunday, November 8, 2026',
    description:
      'A special thanksgiving celebration as our youth and children come together to appreciate God’s blessings.',
    category: 'Thanksgiving',
    image: harvestImage
  },
  {
    title: 'St. Aloysius Gonzaga Group Birthday',
    date: 'Sunday, November 15, 2026',
    description:
      'Celebrating the birthday of our St. Aloysius Gonzaga subgroup with joy, fellowship, and gratitude.',
    category: 'Group Celebration',
    image: aloysiusImage
  },
  {
    title: 'CYON Amakohia End-of-Year Celebration',
    date: 'Saturday, December 12, 2026',
    description:
      'A special end-of-year gathering to celebrate our achievements, strengthen our bond, and give thanks to God.',
    category: 'End-of-Year',
    image: endOfYearImage
  }
];

const pastEvents = [
  {
    title: 'Youth Week',
    description:
      'A week of spiritual growth, activities, fellowship, and renewed commitment to our Catholic faith.',
    category: 'Spiritual Programme',
    image: youthWeekImage
  },
  {
    title: 'Patrons Award Day',
    description:
      'A special occasion to appreciate and recognize the support, dedication, and contributions of our patrons.',
    category: 'Awards',
    image: patronsAwardImage
  },
  {
    title: 'Youth Cultural Fiesta',
    description:
      'A celebration of our culture, traditions, talents, and unity as young Catholics.',
    category: 'Cultural Celebration',
    image: culturalFiestaImage
  }
];

function EventCard({ event, past = false }) {
  return (
    <article className="event-card">
      <div className="event-card-image">
        <img src={event.image} alt={event.title} />
        <span className={`event-status ${past ? 'past' : 'recent'}`}>
          {past ? 'Past Event' : 'Upcoming'}
        </span>
      </div>

      <div className="event-card-content">
        <span className="event-category">{event.category}</span>

        <h3>{event.title}</h3>

        {!past && (
          <div className="event-meta">
            <CalendarDays size={14} />
            <span>{event.date}</span>
          </div>
        )}

        <p className="event-description">{event.description}</p>

        {!past && (
          <div className="event-upcoming-note">
            <Clock size={13} />
            <span>Coming up</span>
          </div>
        )}
      </div>
    </article>
  );
}

function Events() {
  return (
    <section className="events-section" id="events">
      <div className="events-container">

        <div className="events-heading">
          <span>FAITH • FELLOWSHIP • SERVICE</span>
          <h2>Events & Activities</h2>
          <p>
            Stay connected with upcoming celebrations and
            memorable moments in our CYON family.
          </p>
          <div className="events-divider"></div>
        </div>

        <div className="event-group">
          <div className="event-group-heading">
            <div>
              <span>MARK YOUR CALENDAR</span>
              <h3>Upcoming Events</h3>
            </div>
            <span className="event-count">03 Events</span>
          </div>

          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
        </div>

        <div className="event-group past-event-group">
          <div className="event-group-heading">
            <div>
              <span>OUR MEMORIES</span>
              <h3>Past Events</h3>
            </div>
            <span className="event-count">03 Activities</span>
          </div>

          <div className="events-grid">
            {pastEvents.map((event) => (
              <EventCard key={event.title} event={event} past />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Events;
