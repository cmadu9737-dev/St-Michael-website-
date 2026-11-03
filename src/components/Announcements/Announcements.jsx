
import {
  Megaphone,
  CalendarDays,
  Clock,
  MapPin
} from 'lucide-react';

import './Announcements.css';

const announcements = [
  {
    title: 'Youth Mass',
    date: 'Saturday, November 21, 2026',
    time: 'Third Saturday of the month',
    description:
      'All CYON members are encouraged to come together for our monthly Youth Mass. Let us gather in prayer and celebrate our faith.',
    category: 'Worship'
  },
  {
    title: 'Youth Clean-Up Exercise',
    date: 'Saturday, November 21, 2026',
    time: 'Third Saturday of the month',
    description:
      'All CYON members are encouraged to participate in cleaning and keeping our church environment neat and welcoming.',
    category: 'Community Service'
  },
  {
    title: 'Youth Meeting',
    date: 'Sunday, November 29, 2026',
    time: 'Last Sunday of the month',
    description:
      'All CYON members are invited to attend our monthly youth meeting. Come and participate in discussions, planning, and fellowship.',
    category: 'Meeting'
  }
];

function Announcements() {
  return (
    <section className="announcements-section" id="announcements">
      <div className="announcements-container">

        <div className="announcements-heading">
          <span>STAY INFORMED</span>
          <h2>Announcements</h2>
          <p>
            Important updates and notices from our St. Michael CYON family.
          </p>
          <div className="announcements-divider"></div>
        </div>

        <div className="announcements-grid">
          {announcements.map((announcement) => (
            <article className="announcement-card" key={announcement.title}>

              <div className="announcement-card-top">
                <span className="announcement-category">
                  {announcement.category}
                </span>
                <Megaphone size={20} />
              </div>

              <h3>{announcement.title}</h3>

              <div className="announcement-details">
                <div>
                  <CalendarDays size={16} />
                  <span>{announcement.date}</span>
                </div>

                <div>
                  <Clock size={16} />
                  <span>{announcement.time}</span>
                </div>

                <div>
                  <MapPin size={16} />
                  <span>St. Michael Catholic Church, Akwakuma</span>
                </div>
              </div>

              <p>{announcement.description}</p>

              <span className="announcement-reminder">
                Please be informed and participate.
              </span>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Announcements;
