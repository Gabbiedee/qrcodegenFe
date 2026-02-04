import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QRGenerator from './pages/GenerateQrcODE.JSX';
import QRReader from './pages/QrVerififier';
import ExportAttendance from './pages/ExportAttendance';
import DeleteAttendee from './pages/DeleteAttendee';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<QRGenerator />} />
        <Route path="/verify" element={<QRReader />} />
        <Route path="/export" element={<ExportAttendance />} />
        <Route path="/delete" element={<DeleteAttendee />} />
      </Routes>
    </Router>
  );
}
