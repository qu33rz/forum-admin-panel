import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import ForumTopics from "./components/ForumTopics";
import TopicDetail from "./components/TopicDetail";
import AdminPanel from "./components/AdminPanel";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import PostModeration from "./components/PostModeration";
import ReplyModeration from "./components/ReplyModeration";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ForumTopics />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/topic/:id" element={<TopicDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/moderate/posts" element={<PostModeration />} />
        <Route path="/moderate/replies" element={<ReplyModeration />} />
      </Routes>
    </BrowserRouter>
  );
}