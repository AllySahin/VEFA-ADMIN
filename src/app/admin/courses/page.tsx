'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiStar, FiX } from 'react-icons/fi'

interface Course {
  id: number
  slug: string
  title: string
  description: string
  category: string
  badge: string
  duration: string
  price: string
  installmentOptions: string // "Peşin", "3 Taksit", "6 Taksit", "9 Taksit", "12 Taksit"
  certificate: string
  backgroundImage: string
  isActive: boolean
  isFeatured: boolean
  featuredOrder: number
  content: {
    overview: string
    curriculum: string[]
    requirements: string[]
    benefits: string[]
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      slug: 'forklift-egitimi',
      title: 'Forklift Operatorluk Egitimi',
      description: 'Forklift kullanimi icin gerekli tum teorik ve pratik bilgileri iceren egitim programi.',
      category: 'Is Makineleri',
      badge: 'En Populer',
      duration: '40 Saat',
      price: 'TL 2.500',
      installmentOptions: '3 Taksit',
      certificate: 'MEB Onayli',
      backgroundImage: '/images/service-forklift.png',
      isActive: true,
      isFeatured: true,
      featuredOrder: 1,
      content: {
        overview: 'Forklift operatorluk egitimimiz, modern sanayi tesislerinde guvenli ve verimli calisabilmek icin gerekli tum becerileri kazandirir.',
        curriculum: ['Forklift turleri ve ozellikleri', 'Guvenli kullanim teknikleri', 'Yuk kaldirma ve tasima'],
        requirements: ['En az 18 yas', 'Okuma yazma bilgisi', 'Saglik raporu'],
        benefits: ['MEB onayli sertifika', 'Is bulma destegi', 'Pratik egitim garantisi']
      }
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [newCourse, setNewCourse] = useState({
    slug: '',
    title: '',
    description: '',
    category: 'Is Makineleri',
    badge: '',
    duration: '',
    price: '',
    installmentOptions: 'Pesin',
    certificate: 'MEB Onayli',
    backgroundImage: '/images/service-forklift.png',
    overview: '',
    curriculum: [''],
    requirements: [''],
    benefits: ['']
  })

  const categories = [
    'Is Makineleri',
    'Is Guvenligi',
    'Ozel Egitim'
  ]

  const resetForm = () => {
    setNewCourse({
      slug: '',
      title: '',
      description: '',
      category: 'Is Makineleri',
      badge: '',
      duration: '',
      price: '',
      installmentOptions: 'Pesin',
      certificate: 'MEB Onayli',
      backgroundImage: '/images/service-forklift.png',
      overview: '',
      curriculum: [''],
      requirements: [''],
      benefits: ['']
    })
    setActiveTab('basic')
  }

  const addArrayItem = (field: 'curriculum' | 'requirements' | 'benefits') => {
    setNewCourse({...newCourse, [field]: [...newCourse[field], '']})
  }

  const removeArrayItem = (field: 'curriculum' | 'requirements' | 'benefits', index: number) => {
    const updated = newCourse[field].filter((_, i) => i !== index)
    setNewCourse({...newCourse, [field]: updated.length > 0 ? updated : ['']})
  }

  const updateArrayItem = (field: 'curriculum' | 'requirements' | 'benefits', index: number, value: string) => {
    const updated = [...newCourse[field]]
    updated[index] = value
    setNewCourse({...newCourse, [field]: updated})
  }

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.duration || !newCourse.price || !newCourse.overview) {
      alert('Lutfen zorunlu alanlari doldurun!')
      return
    }

    const slug = newCourse.slug || newCourse.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

    const course: Course = {
      id: Math.max(...courses.map(c => c.id), 0) + 1,
      slug,
      title: newCourse.title,
      description: newCourse.description,
      category: newCourse.category,
      badge: newCourse.badge,
      duration: newCourse.duration,
      price: newCourse.price,
      installmentOptions: newCourse.installmentOptions,
      certificate: newCourse.certificate,
      backgroundImage: newCourse.backgroundImage,
      isActive: true,
      isFeatured: false,
      featuredOrder: 0,
      content: {
        overview: newCourse.overview,
        curriculum: newCourse.curriculum.filter(item => item.trim() !== ''),
        requirements: newCourse.requirements.filter(item => item.trim() !== ''),
        benefits: newCourse.benefits.filter(item => item.trim() !== '')
      }
    }

    setCourses([...courses, course])
    resetForm()
    setShowAddForm(false)
  }

  const handleToggleFeatured = (id: number) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const newIsFeatured = !c.isFeatured
        let newFeaturedOrder = 0
        if (newIsFeatured) {
          const maxOrder = Math.max(...courses.filter(course => course.isFeatured).map(course => course.featuredOrder), 0)
          newFeaturedOrder = maxOrder + 1
        }
        return { ...c, isFeatured: newIsFeatured, featuredOrder: newFeaturedOrder }
      }
      return c
    }))
  }

  const handleToggleActive = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
  }

  const featuredCourses = courses.filter(c => c.isFeatured).sort((a, b) => a.featuredOrder - b.featuredOrder)

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', padding: '0.75rem 1.5rem', height: 'fit-content' }}
        >
          <FiPlus /> Yeni Kurs Ekle
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FiEye /></div>
          <div className="stat-info">
            <div className="stat-label">Toplam Kurs</div>
            <div className="stat-value">{courses.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiEye /></div>
          <div className="stat-info">
            <div className="stat-label">Aktif Kurs</div>
            <div className="stat-value">{courses.filter(c => c.isActive).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning"><FiStar /></div>
          <div className="stat-info">
            <div className="stat-label">One Cikan</div>
            <div className="stat-value">{courses.filter(c => c.isFeatured).length}</div>
          </div>
        </div>
      </div>

      {featuredCourses.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">One Cikan Kurslar</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
              {featuredCourses.map((course) => (
                <div key={course.id} style={{ minWidth: '200px', border: '2px solid #1a4c80', borderRadius: '8px', padding: '1rem', background: '#f8f9fa' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1a4c80', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    #{course.featuredOrder} - One Cikan
                  </div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{course.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                    {course.description.substring(0, 60)}...
                  </p>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{course.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Tum Kurslar</h2>
        </div>
        <div className="card-body">
          {courses.map((course) => (
            <div key={course.id} className="card mb-3" style={{ opacity: course.isActive ? 1 : 0.6 }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                      {course.title}
                      {course.badge && <span className="badge badge-warning ml-2">{course.badge}</span>}
                      {course.isFeatured && (
                        <span className="badge badge-primary ml-2">
                          <FiStar style={{ marginRight: '0.25rem' }} />
                          One Cikan #{course.featuredOrder}
                        </span>
                      )}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>{course.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div><strong>Sure:</strong> {course.duration}</div>
                      <div><strong>Fiyat:</strong> {course.price}</div>
                      <div>
                        <strong>Durum:</strong> 
                        <span className={`badge ml-1 ${course.isActive ? 'badge-success' : 'badge-secondary'}`}>
                          {course.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleToggleActive(course.id)} className={`btn btn-sm ${course.isActive ? 'btn-warning' : 'btn-success'}`}>
                      {course.isActive ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button onClick={() => handleToggleFeatured(course.id)} className={`btn btn-sm ${course.isFeatured ? 'btn-primary' : 'btn-outline-primary'}`}>
                      <FiStar />
                    </button>
                    <button className="btn btn-secondary btn-sm"><FiEdit2 /></button>
                    <button className="btn btn-danger btn-sm"><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '95%', maxWidth: '900px', maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a4c80 0%, #2d6ba8 100%)', padding: '1.5rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Yeni Kurs Ekle</h3>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Eğitim programı detaylarını girin</p>
              </div>
              <button onClick={() => { setShowAddForm(false); resetForm(); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                <FiX size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', background: '#f8f9fa' }}>
              <button onClick={() => setActiveTab('basic')} style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'basic' ? 'white' : 'transparent', color: activeTab === 'basic' ? '#1a4c80' : '#666', fontWeight: activeTab === 'basic' ? 'bold' : 'normal', borderBottom: activeTab === 'basic' ? '3px solid #1a4c80' : 'none', cursor: 'pointer' }}>
                Temel Bilgiler
              </button>
              <button onClick={() => setActiveTab('content')} style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'content' ? 'white' : 'transparent', color: activeTab === 'content' ? '#1a4c80' : '#666', fontWeight: activeTab === 'content' ? 'bold' : 'normal', borderBottom: activeTab === 'content' ? '3px solid #1a4c80' : 'none', cursor: 'pointer' }}>
                İçerik Detayları
              </button>
            </div>

            {/* Form Content */}
            <div style={{ padding: '2rem', maxHeight: 'calc(92vh - 220px)', overflow: 'auto' }}>
              
              {activeTab === 'basic' && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Kurs Adı *</label>
                    <input type="text" className="form-control" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} placeholder="Örnek: Forklift Operatörlük Eğitimi" style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Kısa Açıklama *</label>
                    <textarea className="form-control" rows={3} value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} placeholder="Kurs hakkında kısa açıklama" style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Kategori *</label>
                    <select className="form-control" value={newCourse.category} onChange={(e) => setNewCourse({...newCourse, category: e.target.value})} style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', background: 'white' }}>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Genel Bakış *</label>
                    <textarea className="form-control" rows={4} value={newCourse.overview} onChange={(e) => setNewCourse({...newCourse, overview: e.target.value})} placeholder="Detaylı açıklama (detay sayfasında görünür)" style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Rozet</label>
                      <input type="text" className="form-control" value={newCourse.badge} onChange={(e) => setNewCourse({...newCourse, badge: e.target.value})} placeholder="En Popüler, Yüksek Talep..." style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Sertifika Türü *</label>
                      <select className="form-control" value={newCourse.certificate} onChange={(e) => setNewCourse({...newCourse, certificate: e.target.value})} style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }}>
                        <option value="MEB Onaylı">MEB Onaylı</option>
                        <option value="Katılım Belgesi">Katılım Belgesi</option>
                        <option value="Uzmanlık Sertifikası">Uzmanlık Sertifikası</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Süre *</label>
                      <input type="text" className="form-control" value={newCourse.duration} onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})} placeholder="40 Saat" style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Fiyat *</label>
                      <input type="text" className="form-control" value={newCourse.price} onChange={(e) => setNewCourse({...newCourse, price: e.target.value})} placeholder="TL 2.500" style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Taksit Seçeneği *</label>
                    <select className="form-control" value={newCourse.installmentOptions} onChange={(e) => setNewCourse({...newCourse, installmentOptions: e.target.value})} style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', background: 'white' }}>
                      <option value="Pesin">Peşin Ödeme</option>
                      <option value="3 Taksit">3 Taksit</option>
                      <option value="6 Taksit">6 Taksit</option>
                      <option value="9 Taksit">9 Taksit</option>
                      <option value="12 Taksit">12 Taksit</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div>
                  {/* Mufredat */}
                  <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <label style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>Eğitim Müfredatı</label>
                      <button onClick={() => addArrayItem('curriculum')} className="btn btn-sm btn-primary" style={{ borderRadius: '20px' }}>
                        <FiPlus /> Madde Ekle
                      </button>
                    </div>
                    {newCourse.curriculum.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <input type="text" className="form-control" value={item} onChange={(e) => updateArrayItem('curriculum', index, e.target.value)} placeholder={`Madde ${index + 1}`} style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                        {newCourse.curriculum.length > 1 && (
                          <button onClick={() => removeArrayItem('curriculum', index)} className="btn btn-sm btn-danger" style={{ borderRadius: '8px', minWidth: '40px' }}>
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Gereksinimler */}
                  <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <label style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>Gereksinimler</label>
                      <button onClick={() => addArrayItem('requirements')} className="btn btn-sm btn-primary" style={{ borderRadius: '20px' }}>
                        <FiPlus /> Madde Ekle
                      </button>
                    </div>
                    {newCourse.requirements.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <input type="text" className="form-control" value={item} onChange={(e) => updateArrayItem('requirements', index, e.target.value)} placeholder={`Gereksinim ${index + 1}`} style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                        {newCourse.requirements.length > 1 && (
                          <button onClick={() => removeArrayItem('requirements', index)} className="btn btn-sm btn-danger" style={{ borderRadius: '8px', minWidth: '40px' }}>
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Faydalar */}
                  <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <label style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>Eğitimin Faydaları</label>
                      <button onClick={() => addArrayItem('benefits')} className="btn btn-sm btn-primary" style={{ borderRadius: '20px' }}>
                        <FiPlus /> Madde Ekle
                      </button>
                    </div>
                    {newCourse.benefits.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <input type="text" className="form-control" value={item} onChange={(e) => updateArrayItem('benefits', index, e.target.value)} placeholder={`Fayda ${index + 1}`} style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }} />
                        {newCourse.benefits.length > 1 && (
                          <button onClick={() => removeArrayItem('benefits', index)} className="btn btn-sm btn-danger" style={{ borderRadius: '8px', minWidth: '40px' }}>
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e0e0e0', background: '#f8f9fa', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddForm(false); resetForm(); }} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
                İptal
              </button>
              <button onClick={handleAddCourse} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
                <FiPlus /> Kursu Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
