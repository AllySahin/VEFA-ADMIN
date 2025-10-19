import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content } = await request.json()

    // Gmail SMTP yapılandırması
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vefaegitimsistem@gmail.com',
        pass: 'nufk zwzm tjfu zppe' // Gmail uygulama şifresi
      }
    })

    // Mail gönder
    await transporter.sendMail({
      from: '"VEFA Eğitim Merkezi" <vefaegitimsistem@gmail.com>',
      to: to,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #2c3e50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-top: none;
            }
            .footer {
              background-color: #2c3e50;
              color: white;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              border-radius: 0 0 5px 5px;
            }
            .message-content {
              white-space: pre-wrap;
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>VEFA EĞİTİM MERKEZİ</h2>
            </div>
            <div class="content">
              <div class="message-content">
                ${content.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div class="footer">
              <p>VEFA Eğitim Merkezi</p>
              <p>📞 Telefon: +90 XXX XXX XX XX | 📧 Email: vefaegitimsistem@gmail.com</p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Mail başarıyla gönderildi' 
    })

  } catch (error) {
    console.error('Mail gönderme hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Mail gönderilemedi' },
      { status: 500 }
    )
  }
}
