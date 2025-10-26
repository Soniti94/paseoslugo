import React from 'react';

export default function EnPaseo() {
  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title}>Paseo en Progreso</h1>
        <p style={styles.message}>Esta funcionalidad estará disponible próximamente.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#FAFAFA',
    padding: '5rem 0',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.125rem',
    textAlign: 'center',
    color: '#666',
  },
};