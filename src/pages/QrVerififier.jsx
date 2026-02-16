import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import styles from "./QRreader.module.css";

const QRReader = () => {
  const [attendee, setAttendee] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("ready");

  const API_URL = import.meta.env.VITE_BASE_URL;

  const reset = () => {
    setAttendee(null);
    setError("");
    setStatus("ready");
  };

  const handleScan = async (detectedCodes) => {
    console.log("Detected codes:", detectedCodes);
    if (status !== "ready" || !detectedCodes || detectedCodes.length === 0) return;

    const code = detectedCodes[0];
    let token = code.rawValue;

    console.log("Raw Scanned Value:", token);

    // Attempt to extract token if the scanned value is a URL
    try {
      if (token.includes("http") || token.includes("://")) {
        const urlObj = new URL(token);
        const extractedToken = urlObj.searchParams.get("token");
        if (extractedToken) {
          token = extractedToken;
          console.log("Extracted Token from URL:", token);
        }
      }
    } catch (e) {
      console.log("Scanned value is not a valid URL, using raw value.");
    }

    console.log("Final Token to Verify:", token);

    if (!token) return;

    setStatus("verifying");
    console.log(`Verifying with URL: ${API_URL}/api/verify?token=${token}`);

    try {
      const response = await fetch(`${API_URL}/api/verify?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setAttendee(data);
        setStatus("success");
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Verification failed");
      setStatus("error");
    }
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
          paused={status !== "ready"}
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