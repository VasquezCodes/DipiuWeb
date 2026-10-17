import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Escapa los datos del formulario antes de meterlos en el HTML del correo
const esc = (value: unknown) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
    ));

const labelStyle = 'margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;';

const field = (label: string, valueHtml: string, last = false) => `
                        <div style="margin-bottom:${last ? 0 : 18}px;">
                            <p style="${labelStyle}">${label}</p>
                            <p style="margin:0;font-size:15px;color:#1A1A1A;font-weight:500;">${valueHtml}</p>
                        </div>`;

const tag = (label: string, bgColor: string) =>
    `<span style="display:inline-block;background:${bgColor};color:#ffffff;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px;margin-right:8px;">${label}</span>`;

const noneSelected = '<span style="color:#999;font-style:italic;">None selected</span>';

const formatEventDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Not decided yet';
    return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-AU', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });
};

function renderEmail({ heading, cardHtml, message, contactPerson, email, replySubject }: {
    heading: string;
    cardHtml: string;
    message: string;
    contactPerson: string;
    email: string;
    replySubject: string;
}) {
    const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(`Hi ${contactPerson},\r\n\r\nThank you for your interest in DiPiù!\r\n\r\n`)}`;

    return `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#F4F1EA;border-radius:12px;overflow:hidden;border:1px solid #e8e4db;">

                <!-- Header -->
                <div style="background:#D92525;padding:32px 36px;text-align:center;">
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">DiPiù</h1>
                    <p style="margin:6px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.85);font-weight:500;">${heading}</p>
                </div>

                <!-- Body -->
                <div style="padding:32px 36px;">
                    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.5;">A new enquiry has been submitted through the website.</p>

                    <!-- Info Card -->
                    <div style="background:#ffffff;border-radius:8px;padding:24px;margin-bottom:20px;border:1px solid #e8e4db;">
                        ${cardHtml}
                    </div>

                    <!-- Message Card -->
                    ${message ? `
                    <div style="background:#ffffff;border-radius:8px;padding:24px;margin-bottom:24px;border-left:4px solid #D92525;border-top:1px solid #e8e4db;border-right:1px solid #e8e4db;border-bottom:1px solid #e8e4db;">
                        <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;">Message</p>
                        <p style="margin:0;font-size:14px;color:#1A1A1A;line-height:1.7;white-space:pre-wrap;">${esc(message)}</p>
                    </div>
                    ` : ''}

                    <!-- Action Button -->
                    <div style="text-align:center;margin-top:8px;">
                        <a href="${esc(replyHref)}"
                           style="display:inline-block;background:#D92525;color:#ffffff;padding:14px 40px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;text-transform:uppercase;letter-spacing:1.5px;">
                            Reply to ${esc(contactPerson)}
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background:#1A1A1A;padding:24px 36px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.5px;">This is an automated notification from your DiPiù website.</p>
                </div>
            </div>
        `;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactPerson, email, volume, message } = body;
        const interests = Array.isArray(body.interests) ? body.interests : [];
        const services = Array.isArray(body.services) ? body.services : [];
        const isEvents = body.enquiryType === 'events';

        // Validaciones básicas
        if (!email || !contactPerson) {
            return NextResponse.json(
                { error: 'Email and Contact Person are required' },
                { status: 400 }
            );
        }

        // Configuración del transporter de Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP_HOST,
            port: Number(process.env.BREVO_SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_KEY,
            },
        });

        const emailField = field('Email', `<a href="mailto:${esc(email)}" style="color:#D92525;text-decoration:none;">${esc(email)}</a>`);
        const divider = '<div style="border-top:1px solid #f0ede6;margin:20px 0;"></div>';

        let htmlContent: string;
        let subject: string;

        if (isEvents) {
            const occasion = String(body.occasion || 'Event');
            const serviceTags = services.length > 0
                ? services.map((service: string) => service === 'cannoli-station'
                    ? tag('Cannoli Station', '#D92525')
                    : tag('Tiramisu Tray', '#3d2b1f')
                ).join('')
                : noneSelected;

            htmlContent = renderEmail({
                heading: 'New Event Enquiry',
                cardHtml: [
                    field('Occasion', `<strong style="font-size:16px;">${esc(occasion)}</strong>`),
                    field('Event Date', esc(formatEventDate(String(body.eventDate || '')))),
                    field('Guests', esc(body.guests || 'N/A')),
                    field('Suburb or Venue', esc(body.venue || 'N/A')),
                    divider,
                    field('Name', esc(contactPerson)),
                    emailField,
                    field('Phone', body.phone ? `<a href="tel:${esc(String(body.phone).replace(/[^\d+]/g, ''))}" style="color:#D92525;text-decoration:none;">${esc(body.phone)}</a>` : 'N/A'),
                    divider,
                    `<p style="margin:0 0 8px;${labelStyle.replace('margin:0 0 3px;', '')}">Would Like</p><div>${serviceTags}</div>`,
                ].join(''),
                message,
                contactPerson,
                email,
                replySubject: `Re: ${occasion} Enquiry – DiPiù`,
            });
            subject = `New Event Enquiry: ${occasion} from ${contactPerson}`;
        } else {
            // Build interest tags HTML
            const interestTagsHtml = interests.length > 0
                ? interests.map((interest: string) => interest.toLowerCase().includes('tiramisu')
                    ? tag('Tiramisù', '#3d2b1f')
                    : tag('Popsicles', '#E8630A')
                ).join('')
                : noneSelected;

            htmlContent = renderEmail({
                heading: 'New Wholesale Enquiry',
                cardHtml: [
                    field('Business', `<strong style="font-size:16px;">${esc(businessName || 'N/A')}</strong>`),
                    field('Contact Person', esc(contactPerson)),
                    emailField,
                    divider,
                    `<div style="margin-bottom:18px;"><p style="margin:0 0 8px;${labelStyle.replace('margin:0 0 3px;', '')}">Interested In</p><div>${interestTagsHtml}</div></div>`,
                    field('Estimated Volume / Week', `<strong>${esc(volume)}</strong>`, true),
                ].join(''),
                message,
                contactPerson,
                email,
                replySubject: 'Re: Wholesale Enquiry – DiPiù',
            });
            subject = `New Enquiry from ${businessName || contactPerson}`;
        }

        // Enviar el correo
        await transporter.sendMail({
            from: `"DiPiù Web" <${process.env.SENDER_EMAIL}>`, // Remitente verificado
            to: process.env.RECIPIENT_EMAIL, // Destinatario final
            subject,
            html: htmlContent,
            replyTo: email, // Para responder directamente al usuario
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
