import { NextResponse } from 'next/server'

// Mock veri - gerçek uygulamada veritabanından gelir
const featuredCourses = [
  {
    id: 1,
    title: 'Forklift Eğitimi',
    description: 'MEB onaylı forklift operatör belgesi alın. Teori ve pratik eğitim ile sertifika garantisi.',
    href: '/hizmetlerimiz/forklift',
    linkText: 'Detayları Gör',
    image: '/images/service-forklift.png',
    badge: 'Popüler',
    price: '₺2.500',
    featuredOrder: 1
  },
  {
    id: 2,
    title: 'Manlift Eğitimi',
    description: 'Yüksekte çalışma platformu operatör eğitimi. İş güvenliği sertifikası dahil.',
    href: '/hizmetlerimiz/manlift',
    linkText: 'Detayları Gör',
    image: '/images/service-manlift.png',
    badge: 'MEB Onaylı',
    price: '₺2.200',
    featuredOrder: 2
  },
  {
    id: 3,
    title: 'Mobil Vinç Eğitimi',
    description: 'Mobil vinç operatör eğitimi. İleri seviye teknikler dahil.',
    href: '/hizmetlerimiz/mobil-vinc',
    linkText: 'Detayları Gör',
    image: '/images/service-crane.png',
    badge: 'İleri Seviye',
    price: '₺3.800',
    featuredOrder: 3
  },
  {
    id: 4,
    title: 'Kurumsal Eğitim',
    description: 'Şirketinize özel eğitim paketleri. Grup indirimleri ve yerinde eğitim.',
    href: '/kurumsal',
    linkText: 'Teklif Al',
    image: '/images/slider-forklift-manlift.png',
    badge: 'İndirimli',
    price: 'Özel Fiyat',
    featuredOrder: 4
  },
  {
    id: 5,
    title: 'Vinç Operatörlüğü',
    description: 'Mobil vinç ve kule vinç operatör eğitimi. Profesyonel sertifika programı.',
    href: '/hizmetlerimiz/vinc',
    linkText: 'Detayları Gör',
    image: '/images/service-vinc.png',
    badge: 'Sertifikalı',
    price: '₺3.800',
    featuredOrder: 5
  },
  {
    id: 6,
    title: 'İş Güvenliği Eğitimi',
    description: 'İşyeri güvenlik uzmanı eğitimi ve çalışan güvenlik bilinçlendirme programları.',
    href: '/hizmetlerimiz/is-guvenligi',
    linkText: 'Detayları Gör',
    image: '/images/service-forklift.png',
    badge: 'Zorunlu',
    price: '₺1.800',
    featuredOrder: 6
  },
  {
    id: 7,
    title: 'Beko Loder Eğitimi',
    description: 'Kazıcı yükleyici operatör eğitimi. Kazı ve yükleme teknikleri.',
    href: '/hizmetlerimiz/beko-loder',
    linkText: 'Detayları Gör',
    image: '/images/service-loader.png',
    badge: 'Talep Edilen',
    price: '₺3.400',
    featuredOrder: 7
  },
  {
    id: 8,
    title: 'Dozer Operatörlüğü',
    description: 'Buldozer ve iş makineleri operatör sertifikası. Arazi düzenleme eğitimi.',
    href: '/hizmetlerimiz/dozer',
    linkText: 'Detayları Gör',
    image: '/images/service-crane.png',
    badge: 'Profesyonel',
    price: '₺3.600',
    featuredOrder: 8
  }
]

export async function GET() {
  try {
    // Sadece öne çıkan kursları döndür ve sırala
    const featured = featuredCourses
      .filter(course => course.featuredOrder > 0)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, 8) // Maksimum 8 kurs

    return NextResponse.json({
      success: true,
      data: featured,
      count: featured.length
    })

  } catch (error) {
    console.error('Featured courses API error:', error)
    return NextResponse.json(
      { error: 'Öne çıkan kurslar getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { courseIds, order } = await request.json()

    if (!courseIds || !Array.isArray(courseIds)) {
      return NextResponse.json(
        { error: 'Geçersiz kurs listesi' },
        { status: 400 }
      )
    }

    if (courseIds.length > 8) {
      return NextResponse.json(
        { error: 'Maksimum 8 kurs öne çıkarılabilir' },
        { status: 400 }
      )
    }

    // Gerçek uygulamada burada veritabanı güncellemesi yapılır
    console.log('Updating featured courses:', { courseIds, order })

    return NextResponse.json({
      success: true,
      message: 'Öne çıkan kurslar güncellendi',
      data: { courseIds, order }
    })

  } catch (error) {
    console.error('Update featured courses error:', error)
    return NextResponse.json(
      { error: 'Öne çıkan kurslar güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}