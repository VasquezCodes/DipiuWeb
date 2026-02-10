
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
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #D92525;">New Wholesale Enquiry</h2>
                <p>You have received a new enquiry from the website.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Business Name:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${businessName || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Contact Person:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactPerson}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Interests:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${interests.join(', ') || 'None selected'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Estimated Volume:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${volume}</td>
                    </tr>
                </table>

                <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
                    <p style="margin: 0;"><strong>Message:</strong></p>
                    <p style="margin-top: 5px; white-space: pre-wrap;">${message}</p>
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
