import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/users/me", { headers: { "x-auth-token": token } })
      .then(res => setLogs(res.data.activityLog || []));
  }, [token]);

  return (
    <div>
      <h3>My Activity Log</h3>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>{log.action} on {log.targetId} at {new Date(log.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}