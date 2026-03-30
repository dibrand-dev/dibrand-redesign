import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPERADMIN_EMAIL = Deno.env.get('SUPERADMIN_EMAIL') || 'nriccitelli@dibrand.co'

/**
 * Supabase Edge Function: notify-comment
 * Triggered by: AFTER INSERT on application_notes
 */
serve(async (req) => {
  try {
    const { record } = await req.json()

    // 1. Initialize Supabase Admin Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch Candidate and Assigned Recruiter Info
    // (In this project, 'job_applications' serves as the candidates table)
    const { data: candidate, error: candidateError } = await supabase
      .from('job_applications')
      .select('id, full_name, recruiter_id')
      .eq('id', record.application_id)
      .single()

    if (candidateError) throw candidateError

    // 3. Fetch Author and Assigned Recruiter Metadata
    const [authorRes, recruiterRes] = await Promise.all([
      supabase.from('recruiters').select('email, full_name, role').eq('id', record.author_id).single(),
      supabase.from('recruiters').select('email').eq('id', candidate.recruiter_id).single()
    ])

    const author = authorRes.data
    const recruiterEmail = recruiterRes.data?.email

    if (!author) throw new Error('Author not found')

    // 4. Determine Notification Logic
    let recipientEmail = ''
    const isSuperAdmin = author.role?.toLowerCase() === 'superadmin' || author.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()

    if (isSuperAdmin) {
      // Case: SuperAdmin comments -> notify assigned Recruiter
      recipientEmail = recruiterEmail || ''
    } else {
      // Case: Recruiter comments -> notify SuperAdmin
      recipientEmail = SUPERADMIN_EMAIL
    }

    if (!recipientEmail) {
      console.log('Skipping notification: No recipient found.')
      return new Response(JSON.stringify({ message: "No recipient found" }), { status: 200 })
    }

    console.log(`Sending notification: ${author.full_name} commented on ${candidate.full_name}. Recipient: ${recipientEmail}`)

    // 5. Send Email via Resend REST API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ATS Notificaciones <onboarding@resend.dev>", // Or verified domain if available
        to: recipientEmail,
        subject: `💬 Nuevo comentario sobre: ${candidate.full_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
            <p><strong>${author.full_name}</strong> ha dejado un nuevo comentario:</p>
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #0040A1;">
              "${record.note_text}"
            </div>
            <p>Puedes revisar la ficha completa del candidato aquí:</p>
            <a href="https://www.dibrand.co/ats/candidates/${candidate.id}" 
               style="display: inline-block; background-color: #0040A1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Ver Candidato
            </a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999;">Esta es una notificación automática del ATS de Dibrand.</p>
          </div>
        `,
      }),
    })

    const result = await res.json()
    return new Response(JSON.stringify(result), { status: 200 })

  } catch (err) {
    console.error('Edge Function Error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
