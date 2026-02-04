import React, { useState } from 'react';
import styles from './QRgenerator.module.css';

const QRGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  const API_URL = import.meta.env.VITE_BASE_URL;
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/generate-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to generate QR code');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phoneNumber: '' });
    setResult(null);
    setError('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🔐 QR Code Generator</h1>
        <p className={styles.subtitle}>Generate secure attendee QR codes</p>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {['name', 'email', 'phoneNumber'].map((field) => (
              <div key={field} className={styles.formGroup}>
                <label className={styles.label}>
                  {field === 'name' ? 'Full Name' :
                   field === 'email' ? 'Email Address' : 'Phone Number'}
                  {field === 'name' || field === 'email' ? <span className={styles.required}>*</span> : null}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field === 'name' || field === 'email'}
                  placeholder={field === 'name' ? 'John Doe' :
                               field === 'email' ? 'john@example.com' : '+234 800 000 0000'}
                  className={styles.input}
                />
              </div>
            ))}

            <button 
              type="submit" 
              disabled={loading}
              className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </form>
        ) : (
          <div className={styles.result}>

            {/* Info message from backend */}
            {result.message && (
              <div className={styles.infoMessage}>
                {result.message}
              </div>
            )}

            {/* Badge */}
            <div className={styles.successBadge}>
              <span className={styles.checkmark}>✓</span>
              {result.message === 'This attendee is already registered. QR code retrieved.'
                ? 'QR Code Already Registered'
                : 'QR Code Generated!'}
            </div>

            {/* QR Code */}
            <div className={styles.qrContainer}>
              <img src={result.qrCode} alt="QR Code" className={styles.qrImage} />
            </div>

            {/* Attendee Details */}
            <div className={styles.details}>
              <h3 className={styles.detailsTitle}>Attendee Details</h3>
              {Object.entries(result.attendeeDetails).map(([key, value]) => value && (
                <div key={key} className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>
                  <span className={styles.detailValue}>{value}</span>
                </div>
              ))}
            </div>

            {/* Verification URL */}
            <div className={styles.urlSection}>
              <h3 className={styles.urlTitle}>🔗 Verification URL</h3>
              <div className={styles.urlBox}>
                <input type="text" value={result.verificationUrl} readOnly className={styles.urlInput} />
                <button onClick={() => copyToClipboard(result.verificationUrl)} className={styles.copyButton}>
                  Copy
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <a 
                href={result.qrCode} 
                download={`qr-code-${result.attendeeDetails.name.replace(/\s+/g, '-')}.png`} 
                className={`${styles.button} ${styles.downloadButton}`}
              >
                Download QR Code
              </a>
              <button onClick={resetForm} className={`${styles.button} ${styles.newButton}`}>
                Generate Another
              </button>
            </div>

            <div className={styles.securityBadge}>
              🔒 This QR code is cryptographically signed and secure
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
