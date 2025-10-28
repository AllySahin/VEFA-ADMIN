import { NextRequest, NextResponse } from 'next/server';

// Örnek slider verisi
let sliders = [
  {
    id: 1,
    title: 'VEFA Eğitim Merkezine Hoş Geldiniz',
    description: 'Teknoloji alanında uzman eğitmenlerle birlikte geleceğinizi şekillendirin',
    image: '/uploads/slider/hero-1.jpg',
    buttonText: 'Keşfet',
    buttonLink: '/courses',
    order: 1,
    isActive: true
  },
  {
    id: 2,
    title: 'Profesyonel Web Geliştirme',
    description: 'Modern web teknolojileri ile kariyerinize yön verin',
    image: '/uploads/slider/hero-2.jpg',
    buttonText: 'Başla',
    buttonLink: '/courses/web-development',
    order: 2,
    isActive: true
  }
];

export async function GET() {
  try {
    // Aktif sliderları sıraya göre getir
    const activeSliders = sliders
      .filter(slider => slider.isActive)
      .sort((a, b) => a.order - b.order);
      
    return NextResponse.json({ 
      success: true, 
      data: activeSliders 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Slider verisi getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSlider = {
      id: sliders.length + 1,
      order: sliders.length + 1,
      isActive: true,
      ...body
    };
    
    sliders.push(newSlider);
    
    return NextResponse.json({ 
      success: true, 
      data: newSlider 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Slider eklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const sliderIndex = sliders.findIndex(s => s.id === id);
    if (sliderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Slider bulunamadı' },
        { status: 404 }
      );
    }
    
    sliders[sliderIndex] = { ...sliders[sliderIndex], ...updateData };
    
    return NextResponse.json({ 
      success: true, 
      data: sliders[sliderIndex] 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Slider güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '');
    
    const sliderIndex = sliders.findIndex(s => s.id === id);
    if (sliderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Slider bulunamadı' },
        { status: 404 }
      );
    }
    
    sliders.splice(sliderIndex, 1);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Slider silindi' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Slider silinemedi' },
      { status: 500 }
    );
  }
}