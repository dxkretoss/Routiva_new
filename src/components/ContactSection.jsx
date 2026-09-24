import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { invokeEdgeFunction } from '../lib/edgeFunctions';
import { useNotifications } from '../context/NotificationContext';

export default function ContactSection() {
  const { addToast } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await invokeEdgeFunction('submit-contact', formData);
      if (res?.success) {
        setSubmitted(true);
        addToast(res.message || 'Thank you for reaching out. We will get back to you shortly!', 'success');
        setFormData({ name: '', email: '', phone: '+91', message: '' });
      } else {
        addToast(res?.error || 'Failed to submit message. Please try again.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit message.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider border border-border inline-block">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Have a Question About Routiva?
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              We're launching across Gujarat with initial focus on Ahmedabad & Gandhinagar corridors. 
              Let us know if you'd like your corporate campus or office route listed.
            </p>

            <div className="space-y-4 pt-4 text-xs sm:text-sm text-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] font-medium">Primary Focus</span>
                  <span className="font-bold text-foreground">Ahmedabad ↔ Gandhinagar, Gujarat</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] font-medium">Direct Support</span>
                  <span className="font-bold text-foreground">support@routiva.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-7 sm:p-8 shadow-card">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto border border-border">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Thank You!</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto font-medium">
                  Your message has been safely received via our Edge Function API. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-secondary border border-border text-xs text-primary font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <div className="phone-input-container">
                    <PhoneInput
                      country={'in'}
                      value={formData.phone}
                      onChange={(phone) => {
                        const formatted = phone ? (phone.startsWith('+') ? phone : `+${phone}`) : '+91';
                        setFormData({ ...formData, phone: formatted });
                      }}
                      enableSearch={true}
                      disableSearchIcon={true}
                      searchPlaceholder="Search country..."
                      inputProps={{
                        name: 'phone',
                        placeholder: 'Enter mobile number'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Message / Route Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your daily commute route or company campus..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending via Edge Function...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
