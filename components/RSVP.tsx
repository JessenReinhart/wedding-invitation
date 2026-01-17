import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { GuestInput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const RSVP: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<GuestInput>({
    firstName: '',
    lastName: '',
    email: '',
    dietary: '',
    attendance: null
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setSubmitted(true), 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttendance = (value: 'yes' | 'no') => {
    setFormData({ ...formData, attendance: value });
  };

  return (
    <section id="rsvp" className="w-full bg-wine text-ivory py-32 px-4 md:px-12 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl">

        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-8xl mb-6"
          >
            {t('rsvp.title')}
          </motion.h2>
          <p className="font-serif italic text-ivory/70 text-xl md:text-2xl">{t('rsvp.subtitle')}</p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 border border-ivory/20 bg-white/5 backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-full bg-ivory text-wine flex items-center justify-center mb-6">
              <Check size={32} />
            </div>
            <h3 className="font-display text-3xl mb-4 text-center">{t('rsvp.successTitle')}</h3>
            <p className="font-sans text-ivory/80 text-center max-w-md">
              {t('rsvp.successDesc')}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">

            {/* Name Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <InputGroup
                label={t('rsvp.firstName')}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputGroup
                label={t('rsvp.lastName')}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <InputGroup
              label={t('rsvp.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Attendance Toggle */}
            <div className="py-8 border-b border-ivory/20">
              <label className="block text-xs uppercase tracking-[0.2em] text-ivory/60 mb-6">{t('rsvp.attendance')}</label>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <button
                  type="button"
                  onClick={() => handleAttendance('yes')}
                  className={`font-display text-2xl md:text-5xl text-left transition-colors duration-300 hover:text-ivory ${formData.attendance === 'yes' ? 'text-ivory' : 'text-ivory/30'}`}
                >
                  {t('rsvp.attending')}
                </button>
                <button
                  type="button"
                  onClick={() => handleAttendance('no')}
                  className={`font-display text-2xl md:text-5xl text-left transition-colors duration-300 hover:text-ivory ${formData.attendance === 'no' ? 'text-ivory' : 'text-ivory/30'}`}
                >
                  {t('rsvp.notAttending')}
                </button>
              </div>
            </div>

            <InputGroup
              label={t('rsvp.dietary')}
              name="dietary"
              value={formData.dietary}
              onChange={handleChange}
            />

            <div className="pt-12 flex justify-end">
              <button
                type="submit"
                className="group relative px-8 py-4 bg-ivory text-wine font-sans uppercase tracking-widest text-sm font-bold overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                  {t('rsvp.submit')} <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0 bg-wine-light transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100 text-ivory pointer-events-none">
                  {t('rsvp.submit')} <ArrowRight size={16} />
                </span>
              </button>
            </div>

          </form>
        )}
      </div>
    </section>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputGroup: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="relative group">
      <input
        {...props}
        className="w-full bg-transparent border-b border-ivory/20 py-4 text-xl md:text-2xl text-ivory placeholder-transparent focus:outline-none focus:border-ivory transition-colors font-serif"
        placeholder={label}
        required
      />
      <label className="absolute left-0 -top-4 text-xs tracking-widest uppercase text-ivory font-sans transition-all duration-300 pointer-events-none">
        {label}
      </label>
    </div>
  );
}