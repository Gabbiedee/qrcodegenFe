import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from "./QRreader.module.css"

const QRReader = () => {
  const [attendee, setAttendee] = useState(null);
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);

   const API_URL = import.meta.env.VITE_BASE_URL;
   console.log('API URL:', API_URL);
  const handleScan = async (token) => {
    if (!token || scanned) return;
    setScanned(true);
    setError('');
    setAttendee(null);

    try {
      const res = await fetch(`${API_URL}/api/verify?token=${token}`);
      const data = await res.json();

      if (data.success) {
        setAttendee(data.attendee);
      } else {
        setError(data.error || 'Invalid QR code');
      }
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setTimeout(() => setScanned(false), 1500);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error accessing webcam');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📷 Event QR Verification</h2>
      <p className={styles.subtitle}>Scan attendee QR code with your webcam</p>

      <div className={styles.scannerWrapper}>
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={(result, error) => {
            if (!!result) handleScan(result?.text);
            if (!!error) handleError(error);
          }}
          className={styles.qrReader}
        />
      </div>

      {attendee && (
        <div className={styles.attendeeCard}>
          <h3>✅ Verified Attendee</h3>
          <p><strong>Name:</strong> {attendee.name}</p>
          <p><strong>Email:</strong> {attendee.email}</p>
          <p><strong>Event:</strong> {attendee.eventName}</p>
        </div>
      )}

      {error && (
        <div className={styles.errorCard}>
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default QRReader;
