import { NextResponse } from 'next/server'

export interface Comment {
  id: number
  name: string
  email: string
  rating: number
  comment: string
  date: string
  status: 'pending' | 'published' | 'rejected'
  isStarred: boolean
  course?: string
  ip?: string
}

// Bu veriler normalde bir veritabanından gelir
let comments: Comment[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    rating: 5,
    comment: 'VEFA Eğitim Merkezi\'nde aldığım forklift eğitimi sayesinde kariyerimde büyük bir adım attım. Eğitmenler çok deneyimli ve sabırlıydı.',
    date: '2025-10-25 14:30',
    status: 'published',
    isStarred: true,
    course: 'Forklift Operatörlüğü'
  },
  {
    id: 2,
    name: 'Fatma Demir',
    email: 'fatma@example.com',
    rating: 5,
    comment: 'Manlift eğitimi için doğru tercihi yaptığımı düşünüyorum. Hem teorik hem pratik eğitim çok kapsamlıydı.',
    date: '2025-10-24 10:15',
    status: 'published',
    isStarred: false,
    course: 'Manlift Operatörlüğü'
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    rating: 4,
    comment: 'Ekskavatör operatör belgesini burada aldım. Eğitim kalitesi ve sonrasındaki iş bulma desteği harikaydı.',
    date: '2025-10-23 16:45',
    status: 'pending',
    isStarred: false,
    course: 'Ekskavatör Operatörlüğü'
  },
  {
    id: 4,
    name: 'Ayşe Yıldız',
    email: 'ayse@example.com',
    rating: 5,
    comment: 'Kurumsal eğitim paketinden çok memnunum. Tüm ekibimiz aynı kalitede eğitim aldı.',
    date: '2025-10-22 09:20',
    status: 'published',
    isStarred: true,
    course: 'Kurumsal Eğitim'
  },
  {
    id: 5,
    name: 'Ali Öztürk',
    email: 'ali@example.com',
    rating: 5,
    comment: 'Modern ekipmanlar ve uzman eğitmenler ile harika bir eğitim aldım. İş güvenliği konusunda çok şey öğrendim.',
    date: '2025-10-21 13:00',
    status: 'pending',
    isStarred: false,
    course: 'İş Güvenliği'
  }
]

// GET - Tüm yorumları getir
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let filteredComments = [...comments]

  // Durum filtresi
  if (status && status !== 'all') {
    filteredComments = filteredComments.filter(comment => comment.status === status)
  }

  // Arama filtresi
  if (search) {
    const searchLower = search.toLowerCase()
    filteredComments = filteredComments.filter(comment => 
      comment.name.toLowerCase().includes(searchLower) ||
      comment.email.toLowerCase().includes(searchLower) ||
      comment.comment.toLowerCase().includes(searchLower) ||
      comment.course?.toLowerCase().includes(searchLower)
    )
  }

  // Tarihe göre sırala (en yeni önce)
  filteredComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return NextResponse.json({
    success: true,
    comments: filteredComments,
    totalCount: comments.length,
    pendingCount: comments.filter(c => c.status === 'pending').length,
    publishedCount: comments.filter(c => c.status === 'published').length
  })
}

// POST - Yeni yorum ekle (website'den gelecek)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, rating, comment } = body

    // Validasyon
    if (!name || !email || !rating || !comment) {
      return NextResponse.json({
        success: false,
        message: 'Tüm alanlar zorunludur'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        message: 'Değerlendirme 1-5 arasında olmalıdır'
      }, { status: 400 })
    }

    // Yeni yorum oluştur
    const newComment: Comment = {
      id: Math.max(...comments.map(c => c.id), 0) + 1,
      name,
      email,
      rating,
      comment,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending', // Yeni yorumlar varsayılan olarak onay bekliyor
      isStarred: false
    }

    comments.push(newComment)

    return NextResponse.json({
      success: true,
      message: 'Yorumunuz başarıyla alındı. İncelendikten sonra yayınlanacaktır.',
      comment: newComment
    })

  } catch (error) {
    console.error('Yorum ekleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Yorum eklenirken bir hata oluştu'
    }, { status: 500 })
  }
}

// PUT - Yorum güncelle (durum değiştirme, yıldızlama vb.)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, action, value } = body

    const commentIndex = comments.findIndex(c => c.id === id)
    if (commentIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Yorum bulunamadı'
      }, { status: 404 })
    }

    // Eylem türüne göre güncelle
    switch (action) {
      case 'toggleStatus':
        comments[commentIndex].status = comments[commentIndex].status === 'published' ? 'pending' : 'published'
        break
      case 'setStatus':
        comments[commentIndex].status = value
        break
      case 'toggleStar':
        comments[commentIndex].isStarred = !comments[commentIndex].isStarred
        break
      default:
        return NextResponse.json({
          success: false,
          message: 'Geçersiz eylem'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      comment: comments[commentIndex]
    })

  } catch (error) {
    console.error('Yorum güncelleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Yorum güncellenirken bir hata oluştu'
    }, { status: 500 })
  }
}

// DELETE - Yorum sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const commentIndex = comments.findIndex(c => c.id === id)
    if (commentIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Yorum bulunamadı'
      }, { status: 404 })
    }

    const deletedComment = comments.splice(commentIndex, 1)[0]

    return NextResponse.json({
      success: true,
      message: 'Yorum başarıyla silindi',
      comment: deletedComment
    })

  } catch (error) {
    console.error('Yorum silme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Yorum silinirken bir hata oluştu'
    }, { status: 500 })
  }
}