
import { UserRound, Users } from 'lucide-react';
import './Members.css';

const executives = [
  { id: 1, name: 'Name Here', position: 'President' },
  { id: 2, name: 'Name Here', position: 'Vice President' },
  { id: 3, name: 'Name Here', position: 'Secretary' },
  { id: 4, name: 'Name Here', position: 'Assistant Secretary' },
  { id: 5, name: 'Name Here', position: 'Financial Secretary' },
  { id: 6, name: 'Name Here', position: 'Treasurer' },
  { id: 7, name: 'Name Here', position: 'Public Relations Officer' },
  { id: 8, name: 'Name Here', position: 'Provost' },
  { id: 9, name: 'Name Here', position: 'Welfare Officer' }
];

function Members() {
  return (
    <section className="members-section" id="members">
      <div className="members-container">

        <div className="members-heading">
          <span>LEADERSHIP AND SERVICE</span>
          <h2>Meet Our CYON Executives</h2>
          <p>
            Meet the dedicated leaders serving and guiding our CYON family.
          </p>
          <div className="members-divider"></div>
        </div>

        <div className="members-grid">
          {executives.map((executive) => (
            <article className="member-card" key={executive.id}>
              <div className="member-image">
                <UserRound size={48} />
              </div>

              <div className="member-info">
                <h3>{executive.name}</h3>
                <p>{executive.position}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="members-footer">
          <Users size={18} />
          <span>Called to lead, united to serve.</span>
        </div>

      </div>
    </section>
  );
}

export default Members;
