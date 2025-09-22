import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PostModeration() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/forum/flagged", { headers: { "x-auth-token": token } })
      .then(res => setPosts(res.data));
  }, [token]);

  const handleDelete = async (id) => {
    await axios.delete(`/api/forum/${id}`, { headers: { "x-auth-token": token } });
    setPosts(posts.filter(p => p._id !== id));
  };

  const handleRestore = async (id) => {
    await axios.post(`/api/forum/${id}/restore`, {}, { headers: { "x-auth-token": token } });
    window.location.reload();
  };

  return (
    <div>
      <h3>Flagged Posts</h3>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <strong>{post.title}</strong> - Flagged for: {post.flagged.reason}
            <button onClick={() => handleDelete(post._id)}>Delete</button>
            <button onClick={() => handleRestore(post._id)}>Restore</button>
          </li>
        ))}
      </ul>
    </div>
  );
}