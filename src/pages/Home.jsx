import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎟 Event QR System</h1>
        <p className={styles.subtitle}>Quick access for attendees and Committee members</p>

        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={() => navigate('/generate')}>
            Generate / Send QR
          </button>
          <button className={styles.button} onClick={() => navigate('/verify')}>
            Verify QR
          </button>
          <button className={styles.button} onClick={() => navigate('/export')}>
            Export Registered Details
          </button>
          <button className={styles.button} onClick={() => navigate('/delete')}>
            Delete an Attendee
          </button>
        </div>
      </div>
    </div>
  );
}
