import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReplyModeration() {
  const [replies, setReplies] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/forum/flagged-replies", { headers: { "x-auth-token": token } })
      .then(res => setReplies(res.data));
  }, [token]);

  const handleDelete = async (postId, replyId) => {
    await axios.delete(`/api/forum/${postId}/replies/${replyId}`, { headers: { "x-auth-token": token } });
    setReplies(replies.filter(r => r._id !== replyId));
  };

  const handleRestore = async (postId, replyId) => {
    await axios.post(`/api/forum/${postId}/replies/${replyId}/restore`, {}, { headers: { "x-auth-token": token } });
    window.location.reload();
  };

  return (
    <div>
      <h3>Flagged Replies</h3>
      <ul>
        {replies.map(reply => (
          <li key={reply._id}>
            {reply.content} - Flagged for: {reply.flagged.reason}
            <button onClick={() => handleDelete(reply.postId, reply._id)}>Delete</button>
            <button onClick={() => handleRestore(reply.postId, reply._id)}>Restore</button>
          </li>
        ))}
      </ul>
    </div>
  );
}