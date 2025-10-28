# VEFA Admin Panel - Yorumlar Sistemi

Admin paneldeki mesajlar bölümünün altına yorumlar alanı eklendi. Sitedeki değerlendirme formundan yapılan yorumlar bu alana düşüyor.

## ✨ Özellikler

### Admin Paneli (Port 3000)
- **Yorumlar Listesi**: Tüm yorumları grid layout'da görüntüler
- **Filtreleme**: Yayınlanan, bekleyen yorumlara göre filtre
- **Arama**: Ad, email, yorum içeriği veya kursa göre arama
- **Durum Yönetimi**: Yorumları yayınla/yayından kaldır
- **Yıldızlama**: Öne çıkan yorumları işaretle
- **Silme**: Yorumları kalıcı olarak sil
- **İstatistikler**: Toplam, yayınlanan, bekleyen ve öne çıkan yorum sayıları

### Website (Port 3001)
- **Review Form**: İletişim sayfasında kullanıcılar değerlendirme yapabilir
- **Yıldız Sistemi**: 1-5 arası puan verebilir
- **KVKK Onayı**: Yorum yayınlama için gerekli onay
- **Otomatik Entegrasyon**: Yorumlar admin paneline otomatik gönderilir

## 🚀 Nasıl Çalışır

1. **Kullanıcı İşlemi**: Website'de (port 3001) iletişim sayfasındaki form doldurulur
2. **API İsteği**: Yorum admin paneline (port 3000) `/api/comments` endpoint'ine gönderilir
3. **Onay Süreci**: Yorumlar varsayılan olarak "bekliyor" durumunda gelir
4. **Admin Kontrolü**: Admin panelinde yorumlar incelenir ve yayınlanır
5. **Yayın**: Onaylanan yorumlar sitede gösterile bilir

## 📁 Dosya Yapısı

### Admin Panel
```
VEFA-ADMIN/
├── src/app/
│   ├── admin/comments/page.tsx          # Yorumlar sayfası
│   ├── api/comments/route.ts            # Yorumlar API
│   └── components/AdminSidebar.tsx      # Sidebar'a yorumlar linki
├── middleware.ts                        # CORS yapılandırması
└── globals.css                         # Badge ve animasyonlar
```

### Website
```
VEFA-website/
└── src/app/components/ReviewForm.tsx    # İletişim sayfasındaki form
```

## 🔧 API Endpoints

### GET `/api/comments`
Yorumları listeler, filtreleme ve arama destekler.

**Query Parameters:**
- `status`: 'all' | 'pending' | 'published'
- `search`: Arama terimi

### POST `/api/comments`
Yeni yorum ekler (website'den).

**Body:**
```json
{
  "name": "string",
  "email": "string", 
  "rating": 1-5,
  "comment": "string"
}
```

### PUT `/api/comments`
Yorum günceller.

**Actions:**
- `toggleStatus`: Yayın durumunu değiştir
- `toggleStar`: Yıldızlama durumunu değiştir

### DELETE `/api/comments?id={id}`
Yorumu siler.

## 🎨 UI/UX Özellikleri

- **Responsive Grid**: Yorumlar otomatik sıralanan grid'de görünür
- **Durum Badge'leri**: Yayın durumu görsel olarak belirtilir
- **Yıldız Gösterimi**: Puanlar yıldız olarak gösterilir
- **Loading States**: Yükleme durumları için spinner animasyonu
- **Real-time Updates**: Değişiklikler anında yansır

## 🔐 Güvenlik

- **CORS Koruması**: Sadece belirlenen origin'lerden isteklere izin
- **Validasyon**: Gelen verilerin doğruluğu kontrol edilir
- **KVKK Onayı**: Kullanıcı onayı alınarak veri işlenir

## 📊 İstatistikler

Admin panelinde görüntülenen istatistikler:
- **Toplam Yorum**: Sistemdeki tüm yorumlar
- **Yayınlanan**: Aktif olarak gösterilen yorumlar  
- **Bekleyen**: Onay bekleyen yorumlar
- **Öne Çıkan**: İşaretlenmiş önemli yorumlar

## 🚀 Geliştirmeler

Gelecekte eklenebilecek özellikler:
- **Email Bildirimleri**: Yeni yorum geldiğinde admin'e email
- **Toplu İşlemler**: Çoklu yorum seçimi ve işleme
- **Yanıtlama**: Yorumlara admin yanıtı
- **Moderasyon**: Otomatik spam filtreleme
- **Export**: Yorumları Excel'e aktarma