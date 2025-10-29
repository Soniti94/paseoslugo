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
