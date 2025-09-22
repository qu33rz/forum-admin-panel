import React, { useState } from "react";
import axios from "axios";

export default function UserEditor({ user, onClose }) {
  const [role, setRole] = useState(user.role);
  const [profile, setProfile] = useState(user.profile || {});
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    await axios.put(`/api/users/${user._id}`, { profile }, { headers: { "x-auth-token": token } });
    await axios.post(`/api/users/${user._id}/role`, { role }, { headers: { "x-auth-token": token } });
    alert("User updated");
    onClose();
    window.location.reload();
  };

  return (
    <div>
      <h3>Edit User: {user.username}</h3>
      <label>Role:
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="user">User</option>
        </select>
      </label>
      <label>Bio:<input value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} /></label>
      <label>Contact:<input value={profile.contact} onChange={e => setProfile({ ...profile, contact: e.target.value })} /></label>
      <label>Language:<input value={profile.language} onChange={e => setProfile({ ...profile, language: e.target.value })} /></label>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}