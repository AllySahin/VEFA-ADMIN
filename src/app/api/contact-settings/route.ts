import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// İletişim bilgilerini saklamak için JSON dosya yolu
const CONTACT_DATA_PATH = path.join(process.cwd(), 'data', 'contact-settings.json')

// Varsayılan iletişim bilgileri
const defaultContactData = {
  phone: '+90 (222) 222 22 22',
  email: 'info@vefaismakinalari.com',
  address: 'Örnek Mah. Sanayi Cd. No:12 Tepebaşı / Eskişehir',
  workingHours: 'Hafta içi 09:00 - 19:00, Cumartesi 10:00 - 16:00',
  heroStats: [
    { number: '24SA', label: 'Yanıt Süresi' },
    { number: 'ESK', label: 'Merkezi Lokasyon' },
    { number: 'ÜCR', label: 'Ücretsiz Danışmanlık' }
  ],
  socialMedia: {
    instagram: '',
    linkedin: '',
    whatsapp: '+90 (222) 222 22 22',
    facebook: ''
  },
  updatedAt: new Date().toISOString()
}

// Data klasörünü ve dosyayı oluştur
function ensureDataFile() {
  const dataDir = path.dirname(CONTACT_DATA_PATH)
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  if (!fs.existsSync(CONTACT_DATA_PATH)) {
    fs.writeFileSync(CONTACT_DATA_PATH, JSON.stringify(defaultContactData, null, 2))
  }
}

// GET: İletişim bilgilerini al
export async function GET() {
  try {
    ensureDataFile()
    
    const data = fs.readFileSync(CONTACT_DATA_PATH, 'utf8')
    const contactData = JSON.parse(data)
    
    return NextResponse.json({
      success: true,
      data: contactData
    })
  } catch (error) {
    console.error('Contact settings GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'İletişim bilgileri alınamadı'
    }, { status: 500 })
  }
}

// POST: İletişim bilgilerini güncelle
export async function POST(request: NextRequest) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    
    const updatedData = {
      phone: body.phone || defaultContactData.phone,
      email: body.email || defaultContactData.email,
      address: body.address || defaultContactData.address,
      workingHours: body.workingHours || defaultContactData.workingHours,
      heroStats: body.heroStats || defaultContactData.heroStats,
      socialMedia: {
        instagram: body.socialMedia?.instagram || '',
        linkedin: body.socialMedia?.linkedin || '',
        whatsapp: body.socialMedia?.whatsapp || body.phone || defaultContactData.phone,
        facebook: body.socialMedia?.facebook || ''
      },
      updatedAt: new Date().toISOString()
    }
    
    fs.writeFileSync(CONTACT_DATA_PATH, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'İletişim bilgileri başarıyla güncellendi',
      data: updatedData
    })
  } catch (error) {
    console.error('Contact settings POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'İletişim bilgileri güncellenemedi'
    }, { status: 500 })
  }
}