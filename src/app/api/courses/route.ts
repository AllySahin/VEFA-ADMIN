import { NextRequest, NextResponse } from 'next/server';

// Örnek kurs verisi - gerçek uygulamada veritabanından gelir
let courses = [
  {
    id: 1,
    title: 'Web Geliştirme Bootcamp',
    description: 'HTML, CSS, JavaScript ve React ile modern web geliştirme',
    instructor: 'Ahmet Kaya',
    duration: '12 hafta',
    price: 2500,
    capacity: 20,
    enrolled: 15,
    status: 'Aktif',
    startDate: '2024-02-01',
    image: '/uploads/courses/web-development.jpg'
  },
  {
    id: 2,
    title: 'Python Programlama',
    description: 'Sıfırdan ileri seviye Python programlama',
    instructor: 'Elif Demir',
    duration: '8 hafta',
    price: 1800,
    capacity: 25,
    enrolled: 22,
    status: 'Aktif',
    startDate: '2024-01-15',
    image: '/uploads/courses/python.jpg'
  }
];

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: courses 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kurslar getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCourse = {
      id: courses.length + 1,
      enrolled: 0,
      status: 'Aktif',
      ...body
    };
    
    courses.push(newCourse);
    
    return NextResponse.json({ 
      success: true, 
      data: newCourse 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kurs eklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const courseIndex = courses.findIndex(c => c.id === id);
    if (courseIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Kurs bulunamadı' },
        { status: 404 }
      );
    }
    
    courses[courseIndex] = { ...courses[courseIndex], ...updateData };
    
    return NextResponse.json({ 
      success: true, 
      data: courses[courseIndex] 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kurs güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    
    const courseIndex = courses.findIndex(c => c.id === id);
    if (courseIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Kurs bulunamadı' },
        { status: 404 }
      );
    }
    
    courses.splice(courseIndex, 1);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Kurs silindi' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Kurs silinemedi' },
      { status: 500 }
    );
  }
}