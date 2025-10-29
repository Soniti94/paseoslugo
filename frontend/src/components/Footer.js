import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.copyright}>
          <p>© 2025 PaseosLugo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    width: '100%',
  },
  benefitsSection: {
    background: 'white',
    padding: '5rem 0',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '3rem',
  },
  benefitCard: {
    textAlign: 'center',
  },
  benefitIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  benefitTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    color: '#1a1a1a',
  },
  benefitText: {
    fontSize: '0.9375rem',
    color: '#666',
    lineHeight: 1.7,
  },
  mainFooter: {
    background: '#1E293B',
    color: 'white',
    padding: '4rem 0 2rem',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
    gap: '3rem',
    marginBottom: '3rem',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'white',
    margin: 0,
  },
  brandDescription: {
    fontSize: '0.9375rem',
    color: '#CBD5E1',
    lineHeight: 1.7,
    marginBottom: '1rem',
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  footerHeading: {
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'white',
    marginBottom: '0.5rem',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
  },
  footerLink: {
    color: '#CBD5E1',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    transition: 'color 0.2s',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#CBD5E1',
    fontSize: '0.9375rem',
  },
  newsletter: {
    marginTop: '1rem',
  },
  newsletterHeading: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '0.75rem',
  },
  newsletterForm: {
    display: 'flex',
    gap: '0.5rem',
  },
  newsletterInput: {
    flex: 1,
    background: 'white',
    border: 'none',
    padding: '0.625rem',
    borderRadius: '6px',
  },
  newsletterButton: {
    background: '#FF6B00',
    color: 'white',
    padding: '0.625rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  copyright: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '2rem',
    textAlign: 'center',
  },
};
