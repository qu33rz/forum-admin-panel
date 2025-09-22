import React, { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post("/api/auth/login", form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
}