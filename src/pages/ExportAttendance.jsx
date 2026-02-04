import React, { useState } from 'react';
import styles from './ExportAttendance.module.css';

const ExportAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_BASE_URL;
  console.log('API URL:', API_URL);
  const handleExport = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/export-attendance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendance file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error exporting attendance:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={handleExport} 
        disabled={loading} 
        className={styles.button}
      >
        {loading ? 'Exporting...' : 'Export Attendance'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ExportAttendance;
