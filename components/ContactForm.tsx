'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { submitToZoho } from '@/app/actions/submitToZoho';
import { useEffect, Suspense } from 'react';

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
  isDark?: boolean;
}

interface FormData {
  'First Name': string;
  'Last Name': string;
  Email: string;
  Company: string;
  Description: string;
}

function ContactFormFields({ dict, isDark = false }: ContactFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();

  useEffect(() => {
    if (subject) {
      setValue('Description', subject);
    }
  }, [subject, setValue]);

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
          <h3 className={clsx("text-2xl font-bold mb-2", isDark ? "text-white" : "text-zinc-900")}>{dict.contact.form.success}</h3>
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
            <label htmlFor="firstName" className={clsx("text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>
              {dict.contact.form.name}
            </label>
            <input
              id="firstName"
              {...register('First Name', { required: true })}
              className={clsx(
                "w-full px-4 py-3 border-b transition-all focus:outline-none focus:border-brand rounded-none text-base",
                isDark 
                  ? "bg-white/5 border-zinc-700 text-white placeholder-zinc-500" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
              )}
              placeholder={dict.contact.form.name}
            />
            {errors['First Name'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className={clsx("text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>
              {dict.contact.form.lastName}
            </label>
            <input
              id="lastName"
              {...register('Last Name', { required: true })}
              className={clsx(
                "w-full px-4 py-3 border-b transition-all focus:outline-none focus:border-brand rounded-none text-base",
                isDark 
                  ? "bg-white/5 border-zinc-700 text-white placeholder-zinc-500" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
              )}
              placeholder={dict.contact.form.lastName}
            />
            {errors['Last Name'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className={clsx("text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>
              {dict.contact.form.email}
            </label>
            <input
              id="email"
              type="email"
              {...register('Email', { required: true })}
              className={clsx(
                "w-full px-4 py-3 border-b transition-all focus:outline-none focus:border-brand rounded-none text-base",
                isDark 
                  ? "bg-white/5 border-zinc-700 text-white placeholder-zinc-500" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
              )}
              placeholder="john@example.com"
            />
            {errors['Email'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className={clsx("text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>
              {dict.contact.form.company}
            </label>
            <input
              id="company"
              {...register('Company', { required: true })}
              className={clsx(
                "w-full px-4 py-3 border-b transition-all focus:outline-none focus:border-brand rounded-none text-base",
                isDark 
                  ? "bg-white/5 border-zinc-700 text-white placeholder-zinc-500" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
              )}
              placeholder={dict.contact.form.company}
            />
            {errors['Company'] && <span className="text-red-400 text-xs">Required</span>}
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="message" className={clsx("text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>
              {dict.contact.form.message}
            </label>
            <textarea
              id="message"
              {...register('Description')}
              rows={4}
              className={clsx(
                "w-full px-4 py-3 border-b transition-all focus:outline-none focus:border-brand rounded-none text-base resize-none",
                isDark 
                  ? "bg-white/5 border-zinc-700 text-white placeholder-zinc-500" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
              )}
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
                  : "bg-gradient-to-r from-brand to-brand hover:opacity-90 shadow-lg shadow-purple-500/20"
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

export default function ContactForm(props: ContactFormProps) {
  return (
    <Suspense fallback={<div className="w-full h-64 animate-pulse bg-zinc-100 rounded-lg" />}>
      <ContactFormFields {...props} />
    </Suspense>
  );
}
