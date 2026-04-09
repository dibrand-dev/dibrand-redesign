'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { submitToZoho } from '@/app/actions/submitToZoho';
import { trackContactFormSuccess } from '@/lib/gtm';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface ContactFormProps {
  dict: {
    contact: {
      form: {
        name: string;
        lastName: string;
        email: string;
        company: string;
        message: string;
        emailPlaceholder?: string;
        messagePlaceholder?: string;
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
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();
  
  // Obtenemos el contexto de forma segura. Si no existe la llave,
  // RecaptchaProvider debe proveer un contexto aunque sea vacío para evitar el crash.
  const recaptchaContext = useGoogleReCaptcha();
  const executeRecaptcha = recaptchaContext?.executeRecaptcha;

  useEffect(() => {
    setMounted(true);
    if (subject) {
      setValue('Description', subject);
    }
  }, [subject, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitStatus('idle');

    // MODO ULTRA-DEFENSIVO: Si falta la llave, no intentamos NADA con reCAPTCHA.
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    let captchaToken = null;
    
    if (siteKey && siteKey.length > 5 && executeRecaptcha) {
      try {
        console.log('[ContactForm] Executing reCAPTCHA...');
        const tokenPromise = executeRecaptcha('contact_form');
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3500));
        captchaToken = await (Promise.race([tokenPromise, timeoutPromise]) as Promise<string>);
        console.log('[ContactForm] reCAPTCHA token generated successfully.');
      } catch (e) {
        console.warn('[ContactForm] reCAPTCHA failed or timed out. Falling back to other security layers:', e);
      }
    } else {
      console.warn('[ContactForm] reCAPTCHA skipped: siteKey missing or executeRecaptcha not ready.', { 
        hasSiteKey: !!siteKey, 
        siteKeyLength: siteKey?.length,
        hasExecute: !!executeRecaptcha 
      });
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (captchaToken) formData.append('captchaToken', captchaToken);

      const result = await submitToZoho(formData);

      if (result.success) {
        setSubmitStatus('success');
        trackContactFormSuccess();
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Recaptcha error:', error);
      setSubmitStatus('error');
    }
  };

  // Safe placeholders to avoid hydration mismatch while server might have older dictionary versions
  const emailPlaceholder = mounted ? (dict.contact.form.emailPlaceholder || "yourname@email.com") : "";
  const messagePlaceholder = mounted ? (dict.contact.form.messagePlaceholder || dict.contact.form.message) : "";

  return (
    <div className="w-full max-w-4xl mx-auto">
      {submitStatus === 'success' ? (
        <div className="text-center py-12">
          <h3 className={clsx("text-2xl font-bold mb-2", isDark ? "text-white" : "text-zinc-900")}>{dict.contact.form.success}</h3>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="mt-4 text-[#D83484] hover:text-[#A3369D] font-bold text-sm underline underline-offset-4 transition-colors"
            >
              Enviar otro mensaje
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
              placeholder={emailPlaceholder}
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
              placeholder={messagePlaceholder}
            />
          </div>

          {/* Honeypot field - Hidden from users */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              {...register('Website Secondary' as any)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "inline-flex items-center justify-center gap-3 w-full md:w-auto px-10 py-5 rounded-full text-base font-bold text-white transition-all hover:scale-[1.02] group",
                isSubmitting
                  ? "bg-brand/50 cursor-not-allowed"
                  : "bg-brand shadow-lg shadow-brand/20 hover:bg-brand/90"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  {dict.contact.form.sending}
                </span>
              ) : (
                <>
                  {dict.contact.form.submit}
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {submitStatus === 'error' && (
            <p className="text-red-400 text-center text-sm mt-2 col-span-1 md:col-span-2">{dict.contact.form.error}</p>
          )}

          <p className={clsx("text-[10px] mt-4 col-span-1 md:col-span-2", isDark ? "text-zinc-500" : "text-zinc-400")}>
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" className="underline hover:text-brand">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms" className="underline hover:text-brand">Terms of Service</a> apply.
          </p>
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
