import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  return (
    <nav>
      <Link to="/">Forum</Link>
      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <>
          <Link to="/profile/me">My Profile</Link>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/moderate/posts">Flagged Posts</Link>
          <Link to="/moderate/replies">Flagged Replies</Link>
          <button onClick={() => {localStorage.removeItem("token"); window.location.reload();}}>Logout</button>
        </>
      )}
    </nav>
  );
}