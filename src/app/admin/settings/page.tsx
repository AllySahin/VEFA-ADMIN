'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiSave, FiMail, FiGlobe, FiPhone, FiMapPin, FiImage, FiLock, FiUser, FiBell, FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

interface AdminUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'moderator' | 'editor'
  status: 'active' | 'inactive'
  lastLogin: string
}

interface ContactSettings {
  phone: string
  email: string
  address: string
  workingHours: string
  heroStats: Array<{ number: string; label: string }>
  socialMedia: {
    instagram: string
    linkedin: string
    whatsapp: string
    facebook: string
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'moderator' | 'editor',
    status: 'active' as 'active' | 'inactive'
  })

  const [contactSettings, setContactSettings] = useState<ContactSettings>({
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
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  // İletişim bilgilerini yükle
  const loadContactSettings = async () => {
    try {
      const response = await fetch('/api/contact-settings')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setContactSettings(result.data)
        }
      }
    } catch (error) {
      console.error('İletişim bilgileri yüklenirken hata:', error)
    }
  }

  // İletişim bilgilerini kaydet
  const saveContactSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/contact-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactSettings)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          alert('İletişim bilgileri başarıyla güncellendi!')
        } else {
          alert('Hata: ' + result.error)
        }
      } else {
        alert('Sunucu hatası oluştu')
      }
    } catch (error) {
      console.error('İletişim bilgileri kaydedilirken hata:', error)
      alert('Bağlantı hatası oluştu')
    } finally {
      setIsSaving(false)
    }
  }

  // Component mount edildiğinde iletişim bilgilerini yükle
  useEffect(() => {
    if (activeTab === 'contact') {
      loadContactSettings()
    }
  }, [activeTab])

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id: 1, name: 'Admin User', email: 'admin@vefaegitim.com', role: 'admin', status: 'active', lastLogin: '2025-10-19 14:30' },
    { id: 2, name: 'Moderator User', email: 'mod@vefaegitim.com', role: 'moderator', status: 'active', lastLogin: '2025-10-18 09:15' },
  ])

  const tabs = [
    { id: 'general', label: 'Genel Ayarlar', icon: <FiGlobe /> },
    { id: 'users', label: 'Kullanıcı Yönetimi', icon: <FiUsers /> },
    { id: 'contact', label: 'İletişim Bilgileri', icon: <FiPhone /> },
    { id: 'email', label: 'E-posta Ayarları', icon: <FiMail /> },
    { id: 'notifications', label: 'Bildirim Ayarları', icon: <FiBell /> },
    { id: 'security', label: 'Güvenlik', icon: <FiLock /> },
    { id: 'profile', label: 'Profil', icon: <FiUser /> },
  ]

  const handleAddUser = () => {
    setEditingUser(null)
    setUserForm({ name: '', email: '', password: '', role: 'editor', status: 'active' })
    setShowUserModal(true)
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role, status: user.status })
    setShowUserModal(true)
  }

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      setAdminUsers(adminUsers.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: userForm.name, email: userForm.email, role: userForm.role, status: userForm.status }
          : u
      ))
    } else {
      const newUser: AdminUser = {
        id: Math.max(...adminUsers.map(u => u.id), 0) + 1,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        lastLogin: 'Hic giris yapilmadi'
      }
      setAdminUsers([...adminUsers, newUser])
    }
    setShowUserModal(false)
  }

  const handleDeleteUser = (id: number) => {
    if (confirm('Bu kullaniciyi silmek istediginizden emin misiniz?')) {
      setAdminUsers(adminUsers.filter(u => u.id !== id))
    }
  }

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      admin: { class: 'badge-danger', label: 'Yonetici' },
      moderator: { class: 'badge-warning', label: 'Moderator' },
      editor: { class: 'badge-info', label: 'Editor' },
    }
    return badges[role] || badges.editor
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? { class: 'badge-success', label: 'Aktif' }
      : { class: 'badge-secondary', label: 'Pasif' }
  }

  return (
    <AdminLayout>
      <div className="row">
        {/* Settings Tabs */}
        <div className="col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="settings-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-lg-9">
          {activeTab === 'users' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="card-title">Kullanıcı Yönetimi</h2>
                <button className="btn btn-primary btn-sm" onClick={handleAddUser}>
                  <FiPlus /> Yeni Kullanıcı
                </button>
              </div>
              <div className="card-body">
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Ad Soyad</th>
                        <th>E-posta</th>
                        <th>Rol</th>
                        <th>Durum</th>
                        <th>Son Giris</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="text-muted">#{user.id}</td>
                          <td><strong>{user.name}</strong></td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${getRoleBadge(user.role).class}`}>
                              {getRoleBadge(user.role).label}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(user.status).class}`}>
                              {getStatusBadge(user.status).label}
                            </span>
                          </td>
                          <td className="text-muted text-sm">{user.lastLogin}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn-icon" title="Düzenle" onClick={() => handleEditUser(user)}>
                                <FiEdit2 />
                              </button>
                              <button className="btn-icon text-danger" title="Sil" onClick={() => handleDeleteUser(user.id)}>
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Genel Ayarlar</h2>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Site Adı</label>
                  <input type="text" className="form-control" defaultValue="VEFA Eğitim" />
                </div>
                <div className="form-group">
                  <label className="form-label">Site Açıklaması</label>
                  <textarea className="form-control" rows={3} defaultValue="Profesyonel iş makineleri eğitimi ve sertifikalandırma merkezi" />
                </div>
                <div className="form-group">
                  <label className="form-label">Site Logosu</label>
                  <div className="file-upload-container">
                    <FiImage size={48} />
                    <p>Logo yüklemek için tıklayın veya sürükleyin</p>
                    <input type="file" className="form-control" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Dil</label>
                  <select className="form-control">
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Saat Dilimi</label>
                  <select className="form-control">
                    <option value="Europe/Istanbul">Istanbul (UTC+3)</option>
                    <option value="Europe/London">London (UTC+0)</option>
                  </select>
                </div>
                <button className="btn btn-primary">
                  <FiSave /> Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">İletişim Bilgileri</h2>
              </div>
              <div className="card-body">
                <h4 className="mb-3">Temel İletişim Bilgileri</h4>
                <div className="form-group">
                  <label className="form-label">
                    <FiPhone /> Telefon
                  </label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={contactSettings.phone}
                    onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiMail /> E-posta
                  </label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiMapPin /> Adres
                  </label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    value={contactSettings.address}
                    onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Çalışma Saatleri</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={contactSettings.workingHours}
                    onChange={(e) => setContactSettings({...contactSettings, workingHours: e.target.value})}
                  />
                </div>
                
                <hr className="my-4" />
                
                <h4 className="mb-3">Hero Bölümü İstatistikleri</h4>
                <p className="text-muted mb-3">İletişim sayfası hero bölümünde gösterilecek 3 istatistik bilgisi:</p>
                
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">1. İstatistik - Sayı</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contactSettings.heroStats[0]?.number || ''}
                        onChange={(e) => {
                          const newStats = [...contactSettings.heroStats]
                          newStats[0] = { ...newStats[0], number: e.target.value }
                          setContactSettings({...contactSettings, heroStats: newStats})
                        }}
                      />
                      <small className="form-text text-muted">Örn: 24SA, 7/24, ÜCR</small>
                    </div>
                    <div className="form-group">
                      <label className="form-label">1. İstatistik - Etiket</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contactSettings.heroStats[0]?.label || ''}
                        onChange={(e) => {
                          const newStats = [...contactSettings.heroStats]
                          newStats[0] = { ...newStats[0], label: e.target.value }
                          setContactSettings({...contactSettings, heroStats: newStats})
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">2. İstatistik - Sayı</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contactSettings.heroStats[1]?.number || ''}
                        onChange={(e) => {
                          const newStats = [...contactSettings.heroStats]
                          newStats[1] = { ...newStats[1], number: e.target.value }
                          setContactSettings({...contactSettings, heroStats: newStats})
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">2. İstatistik - Etiket</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contactSettings.heroStats[1]?.label || ''}
                        onChange={(e) => {
                          const newStats = [...contactSettings.heroStats]
                          newStats[1] = { ...newStats[1], label: e.target.value }
                          setContactSettings({...contactSettings, heroStats: newStats})
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">3. İstatistik - Sayı</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contactSettings.heroStats[2]?.number || ''}
                        onChange={(e) => {
                          const newStats = [...contactSettings.heroStats]
                          newStats[2] = { ...newStats[2], number: e.target.value }
                          setContactSettings({...contactSettings, heroStats: newStats})
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">3. İstatistik - Etiket</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contactSettings.heroStats[2]?.label || ''}
                        onChange={(e) => {
                          const newStats = [...contactSettings.heroStats]
                          newStats[2] = { ...newStats[2], label: e.target.value }
                          setContactSettings({...contactSettings, heroStats: newStats})
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <h4 className="mb-3">Sosyal Medya</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Instagram</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="https://instagram.com/..."
                        value={contactSettings.socialMedia.instagram}
                        onChange={(e) => setContactSettings({
                          ...contactSettings, 
                          socialMedia: {...contactSettings.socialMedia, instagram: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">LinkedIn</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="https://linkedin.com/..."
                        value={contactSettings.socialMedia.linkedin}
                        onChange={(e) => setContactSettings({
                          ...contactSettings, 
                          socialMedia: {...contactSettings.socialMedia, linkedin: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">WhatsApp</label>
                      <input 
                        type="tel" 
                        className="form-control"
                        value={contactSettings.socialMedia.whatsapp}
                        onChange={(e) => setContactSettings({
                          ...contactSettings, 
                          socialMedia: {...contactSettings.socialMedia, whatsapp: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Facebook</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="https://facebook.com/..."
                        value={contactSettings.socialMedia.facebook}
                        onChange={(e) => setContactSettings({
                          ...contactSettings, 
                          socialMedia: {...contactSettings.socialMedia, facebook: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary"
                  onClick={saveContactSettings}
                  disabled={isSaving}
                >
                  <FiSave /> {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">E-posta Ayarları</h2>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">SMTP Sunucusu</label>
                  <input type="text" className="form-control" placeholder="smtp.example.com" />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Port</label>
                      <input type="number" className="form-control" defaultValue="587" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Şifreleme</label>
                      <select className="form-control">
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">Yok</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Kullanıcı Adı</label>
                  <input type="text" className="form-control" placeholder="smtp@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Şifre</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label className="form-label">Gönderen Adı</label>
                  <input type="text" className="form-control" defaultValue="VEFA Eğitim" />
                </div>
                <div className="form-group">
                  <label className="form-label">Gönderen E-posta</label>
                  <input type="email" className="form-control" defaultValue="noreply@vefaegitim.com" />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-secondary">Test E-postası Gönder</button>
                  <button className="btn btn-primary">
                    <FiSave /> Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Bildirim Ayarları</h2>
              </div>
              <div className="card-body">
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Yeni Öğrenci Kaydı</strong>
                    <p className="text-muted">Yeni öğrenci kaydı yapıldığında bildirim al</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Yeni Mesaj</strong>
                    <p className="text-muted">Yeni mesaj geldiğinde bildirim al</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Ödeme Bildirimleri</strong>
                    <p className="text-muted">Ödeme işlemlerinde bildirim al</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Kurs Tamamlanma</strong>
                    <p className="text-muted">Öğrenci kursu tamamladığında bildirim al</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Gecikmiş Ödemeler</strong>
                    <p className="text-muted">Ödeme vadesi geçtiğinde bildirim al</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <button className="btn btn-primary">
                  <FiSave /> Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Güvenlik Ayarları</h2>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Mevcut Şifre</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Yeni Şifre</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Yeni Şifre (Tekrar)</label>
                  <input type="password" className="form-control" />
                </div>
                <button className="btn btn-primary mb-4">
                  <FiLock /> Şifreyi Değiştir
                </button>

                <hr />

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>İki Faktörlü Doğrulama</strong>
                    <p className="text-muted">Hesap güvenliğinizi artırın</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Oturum Zaman Aşımı</strong>
                    <p className="text-muted">Otomatik çıkış süresi (dakika)</p>
                  </div>
                  <input type="number" className="form-control" defaultValue="30" style={{ width: '100px' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Profil Bilgileri</h2>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Profil Fotoğrafı</label>
                  <div className="profile-photo-upload">
                    <div className="profile-photo">
                      <FiUser size={64} />
                    </div>
                    <button className="btn btn-secondary">Fotoğraf Yükle</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Ad Soyad</label>
                  <input type="text" className="form-control" defaultValue="Admin User" />
                </div>
                <div className="form-group">
                  <label className="form-label">E-posta</label>
                  <input type="email" className="form-control" defaultValue="admin@vefaegitim.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input type="tel" className="form-control" defaultValue="+90 555 123 4567" />
                </div>
                <div className="form-group">
                  <label className="form-label">Görev</label>
                  <input type="text" className="form-control" defaultValue="Sistem Yöneticisi" />
                </div>
                <button className="btn btn-primary">
                  <FiSave /> Profili Güncelle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h2>
              <button className="modal-close" onClick={() => setShowUserModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Ad Soyad *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">E-posta *</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{editingUser ? 'Yeni Şifre (boş bırakılırsa değişmez)' : 'Şifre *'}</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    required={!editingUser}
                    placeholder={editingUser ? 'Değiştirmek için yeni şifre girin' : ''}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rol *</label>
                  <select 
                    className="form-control"
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value as any})}
                  >
                    <option value="editor">Editor - İçerik düzenleyebilir</option>
                    <option value="moderator">Moderator - Kullanıcı ve içerik yönetimi</option>
                    <option value="admin">Yönetici - Tam yetki</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Durum *</label>
                  <select 
                    className="form-control"
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value as any})}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiSave /> {editingUser ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
