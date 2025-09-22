import React, { useState } from "react";
import axios from "axios";

export default function SignupForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "", firstName: "", lastName: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post("/api/auth/signup", form);
    alert("Signup successful, you can now login");
    window.location.href = "/login";
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}