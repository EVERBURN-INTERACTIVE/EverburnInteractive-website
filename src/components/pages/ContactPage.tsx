import { CONTACT_AUDIENCES, CONTACT_CONTENT, CONTACT_FOLLOW_NOTE, CONTACT_INTRO } from '@/lib/content';

import { SharedInternalLayout } from './SharedInternalLayout';

export function ContactPage() {
  return (
    <SharedInternalLayout title="CONTACT US">
      <section className="notice-board">
        <h2>Get in Touch</h2>
        <p>{CONTACT_INTRO}</p>
        <p>We welcome conversations with:</p>
        <ul>
          {CONTACT_AUDIENCES.map((audience) => (
            <li key={audience}>{audience}</li>
          ))}
        </ul>
      </section>

      <section className="notice-board">
        <h2>Contact Information</h2>
        <p>
          <strong>Company:</strong> {CONTACT_CONTENT.company}
        </p>
        <p>
          <strong>Location:</strong> {CONTACT_CONTENT.location}
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${CONTACT_CONTENT.email}`}>{CONTACT_CONTENT.email}</a>
        </p>
        <p>
          <strong>Business inquiries:</strong>{' '}
          <a href={`mailto:${CONTACT_CONTENT.partnerships}`}>{CONTACT_CONTENT.partnerships}</a>
        </p>
        <p>
          <strong>Website:</strong>{' '}
          <a href={CONTACT_CONTENT.website} rel="noreferrer" target="_blank">
            {CONTACT_CONTENT.website}
          </a>
        </p>
        <h3>Social</h3>
        <ul>
          {CONTACT_CONTENT.social.map((item) => (
            <li key={item.label}>
              <a href={item.href} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="notice-board">
        <h2>Follow Development</h2>
        <p>{CONTACT_FOLLOW_NOTE}</p>
        <p>
          &copy; Everburn Interactive LLP
        </p>
      </section>
    </SharedInternalLayout>
  );
}