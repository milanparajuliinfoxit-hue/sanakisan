import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaYoutube, FaTwitter, FaPaperPlane, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { submitContactMessage } from '../api/config';

export default function ContactPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name, value) => {
    const trimmed = value.trim();
    switch (name) {
      case 'full_name':
        if (!trimmed) return 'Full name is required.';
        if (trimmed.length < 3 || trimmed.length > 150) return 'Full name must be 3–150 characters.';
        if (/<[^>]*>/g.test(trimmed)) return 'Invalid characters detected.';
        return '';
      case 'email':
        if (!trimmed) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Invalid email format.';
        return '';
      case 'phone':
        if (!trimmed) return '';
        if (!/^[+]?[\d\s\-()]{7,20}$/.test(trimmed)) return 'Invalid phone number format.';
        return '';
      case 'message':
        if (!trimmed) return 'Message is required.';
        if (trimmed.length < 10) return 'Message must be at least 10 characters.';
        if (trimmed.length > 3000) return 'Message must not exceed 3000 characters.';
        if (/<[^>]*>/g.test(trimmed)) return 'Invalid characters detected.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting || submitted) return;

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await submitContactMessage({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      toast.success(res?.message || 'Your message has been sent successfully.');
      setSubmitted(true);
      setForm({ full_name: '', email: '', phone: '', message: '' });
      setErrors({});
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        Object.keys(err.errors).forEach(key => {
          const mappedKey = key === 'full_name' ? 'full_name' : key;
          fieldErrors[mappedKey] = err.errors[key][0];
        });
        setErrors(fieldErrors);
      } else {
        toast.error(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      Icon: FaMapMarkerAlt,
      title: 'Office Address',
      content: (
        <>
          Jalthal, Sunsari District<br />
          Province No. 1, Nepal<br />
          Postal Code: 56700
        </>
      ),
    },
    {
      Icon: FaPhone,
      title: 'Phone Numbers',
      content: (
        <>
          <a href="tel:+977-025-500000" className="block transition hover:text-emerald-700">+977-025-500000 (Main)</a>
          <a href="tel:+977-9800000000" className="block transition hover:text-emerald-700">+977-9800000000 (Mobile)</a>
        </>
      ),
    },
    {
      Icon: FaEnvelope,
      title: 'Email Address',
      content: <a href="mailto:info@sfacljalthal.com.np" className="transition hover:text-emerald-700">info@sfacljalthal.com.np</a>,
    },
    {
      Icon: FaClock,
      title: 'Office Hours',
      content: (
        <>
          Sunday – Friday: 9:00 AM – 5:00 PM<br />
          Saturday: Closed<br />
          Public Holidays: Closed
        </>
      ),
    },
  ];

  return (
    <div>
      <PageBreadcrumb
        title="Contact Us"
        items={[
          { label: "Home", path: "/" },
          { label: "Contact Us" },
        ]}
      />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="mb-8 font-display text-3xl font-bold text-emerald-950">Get In Touch</h2>

            <div className="space-y-6 mb-8">
              {contactInfo.map(({ Icon, title, content }, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon className="text-sm" />
                  </div>
                  <div className="pt-1">
                    <div className="mb-0.5 text-sm font-semibold text-emerald-950">{title}</div>
                    <div className="text-sm leading-7 text-slate-600">{content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mb-8">
              <div className="mb-4 text-sm font-semibold text-emerald-950">Follow Us</div>
              <div className="flex gap-3">
                {[
                  { Icon: FaFacebook, label: 'Facebook', color: 'hover:bg-blue-600', href: 'https://www.facebook.com' },
                  { Icon: FaYoutube, label: 'YouTube', color: 'hover:bg-red-600', href: 'https://www.youtube.com' },
                  { Icon: FaTwitter, label: 'Twitter', color: 'hover:bg-sky-500', href: 'https://www.twitter.com' },
                ].map(({ Icon, label, color, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${color} hover:text-white`}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Google Map */}
            <div className="overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-emerald-50/80 shadow-sm">
              <iframe
                title="SFACL Jalthal Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113997.21!2d87.19!3d26.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQzJzQ4LjAiTiA4N8KwMTEnMjQuMCJF!5e0!3m2!1sen!2snp!4v1615000000000!5m2!1sen!2snp"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-[1.6rem]"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm">
              <h2 className="mb-2 font-display text-2xl font-bold text-emerald-950">Send a Message</h2>
              <p className="mb-6 text-sm text-slate-500">We typically respond within 1–2 business days.</p>

              {submitted && (
                <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  <FaCheckCircle className="text-emerald-500" />
                  Your message has been sent. We'll get back to you soon!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-3 ${
                        errors.full_name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10'
                      }`}
                    />
                    {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+977-XXXXXXXXXX"
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-3 ${
                        errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-3 ${
                      errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="How can we help you? Please describe your query or request..."
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-3 ${
                      errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10'
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><FaSpinner className="text-sm animate-spin" /> Sending...</>
                  ) : (
                    <><FaPaperPlane className="text-sm" /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
