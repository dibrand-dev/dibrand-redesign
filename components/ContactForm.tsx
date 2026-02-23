'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { submitToZoho } from '@/app/actions/submitToZoho';

interface ContactFormProps {
  dict: {
    contact: {
      form: {
        name: string;
        lastName: string;
        email: string;
        company: string;
        message: string;
        submit: string;
        sending: string;
        success: string;
        error: string;
      };
    };
  };
}

interface FormData {
  'First Name': string;
  'Last Name': string;
  Email: string;
  Company: string;
  Description: string;
}

export default function ContactForm({ dict }: ContactFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitStatus('idle');

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await submitToZoho(formData);

    if (result.success) {
      setSubmitStatus('success');
      reset();
    } else {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {submitStatus === 'success' ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold text-white mb-2">{dict.contact.form.success}</h3>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="mt-4 text-emerald-400 hover:text-emerald-300 underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-300">
              {dict.contact.form.name}
            </label>
            <input
              id="firstName"
              {...register('First Name', { required: true })}
              className="w-full px-4 py-3 bg-white/5 border-b border-gray-600 rounded-none focus:outline-none focus:border-magenta-500 text-white placeholder-gray-500 transition-all"
              placeholder={dict.contact.form.name}
            />
            {errors['First Name'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-300">
              {dict.contact.form.lastName}
            </label>
            <input
              id="lastName"
              {...register('Last Name', { required: true })}
              className="w-full px-4 py-3 bg-white/5 border-b border-gray-600 rounded-none focus:outline-none focus:border-magenta-500 text-white placeholder-gray-500 transition-all"
              placeholder={dict.contact.form.lastName}
            />
            {errors['Last Name'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              {dict.contact.form.email}
            </label>
            <input
              id="email"
              type="email"
              {...register('Email', { required: true })}
              className="w-full px-4 py-3 bg-white/5 border-b border-gray-600 rounded-none focus:outline-none focus:border-magenta-500 text-white placeholder-gray-500 transition-all"
              placeholder="john@example.com"
            />
            {errors['Email'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-gray-300">
              {dict.contact.form.company}
            </label>
            <input
              id="company"
              {...register('Company', { required: true })}
              className="w-full px-4 py-3 bg-white/5 border-b border-gray-600 rounded-none focus:outline-none focus:border-magenta-500 text-white placeholder-gray-500 transition-all"
              placeholder={dict.contact.form.company}
            />
            {errors['Company'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-300">
              {dict.contact.form.message}
            </label>
            <textarea
              id="message"
              {...register('Description')}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border-b border-gray-600 rounded-none focus:outline-none focus:border-magenta-500 text-white placeholder-gray-500 transition-all resize-none"
              placeholder={dict.contact.form.message}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "w-full md:w-64 py-5 px-8 rounded-lg text-lg font-bold text-white transition-all transform hover:-translate-y-1 hover:shadow-2xl",
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D83484] to-[#A3369D] hover:opacity-90 shadow-lg shadow-purple-500/20"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  {dict.contact.form.sending}
                </span>
              ) : (
                dict.contact.form.submit
              )}
            </button>
          </div>

          {submitStatus === 'error' && (
            <p className="text-red-400 text-center text-sm mt-2 col-span-1 md:col-span-2">{dict.contact.form.error}</p>
          )}
        </form>
      )}
    </div>
  );
}
