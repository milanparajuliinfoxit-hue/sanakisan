import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaYoutube, FaTwitter, FaPaperPlane } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div>
      <PageBanner title="Contact Us" subtitle="Get in touch with our team" breadcrumb="Home › Contact Us" eyebrow="Reach out" />

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="mb-6 font-display text-2xl font-semibold text-emerald-950">Get In Touch</h2>

            <div className="space-y-5 mb-8">
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-white" />
                </div>
                <div>
                  <div className="mb-0.5 text-sm font-semibold text-emerald-950">Office Address</div>
                  <div className="text-sm leading-7 text-slate-600">Jalthal, Sunsari District<br />Province No. 1, Nepal<br />Postal Code: 56700</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-white" />
                </div>
                <div>
                  <div className="mb-0.5 text-sm font-semibold text-emerald-950">Phone Numbers</div>
                  <div className="text-sm text-slate-600">
                    <a href="tel:+977-025-500000" className="block transition hover:text-emerald-700">+977-025-500000 (Main)</a>
                    <a href="tel:+977-9800000000" className="block transition hover:text-emerald-700">+977-9800000000 (Mobile)</a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-white" />
                </div>
                <div>
                  <div className="mb-0.5 text-sm font-semibold text-emerald-950">Email Address</div>
                  <a href="mailto:info@sfacljalthal.com.np" className="text-sm text-slate-600 transition hover:text-emerald-700">
                    info@sfacljalthal.com.np
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-white" />
                </div>
                <div>
                  <div className="mb-0.5 text-sm font-semibold text-emerald-950">Office Hours</div>
                  <div className="text-sm text-slate-600">
                    Sunday – Friday: 9:00 AM – 5:00 PM<br />
                    Saturday: Closed<br />
                    Public Holidays: Closed
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mb-8">
              <div className="mb-3 text-sm font-semibold text-emerald-950">Follow Us</div>
              <div className="flex gap-3">
                {[
                  { Icon: FaFacebook, label: 'Facebook', color: 'hover:bg-blue-600', href: 'https://www.facebook.com' },
                  { Icon: FaYoutube, label: 'YouTube', color: 'hover:bg-red-600', href: 'https://www.youtube.com' },
                  { Icon: FaTwitter, label: 'Twitter', color: 'hover:bg-sky-500', href: 'https://www.twitter.com' },
                ].map(({ Icon, label, color, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 ${color} text-emerald-700 transition hover:text-white`}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Google Map placeholder */}
            <div className="flex h-52 items-center justify-center overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/80">
              <iframe
                title="SFACL Jalthal Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113997.21!2d87.19!3d26.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQzJzQ4LjAiTiA4N8KwMTEnMjQuMCJF!5e0!3m2!1sen!2snp!4v1615000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm">
              <h2 className="mb-2 font-display text-2xl font-semibold text-emerald-950">Send a Message</h2>
              <p className="mb-6 text-sm text-slate-500">We typically respond within 1–2 business days.</p>

              {submitted && (
                <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  ✓ Your message has been sent. We'll get back to you soon!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+977-XXXXXXXXXX"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you? Please describe your query or request..."
                    className="w-full resize-none rounded-2xl border border-emerald-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-800 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  <FaPaperPlane className="text-sm" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
