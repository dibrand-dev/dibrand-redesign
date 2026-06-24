import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import fs from 'fs/promises';
import path from 'path';

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

        let templateHtml = '';
        try {
            const templatePath = path.join(process.cwd(), 'data', 'templates', 'hosting-alert.html');
            templateHtml = await fs.readFile(templatePath, 'utf8');
        } catch (err) {
            console.error('Error leyendo la plantilla HTML:', err);
            return NextResponse.json({ error: 'Template not found' }, { status: 500 });
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

            // Reemplazar las variables dinámicas en el HTML
            const htmlContent = templateHtml
                .replace(/{{first_name}}/g, client.first_name)
                .replace(/{{domain}}/g, client.domain)
                .replace(/{{expiration_date}}/g, new Date(client.expiration_date).toLocaleDateString('es-AR'))
                .replace(/{{amount}}/g, formattedAmount)
                .replace(/{{currency}}/g, client.currency);

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
