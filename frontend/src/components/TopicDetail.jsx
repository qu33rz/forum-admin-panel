import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [reply, setReply] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`/api/forum/${id}`, { headers: { "x-auth-token": token } }).then(res => setTopic(res.data));
  }, [id, token]);

  const handleReply = async e => {
    e.preventDefault();
    await axios.post(`/api/forum/${id}/reply`, { content: reply }, { headers: { "x-auth-token": token } });
    setReply("");
    window.location.reload();
  };

  if (!token) return <div>Please login to view this topic.</div>;
  if (!topic) return <div>Loading...</div>;
  return (
    <div>
      <h2>{topic.title}</h2>
      <p>{topic.content}</p>
      <h4>Replies</h4>
      <ul>
        {(topic.replies || []).map(r => (
          <li key={r._id}>
            {r.content}
            {r.flagged?.status && <span style={{ color: "red" }}> [Flagged]</span>}
          </li>
        ))}
      </ul>
      <form onSubmit={handleReply}>
        <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a reply..." required />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}