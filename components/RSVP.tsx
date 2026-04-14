import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { GuestInput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { submitRSVP } from '../services/rsvp';

export const RSVP: React.FC = () => {
  const { t, guestName } = useLanguage();
  
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [displayName, setDisplayName] = useState(guestName || '');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const [formData, setFormData] = useState<GuestInput>({
    firstName: guestName || '',
    lastName: '',
    email: '',
    dietary: '',
    attendance: 'yes',
    pax: 1
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await submitRSVP(formData as any);
      setSubmitted(true);
    } catch (err) {
      console.error('RSVP submission failed:', err);
      setError(t('rsvp.errorMessage') || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAttendance = (value: 'yes' | 'no') => {
    setFormData({ ...formData, attendance: value });
  };

  const startNameEdit = () => {
    setIsNameEditing(true);
    setEditFirstName('');
    setEditLastName('');
    setNameError(null);
  };

  const cancelNameEdit = () => {
    setIsNameEditing(false);
    setNameError(null);
  };

  const saveNameEdit = () => {
    const firstName = editFirstName.trim();
    const lastName = editLastName.trim();
    if (!firstName || !lastName) {
      setNameError(t('rsvp.nameRequired') || 'Please enter your first and last name.');
      return;
    }

    setFormData({ ...formData, firstName, lastName });
    setDisplayName(`${firstName} ${lastName}`);
    setIsNameEditing(false);
    setNameError(null);
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
            {guestName ? (
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {!isNameEditing ? (
                    <motion.div
                      key="name-display"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-ivory/20 pb-6"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-ivory/60 mb-2">
                          {t('rsvp.fullName')}
                        </p>
                        <p className="font-serif text-2xl md:text-3xl text-ivory">
                          {displayName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={startNameEdit}
                        className="px-5 py-3 border border-ivory/20 text-ivory/70 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all"
                      >
                        {t('rsvp.editName') || 'Edit Name'}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="name-edit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <InputGroup
                          label={t('rsvp.firstName')}
                          name="editFirstName"
                          value={editFirstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.target.value)}
                          required
                        />
                        <InputGroup
                          label={t('rsvp.lastName')}
                          name="editLastName"
                          value={editLastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLastName(e.target.value)}
                          required
                        />
                      </div>

                      {nameError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-300 font-sans text-sm text-right"
                        >
                          {nameError}
                        </motion.p>
                      )}

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={cancelNameEdit}
                          className="px-5 py-3 border border-ivory/20 text-ivory/60 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all"
                        >
                          {t('rsvp.cancelEdit') || 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={saveNameEdit}
                          className="px-5 py-3 bg-ivory text-wine text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors"
                        >
                          {t('rsvp.saveName') || 'Save Name'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InputGroup
                  label={t('rsvp.firstName')}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label={t('rsvp.lastName')}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

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
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <button
                  type="button"
                  onClick={() => handleAttendance('yes')}
                  className={`relative px-6 py-5 md:px-8 md:py-6 border flex items-center justify-between transition-all duration-300 w-full md:w-1/2 ${formData.attendance === 'yes' ? 'border-ivory bg-ivory/10 text-ivory' : 'border-ivory/30 hover:border-ivory/50 text-ivory/60'}`}
                >
                  <span className="font-display text-2xl md:text-3xl text-left">
                    {t('rsvp.attending')}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.attendance === 'yes' ? 'border-ivory' : 'border-ivory/40'}`}>
                    {formData.attendance === 'yes' && <div className="w-3 h-3 rounded-full bg-ivory" />}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAttendance('no')}
                  className={`relative px-6 py-5 md:px-8 md:py-6 border flex items-center justify-between transition-all duration-300 w-full md:w-1/2 ${formData.attendance === 'no' ? 'border-ivory bg-ivory/10 text-ivory' : 'border-ivory/30 hover:border-ivory/50 text-ivory/60'}`}
                >
                  <span className="font-display text-2xl md:text-3xl text-left">
                    {t('rsvp.notAttending')}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.attendance === 'no' ? 'border-ivory' : 'border-ivory/40'}`}>
                    {formData.attendance === 'no' && <div className="w-3 h-3 rounded-full bg-ivory" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <InputGroup
                label={t('rsvp.pax')}
                name="pax"
                type="number"
                min="1"
                max="10"
                value={formData.pax}
                onChange={handleChange}
              />
              <InputGroup
                label={t('rsvp.dietary')}
                name="dietary"
                value={formData.dietary}
                onChange={handleChange}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-300 font-sans text-sm text-right"
              >
                {error}
              </motion.p>
            )}

            <div className="pt-12 flex justify-end">
              <button
                type="submit"
                disabled={submitting || isNameEditing}
                className={`group relative px-8 py-4 bg-ivory text-wine font-sans uppercase tracking-widest text-sm font-bold overflow-hidden transition-opacity ${(submitting || isNameEditing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                  {submitting ? t('rsvp.submitting') || 'Sending...' : t('rsvp.submit')} <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0 bg-wine-light transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100 text-ivory pointer-events-none">
                  {submitting ? t('rsvp.submitting') || 'Sending...' : t('rsvp.submit')} <ArrowRight size={16} />
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
  required?: boolean;
}

const InputGroup: React.FC<InputProps> = ({ label, required = false, ...props }) => {
  return (
    <div className="relative group">
      <input
        {...props}
        className="w-full bg-transparent border-b border-ivory/20 py-4 text-xl md:text-2xl text-ivory placeholder-transparent focus:outline-none focus:border-ivory transition-colors font-serif"
        placeholder={label}
        required={required}
      />
      <label className="absolute left-0 -top-4 text-xs tracking-widest uppercase text-ivory font-sans transition-all duration-300 pointer-events-none">
        {label}
      </label>
    </div>
  );
}
