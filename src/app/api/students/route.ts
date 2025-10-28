import { NextRequest, NextResponse } from 'next/server';

// Örnek veri - gerçek uygulamada veritabanından gelir
let students = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0532 123 45 67',
    course: 'Web Geliştirme',
    status: 'Aktif',
    enrollmentDate: '2024-01-15'
  },
  // Daha fazla örnek veri...
];

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: students 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Öğrenciler getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newStudent = {
      id: students.length + 1,
      ...body,
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    
    students.push(newStudent);
    
    return NextResponse.json({ 
      success: true, 
      data: newStudent 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Öğrenci eklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Öğrenci bulunamadı' },
        { status: 404 }
      );
    }
    
    students[studentIndex] = { ...students[studentIndex], ...updateData };
    
    return NextResponse.json({ 
      success: true, 
      data: students[studentIndex] 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Öğrenci güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    
    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Öğrenci bulunamadı' },
        { status: 404 }
      );
    }
    
    students.splice(studentIndex, 1);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Öğrenci silindi' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Öğrenci silinemedi' },
      { status: 500 }
    );
  }
}