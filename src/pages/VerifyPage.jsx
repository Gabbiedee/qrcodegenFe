import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./VerifyPage.module.css";

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const [attendee, setAttendee] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setError("No token found. Please scan a valid QR code.");
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                const response = await fetch(`${API_URL}/api/verify?token=${token}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setAttendee(data.attendee);
                    setMessage(data.message);
                } else {
                    setError(data.error || "Verification failed.");
                }
            } catch (err) {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <p className={styles.loadingText}>🔍 Verifying your ticket...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={`${styles.card} ${styles.cardError}`}>
                    <h2 className={styles.errorTitle}>❌ Verification Failed</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.card} ${styles.cardSuccess}`}>
                <h2 className={styles.successTitle}>✅ Ticket Confirmed</h2>
                <p className={styles.message}>{message}</p>
                <hr className={styles.divider} />
                <p><strong>Name:</strong> {attendee?.name}</p>
                {attendee?.email && <p><strong>Email:</strong> {attendee?.email}</p>}
                <p><strong>Phone:</strong> {attendee?.phoneNumber}</p>
                {attendee?.ticketType && <p><strong>Ticket Type:</strong> {attendee?.ticketType}</p>}
                {attendee?.modeOfAttendance && <p><strong>Mode:</strong> {attendee?.modeOfAttendance}</p>}
            </div>
        </div>
    );
};

export default VerifyPage;