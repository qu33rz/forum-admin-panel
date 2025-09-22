import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForumTopics() {
  const [topics, setTopics] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios.get("/api/forum/topics").then(res => setTopics(res.data));
  }, []);
  return (
    <div>
      <h2>Prominent Topics</h2>
      {topics.map(topic => (
        <div key={topic._id}>
          <h3>{topic.title}</h3>
          <p>{topic.content.slice(0, 100)}...</p>
          {token && <Link to={`/topic/${topic._id}`}>Read/Reply</Link>}
        </div>
      ))}
      {!token && <div>Login to read full topics and reply.</div>}
    </div>
  );
}