import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");
  const isMe = id === "me";

  useEffect(() => {
    const userId = isMe ? "me" : id;
    axios.get(`/api/users/${userId}`, { headers: { "x-auth-token": token } })
      .then(res => setProfile(res.data));
  }, [id, isMe, token]);

  if (!token) return <div>Login to view your profile.</div>;
  if (!profile) return <div>Loading...</div>;
  return (
    <div>
      <h2>{profile.username}'s Profile</h2>
      <p>Name: {profile.firstName} {profile.lastName}</p>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      <p>Bio: {profile.profile?.bio}</p>
      <p>Contact: {profile.profile?.contact}</p>
      <p>Language: {profile.profile?.language}</p>
      {/* Optionally add an edit form for your own profile */}
    </div>
  );
}