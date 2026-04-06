"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = (e: any) => {
  e.preventDefault();

  const phoneNumber = "201283957041"; // 👈 حط رقمك صح

  const message = `
New Contact Request

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Message: ${form.comment}
  `;

  const encodedMessage = encodeURIComponent(message.trim());

  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.open(url, "_blank");
};

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-3xl mb-10 text-center">Contact</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <textarea
          name="comment"
          placeholder="Comment"
          onChange={handleChange}
          className="w-full border p-3 h-40"
        />

        <button className="bg-black text-white px-6 py-3">
          Submit
        </button>
      </form>
    </div>
  );
}