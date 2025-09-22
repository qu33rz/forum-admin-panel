import React, { useEffect, useState } from "react";
import axios from "axios";
import UserEditor from "./UserEditor";
import BanModal from "./BanModal";
import ActivityLog from "./ActivityLog";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBan, setShowBan] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/users", { headers: { "x-auth-token": token } }).then(res => setUsers(res.data));
  }, [token]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.banned?.status ? `Banned (${u.banned.reason})` : "Active"}</td>
              <td>
                <button onClick={() => setSelectedUser(u)}>Edit</button>
                <button onClick={() => setShowBan(u)}>Ban</button>
                <button onClick={async () => {
                  await axios.delete(`/api/users/${u._id}`, { headers: { "x-auth-token": token } });
                  window.location.reload();
                }}>Delete</button>
                <button onClick={() => window.location.href = `/profile/${u._id}`}>Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && <UserEditor user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {showBan && <BanModal user={showBan} onClose={() => setShowBan(false)} />}
      <ActivityLog />
    </div>
  );
}