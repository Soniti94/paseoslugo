import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.copyright}>
          <p>© 2025 PaseosLugo. {t('footer.rights')}</p>
          <div style={styles.links}>
            <Link to="/privacidad" style={styles.link}>{t('footer.privacy')}</Link>
            <span style={styles.separator}>•</span>
            <Link to="/terminos" style={styles.link}>{t('footer.terms')}</Link>
            <span style={styles.separator}>•</span>
            <Link to="/cookies" style={styles.link}>{t('footer.cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1E293B',
    color: 'white',
    padding: '2rem 0',
    marginTop: '4rem',
  },
  copyright: {
    textAlign: 'center',
    fontSize: '0.9375rem',
    color: '#CBD5E1',
  },
};
