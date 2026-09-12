'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Toast, { ToastType } from './Toast';

interface FormData {
  fullName: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  service?: string;
  message?: string;
}

const serviceOptions = [
  { value: '', label: 'Select a service...' },
  { value: '3d-web', label: '3D Web Design & WebGL Experiences' },
  { value: 'android', label: 'Android App Development' },
  { value: 'enterprise', label: 'Enterprise Web Application' },
];

const budgetOptions = [
  { value: '', label: 'Project scope / budget (optional)' },
  { value: 'under-5k', label: 'Under ₹5,00,000' },
  { value: '5k-20k', label: '₹5,00,000 – ₹20,00,000' },
  { value: '20k-50k', label: '₹20,00,000 – ₹50,00,000' },
  { value: '50k-plus', label: '₹50,00,000+' },
  { value: 'flexible', label: 'Flexible / Let\'s discuss' },
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'A valid email address is required.';
  if (!data.service) errors.service = 'Please select a service.';
  if (!data.message.trim() || data.message.trim().length < 20)
    errors.message = 'Please describe your project (min 20 characters).';
  return errors;
}

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', service: '', budget: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setToast({ message: 'Message sent! We\'ll get back to you within 24 hours.', type: 'success' });
        setForm({ fullName: '', email: '', service: '', budget: '', message: '' });
      } else {
        const data = (await res.json().catch(() => ({}))) as any;
        setToast({ message: data?.error || 'Something went wrong. Please try again or email us directly.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error. Please check your connection or email us directly.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-[#090a0d] border rounded-xl px-4 py-3.5 text-white placeholder-gray-500 text-sm outline-none transition-all duration-200 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.03)] ${
      errors[field]
        ? 'border-red-500/60 bg-red-950/10'
        : 'border-white/[0.06] hover:border-white/[0.12] focus:border-[#00ff87]/50 focus:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9),0_0_16px_rgba(0,255,135,0.12)]'
    }`;

  return (
    <section id="contact" ref={ref} className="relative py-28 bg-[#0f1015] overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#00ff87]/5 blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-[#00ff87] border border-white/[0.08] bg-[#14161d] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.4)]">
            Lead Capture • System Active
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Start Your Project
          </h2>
          <p className="text-[#8e95a5] max-w-lg mx-auto text-base">
            Tell us about your vision. Every brief is routed directly to our core engineering team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] via-[#13141b] to-[#0d0e12] p-7 shadow-[8px_8px_24px_rgba(0,0,0,0.65),-3px_-3px_12px_rgba(255,255,255,0.025),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse shadow-[0_0_8px_#00ff87]" />
                <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">All Systems Active</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Direct Contact</h3>
              <p className="text-[#8e95a5] text-sm mb-6">
                Prefer to reach out directly? Write to us anytime for instant response.
              </p>
              <a
                id="contact-mailto-btn"
                href="mailto:Contact@srijandev.in?subject=Project%20Inquiry%20from%20srijandev.in&body=Hello%20SrijanDev%20Team%2C%0A%0AI%27d%20like%20to%20discuss%20a%20project%3A%0A%0AProject%20Type%3A%20%0ABudget%3A%20%0ATimeline%3A%20%0ADescription%3A%20"
                className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full bg-[#121318] border border-white/[0.08] text-[#f1f5f9] font-semibold text-sm hover:border-[#00ff87]/40 hover:text-[#00ff87] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300 group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Contact@srijandev.in
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto group-hover:translate-x-1 transition-transform">
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </a>
            </div>

            {/* Service status nodes */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] via-[#13141b] to-[#0d0e12] p-7 shadow-[8px_8px_24px_rgba(0,0,0,0.65),-3px_-3px_12px_rgba(255,255,255,0.025),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <h4 className="text-[#8e95a5] text-xs font-bold tracking-widest uppercase mb-4">Service Nodes</h4>
              <div className="flex flex-col gap-3.5">
                {[
                  { label: '3D Web & Spatial Module', color: '#00e5ff' },
                  { label: 'Mobile Native Engine', color: '#00ff87' },
                  { label: 'Enterprise Suite & Plus OS', color: '#f5d061' },
                ].map((node) => (
                  <div key={node.label} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: node.color, boxShadow: `0 0 8px ${node.color}` }} />
                    <span className="text-gray-300 text-sm font-medium flex-1">{node.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form in CRED Convex Container */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] via-[#13141b] to-[#0d0e12] p-8 sm:p-10 shadow-[10px_10px_28px_rgba(0,0,0,0.7),-4px_-4px_14px_rgba(255,255,255,0.025),inset_0_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden"
            id="contact-form"
            noValidate
          >
            {/* Top 1px bevel sheen */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Full Name */}
              <div className="sm:col-span-1">
                <label htmlFor="contact-name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass('fullName')}
                />
                {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="sm:col-span-1">
                <label htmlFor="contact-email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Service */}
              <div className="sm:col-span-1">
                <label htmlFor="contact-service" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Service Category *
                </label>
                <select
                  id="contact-service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className={inputClass('service') + ' appearance-none cursor-pointer'}
                  style={{ colorScheme: 'dark' }}
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={!opt.value} className="bg-[#0f1015] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="mt-1.5 text-xs text-red-400">{errors.service}</p>}
              </div>

              {/* Budget */}
              <div className="sm:col-span-1">
                <label htmlFor="contact-budget" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Project Scope / Budget
                </label>
                <select
                  id="contact-budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full bg-[#090a0d] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-200 hover:border-white/[0.12] focus:border-[#00ff87]/50 focus:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9),0_0_16px_rgba(0,255,135,0.12)] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.03)] appearance-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0f1015] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="mb-7">
              <label htmlFor="contact-message" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Project Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Describe your project, goals, timeline, or any specific requirements..."
                value={form.message}
                onChange={handleChange}
                className={inputClass('message') + ' resize-none'}
              />
              {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
            </div>

            {/* Submit Button (CRED Ultra Smooth High Contrast Pill) */}
            <button
              id="contact-submit"
              type="submit"
              disabled={submitting}
              className="relative group overflow-hidden w-full px-8 py-4 rounded-full bg-white text-[#0a0b0e] font-extrabold text-sm tracking-wider uppercase shadow-[0_10px_30px_rgba(255,255,255,0.18)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.32)] transition-all duration-300 hover:scale-[1.015] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out pointer-events-none" />

              {submitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <span>Send Project Brief</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </>
              )}
            </button>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-gray-400">
              <span>
                Submissions routed directly to{' '}
                <span className="text-[#00ff87]">Contact@srijandev.in</span>
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-[#12141c] text-gray-300 font-mono text-[11px] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
                Srijandev Technologies (MSME: <strong className="text-[#00ff87]">UDYAM-HP-11-0048514</strong>)
              </span>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
