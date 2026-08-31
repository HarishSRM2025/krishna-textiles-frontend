"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="container-x py-10">
      <h1 className="text-2xl font-extrabold text-navy mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        We&apos;d love to hear from you. Reach out with any questions about
        orders, returns, or wholesale enquiries.
      </p>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-4">
          <div className="card p-5 flex items-start gap-3">
            <Phone className="text-navy mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-navy text-sm">Call Us</p>
              <p className="text-sm text-gray-600">+91 98765 43210</p>
            </div>
          </div>
          <div className="card p-5 flex items-start gap-3">
            <Mail className="text-navy mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-navy text-sm">Email Us</p>
              <p className="text-sm text-gray-600">support@krishnatextiles.in</p>
            </div>
          </div>
          <div className="card p-5 flex items-start gap-3">
            <MapPin className="text-navy mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-navy text-sm">Visit Us</p>
              <p className="text-sm text-gray-600">
                Krishna Textiles, Textile Market Road, Erode, Tamil Nadu, India
              </p>
            </div>
          </div>
          <div className="card p-5 flex items-start gap-3">
            <Clock className="text-navy mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-navy text-sm">Working Hours</p>
              <p className="text-sm text-gray-600">Mon – Sat: 9:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          {submitted ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-3">📩</p>
              <p className="font-bold text-navy mb-1">Message Sent!</p>
              <p className="text-sm text-gray-500">
                Our support team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input required className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-navy" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-navy" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input required type="email" className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-navy" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <input className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-navy" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea required rows={5} className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-navy" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
