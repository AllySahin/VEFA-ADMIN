import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    // Dosya tipini kontrol et
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Geçersiz dosya tipi. Sadece JPEG, PNG, WebP ve GIF formatları desteklenmektedir.' 
      }, { status: 400 })
    }

    // Dosya boyutunu kontrol et (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.' 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını güvenli hale getir
    const timestamp = Date.now()
    const originalName = file.name.toLowerCase()
    const extension = path.extname(originalName)
    const baseName = path.basename(originalName, extension)
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    const fileName = `${baseName}-${timestamp}${extension}`

    // Public klasörüne uploads dizini oluştur
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'slider')
    
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Klasör zaten varsa hatayı yok say
    }

    // Dosyayı kaydet
    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Döndürülecek URL path'i
    const imageUrl = `/uploads/slider/${fileName}`

    return NextResponse.json({ 
      message: 'Dosya başarıyla yüklendi',
      imageUrl: imageUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    return NextResponse.json({ 
      error: 'Dosya yüklenirken bir hata oluştu' 
    }, { status: 500 })
  }
}

// Dosya silme endpoint'i
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json({ error: 'Dosya adı gerekli' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'slider', fileName)
    
    // Dosya varlığını kontrol et ve sil
    try {
      const fs = require('fs').promises
      await fs.unlink(filePath)
      return NextResponse.json({ message: 'Dosya başarıyla silindi' })
    } catch (error) {
      return NextResponse.json({ error: 'Dosya silinemedi' }, { status: 404 })
    }

  } catch (error) {
    console.error('Dosya silme hatası:', error)
    return NextResponse.json({ 
      error: 'Dosya silinirken bir hata oluştu' 
    }, { status: 500 })
  }
}