
import { Cake, CalendarDays, Gift } from 'lucide-react';
import './Birthdays.css';

const birthdays = [
  { id: 1, name: 'Member Name', date: 'January 12' },
  { id: 2, name: 'Member Name', date: 'February 08' },
  { id: 3, name: 'Member Name', date: 'March 21' },
  { id: 4, name: 'Member Name', date: 'April 15' },
  { id: 5, name: 'Member Name', date: 'May 09' },
  { id: 6, name: 'Member Name', date: 'June 18' }
];

function Birthdays() {
  return (
    <section className="birthdays-section" id="birthdays">
      <div className="birthdays-container">

        <div className="birthdays-heading">
          <span>CELEBRATING LIFE AND GOD'S BLESSINGS</span>
          <h2>Upcoming Birthdays</h2>
          <p>
            Join us in celebrating our CYON family members as they mark
            another year of God's goodness.
          </p>
          <div className="birthdays-divider"></div>
        </div>

        <div className="birthdays-grid">
          {birthdays.map((person) => (
            <article className="birthday-card" key={person.id}>
              <div className="birthday-icon">
                <Cake size={28} />
              </div>

              <div className="birthday-info">
                <h3>{person.name}</h3>
                <div className="birthday-date">
                  <CalendarDays size={15} />
                  <span>{person.date}</span>
                </div>
              </div>

              <Gift className="birthday-gift" size={20} />
            </article>
          ))}
        </div>

        <div className="birthday-message">
          <Cake size={19} />
          <p>
            Happy birthday to all our celebrants! May God bless you
            with many more fruitful years.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Birthdays;
