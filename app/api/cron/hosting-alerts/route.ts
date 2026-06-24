import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    
    // 1. Validación de seguridad (CRON_SECRET de Vercel)
    if (process.env.NODE_ENV === 'production') {
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const SENDER_EMAIL = process.env.SENDER_EMAIL || 'hola@dibrand.co';
        const SENDER_NAME = process.env.SENDER_NAME || 'Dibrand';

        if (!BREVO_API_KEY) {
            console.error('Falta BREVO_API_KEY en las variables de entorno.');
            return NextResponse.json({ error: 'Missing BREVO_API_KEY configuration' }, { status: 500 });
        }

        // 2. Determinar la ventana de 5 días
        const targetStart = new Date();
        targetStart.setDate(targetStart.getDate() + 5);
        targetStart.setUTCHours(0, 0, 0, 0);

        const targetEnd = new Date(targetStart);
        targetEnd.setDate(targetEnd.getDate() + 1);

        // 3. Consultar clientes que vencen en esa ventana de 5 días
        const { data: clients, error } = await supabase
            .from('hosting_clients')
            .select(`
                *,
                hosting_plans (
                    name,
                    price_ars,
                    price_usd
                )
            `)
            .gte('expiration_date', targetStart.toISOString())
            .lt('expiration_date', targetEnd.toISOString());

        if (error) {
            throw new Error(`Error en Supabase: ${error.message}`);
        }

        if (!clients || clients.length === 0) {
            return NextResponse.json({ success: true, message: 'No hay vencimientos en 5 días.', emailsSent: 0 });
        }

        let emailsSent = 0;
        const errors: any[] = [];

        // 4. Enviar correos vía Brevo
        for (const client of clients) {
            if (!client.email) {
                console.warn(`Cliente ${client.first_name} ${client.last_name} no tiene email. Se omite.`);
                continue;
            }

            // Calcular el monto a mostrar
            let amount = 0;
            if (client.custom_price_override !== null) {
                amount = Number(client.custom_price_override);
            } else if (client.hosting_plans) {
                amount = client.currency === 'ARS' 
                    ? Number(client.hosting_plans.price_ars) 
                    : Number(client.hosting_plans.price_usd);
            }

            const formattedAmount = client.currency === 'ARS' 
                ? `$${amount.toLocaleString('es-AR')}` 
                : `U$D ${amount.toLocaleString('en-US')}`;

            const htmlContent = `
                <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
                    <h2 style="color: #9e4d97;">Aviso de renovación de Hosting</h2>
                    <p>Hola <strong>${client.first_name} ${client.last_name}</strong>,</p>
                    <p>Te escribimos de Dibrand para recordarte que el servicio de hosting para tu dominio <strong>${client.domain}</strong> vence en exactamente 5 días.</p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9e4d97;">
                        <p style="margin: 5px 0;"><strong>Plan actual:</strong> ${client.hosting_plans?.name || 'Personalizado'}</p>
                        <p style="margin: 5px 0;"><strong>Fecha de vencimiento:</strong> ${new Date(client.expiration_date).toLocaleDateString('es-AR')}</p>
                        <p style="margin: 5px 0;"><strong>Monto de renovación:</strong> ${formattedAmount} ${client.currency}</p>
                    </div>

                    <p>Para evitar interrupciones en tu servicio web o correos, por favor contáctanos a la brevedad para coordinar el pago de la renovación.</p>
                    
                    <p>Saludos cordiales,<br><strong>El equipo de Dibrand</strong></p>
                </div>
            `;

            const payload = {
                sender: { name: SENDER_NAME, email: SENDER_EMAIL },
                to: [{ email: client.email, name: `${client.first_name} ${client.last_name}` }],
                subject: `Renovación de Hosting - ${client.domain}`,
                htmlContent: htmlContent
            };

            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                emailsSent++;
            } else {
                const responseData = await response.json();
                errors.push({ email: client.email, error: responseData });
                console.error(`Error enviando a ${client.email}:`, responseData);
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Alertas procesadas correctamente`, 
            emailsSent,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (err: any) {
        console.error('Error procesando cron de hosting:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
