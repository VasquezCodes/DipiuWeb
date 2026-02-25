
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactPerson, email, volume, message } = body;
        const interests = Array.isArray(body.interests) ? body.interests : [];

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

        // Contenido del correo HTML
        // Build interest tags HTML
        const interestTagsHtml = interests.length > 0
            ? interests.map((interest: string) => {
                const isTiramisu = interest.toLowerCase().includes('tiramisu');
                const bgColor = isTiramisu ? '#3d2b1f' : '#E8630A';
                const label = isTiramisu ? 'Tiramisù' : 'Popsicles';
                return `<span style="display:inline-block;background:${bgColor};color:#ffffff;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px;margin-right:8px;">${label}</span>`;
            }).join('')
            : '<span style="color:#999;font-style:italic;">None selected</span>';

        const htmlContent = `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#F4F1EA;border-radius:12px;overflow:hidden;border:1px solid #e8e4db;">
                
                <!-- Header -->
                <div style="background:#D92525;padding:32px 36px;text-align:center;">
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">DiPiù</h1>
                    <p style="margin:6px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.85);font-weight:500;">New Wholesale Enquiry</p>
                </div>

                <!-- Body -->
                <div style="padding:32px 36px;">
                    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.5;">A new enquiry has been submitted through the website.</p>

                    <!-- Info Card -->
                    <div style="background:#ffffff;border-radius:8px;padding:24px;margin-bottom:20px;border:1px solid #e8e4db;">
                        
                        <!-- Business Name -->
                        <div style="margin-bottom:18px;">
                            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;">Business</p>
                            <p style="margin:0;font-size:16px;font-weight:700;color:#1A1A1A;">${businessName || 'N/A'}</p>
                        </div>

                        <!-- Contact + Email row -->
                        <div style="display:flex;gap:20px;margin-bottom:18px;">
                            <div style="flex:1;">
                                <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;">Contact Person</p>
                                <p style="margin:0;font-size:15px;color:#1A1A1A;font-weight:500;">${contactPerson}</p>
                            </div>
                        </div>

                        <div style="margin-bottom:18px;">
                            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;">Email</p>
                            <p style="margin:0;font-size:15px;color:#D92525;font-weight:500;">
                                <a href="mailto:${email}" style="color:#D92525;text-decoration:none;">${email}</a>
                            </p>
                        </div>

                        <!-- Divider -->
                        <div style="border-top:1px solid #f0ede6;margin:20px 0;"></div>

                        <!-- Interests -->
                        <div style="margin-bottom:18px;">
                            <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;">Interested In</p>
                            <div>${interestTagsHtml}</div>
                        </div>

                        <!-- Volume -->
                        <div>
                            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;">Estimated Volume / Week</p>
                            <p style="margin:0;font-size:15px;color:#1A1A1A;font-weight:600;">${volume}</p>
                        </div>
                    </div>

                    <!-- Message Card -->
                    ${message ? `
                    <div style="background:#ffffff;border-radius:8px;padding:24px;margin-bottom:24px;border-left:4px solid #D92525;border-top:1px solid #e8e4db;border-right:1px solid #e8e4db;border-bottom:1px solid #e8e4db;">
                        <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;">Message</p>
                        <p style="margin:0;font-size:14px;color:#1A1A1A;line-height:1.7;white-space:pre-wrap;">${message}</p>
                    </div>
                    ` : ''}

                    <!-- Action Button -->
                    <div style="text-align:center;margin-top:8px;">
                        <a href="mailto:${email}?subject=Re: Wholesale Enquiry – DiPiù&body=Hi ${contactPerson},%0D%0A%0D%0AThank you for your interest in DiPiù!%0D%0A%0D%0A" 
                           style="display:inline-block;background:#D92525;color:#ffffff;padding:14px 40px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;text-transform:uppercase;letter-spacing:1.5px;">
                            Reply to ${contactPerson}
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background:#1A1A1A;padding:24px 36px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.5px;">This is an automated notification from your DiPiù website.</p>
                </div>
            </div>
        `;

        // Enviar el correo
        await transporter.sendMail({
            from: `"DiPiù Web" <${process.env.SENDER_EMAIL}>`, // Remitente verificado
            to: process.env.RECIPIENT_EMAIL, // Destinatario final
            subject: `New Enquiry from ${businessName || contactPerson}`,
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
