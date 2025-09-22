import React, { useState } from "react";
import axios from "axios";

const prewrittenReasons = [
  "Spam",
  "Harassment",
  "Inappropriate Content",
  "Violation of Terms",
  "Other"
];

export default function BanModal({ user, onClose }) {
  const [reason, setReason] = useState(prewrittenReasons[0]);
  const [customReason, setCustomReason] = useState("");
  const [days, setDays] = useState(7);
  const token = localStorage.getItem("token");

  const handleBan = async () => {
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const finalReason = customReason || reason;
    await axios.post(`/api/users/${user._id}/ban`, { reason: finalReason, until }, { headers: { "x-auth-token": token } });
    alert("User banned");
    onClose();
    window.location.reload();
  };

  return (
    <div>
      <h3>Ban User: {user.username}</h3>
      <label>Reason:
        <select value={reason} onChange={e => setReason(e.target.value)}>
          {prewrittenReasons.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label>Custom Reason:<input value={customReason} onChange={e => setCustomReason(e.target.value)} /></label>
      <label>Ban Duration (days):<input type="number" min="1" value={days} onChange={e => setDays(e.target.value)} /></label>
      <button onClick={handleBan}>Ban</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}