import React, { useState } from 'react';
import styles from './DeleteAttendee.module.css';

const DeleteAttendee = () => {
  const [formData, setFormData] = useState({ name: '', phoneNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_BASE_URL; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (!formData.name || !formData.phoneNumber) {
      setError('Name and phone number are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/delete-attendee`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to delete attendee');
      } else {
        setSuccess(data.message || 'Attendee deleted successfully');
        setFormData({ name: '', phoneNumber: '' }); // reset form
      }

    } catch (err) {
      console.error('Error deleting attendee:', err);
      setError('Server error. Could not delete attendee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Delete Attendee</h2>

      <div className={styles.formGroup}>
        <label className={styles.label}>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+234 800 000 0000"
          className={styles.input}
        />
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Deleting...' : 'Delete Attendee'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </div>
  );
};

export default DeleteAttendee;
