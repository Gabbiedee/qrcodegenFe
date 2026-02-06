import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import styles from "./QRreader.module.css";

const QRReader = () => {
  const [attendee, setAttendee] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("ready");

  const API_URL = import.meta.env.VITE_BASE_URL;

  const handleScan = async (result) => {
    if (!result) return;
    const token = result?.rawValue || result?.text; 
    await fetch(`${API_URL}/api/verify?token=${token}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📷 Event QR Verification</h2>
      <p className={styles.subtitle}>
        {status === "verifying" ? "Verifying..." : "Point at QR code"}
      </p>

      <div className={styles.scannerWrapper}>
        <Scanner
          onScan={handleScan}
          onError={(err) => {
            console.error(err);
            setError("Camera/scan error: " + (err?.message || "Unknown"));
            setStatus("error");
          }}
          constraints={{ facingMode: "environment" }}
          scanDelay={300}
          components={{ finder: true }} 
          styles={{ video: { width: "100%", height: "100%", objectFit: "cover" } }}
        />
      </div>

{status === "success" && attendee && (
        <div className={styles.attendeeCard}>
          <h3>✅ Verified Attendee</h3>
          <p><strong>Name:</strong> {attendee.name}</p>
          <p><strong>Email:</strong> {attendee.email}</p>
          <p><strong>Event:</strong> {attendee.eventName}</p>
          {attendee.ticketType && <p><strong>Type:</strong> {attendee.ticketType}</p>}
        </div>
      )}

      {error && status !== "success" && (
        <div className={styles.errorCard}>
          ❌ {error}
          <button
            onClick={reset}
            style={{ marginTop: 12, padding: "8px 16px" }}
          >
            Try Again
          </button>
        </div>
      )}

      {status === "success" && (
        <button
          onClick={reset}
          style={{ marginTop: 16, padding: "10px 20px", background: "#059669", color: "white", border: "none", borderRadius: 6 }}
        >
          Scan Next
        </button>
      )}
    </div>
  );
};

export default QRReader