'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import ImageUpload from '../../components/ImageUpload'
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiEye, FiEyeOff, FiArrowUp, FiArrowDown, FiSave, FiX } from 'react-icons/fi'

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  link: string
  order: number
  isActive: boolean
  buttonText: string
}

export default function SliderPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null)
  const [uploadError, setUploadError] = useState<string>('')
  const [formData, setFormData] = useState<Partial<Slide>>({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: '',
    isActive: true
  })
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, title: 'Profesyonel İş Makineleri Eğitimi', subtitle: 'Sertifikalı eğitmenler eşliğinde uygulamalı eğitim', image: '/slider/slide1.jpg', link: '/courses', order: 1, isActive: true, buttonText: 'Kurslara Göz At' },
    { id: 2, title: 'İş Güvenliği Sertifikaları', subtitle: 'Yasal mevzuata uygun belgeler', image: '/slider/slide2.jpg', link: '/services', order: 2, isActive: true, buttonText: 'Daha Fazla Bilgi' },
    { id: 3, title: 'Forklift Operatörlük Belgesi', subtitle: 'MEB onaylı sertifika programı', image: '/slider/slide3.jpg', link: '/contact', order: 3, isActive: false, buttonText: 'Hemen Kayıt Ol' },
  ])

  const openAddModal = () => {
    setModalMode('add')
    setUploadError('')
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      buttonText: 'Daha Fazla Bilgi',
      isActive: true
    })
    setShowModal(true)
  }

  const openEditModal = (slide: Slide) => {
    setModalMode('edit')
    setSelectedSlide(slide)
    setUploadError('')
    setFormData(slide)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Görsel kontrolü
    if (!formData.image) {
      setUploadError('Lütfen bir görsel seçin')
      return
    }
    
    if (modalMode === 'add') {
      const newSlide: Slide = {
        ...formData as Slide,
        id: Math.max(...slides.map(s => s.id)) + 1,
        order: slides.length + 1
      }
      setSlides([...slides, newSlide])
    } else {
      setSlides(slides.map(s => 
        s.id === selectedSlide?.id ? { ...s, ...formData } : s
      ))
    }
    
    setShowModal(false)
    setFormData({})
    setSelectedSlide(null)
    setUploadError('')
  }

  const handleDelete = (id: number) => {
    if (confirm('Bu slide\'ı silmek istediğinizden emin misiniz?')) {
      const newSlides = slides.filter(s => s.id !== id)
      // Reorder remaining slides
      newSlides.forEach((slide, idx) => {
        slide.order = idx + 1
      })
      setSlides(newSlides)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }))
    setUploadError('')
  }

  const handleImageError = (error: string) => {
    setUploadError(error)
  }

  const toggleActive = (id: number) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, isActive: !slide.isActive } : slide
    ))
  }

  const moveSlide = (id: number, direction: 'up' | 'down') => {
    const index = slides.findIndex(s => s.id === id)
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === slides.length - 1)) {
      return
    }
    
    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]
    
    // Update order
    newSlides.forEach((slide, idx) => {
      slide.order = idx + 1
    })
    
    setSlides(newSlides)
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Yeni Slide Ekle
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="slider-manager">
            {slides.map((slide, index) => (
              <div key={slide.id} className="slider-item">
                <div className="slider-drag-handle">
                  <div className="drag-icon">⋮⋮</div>
                  <span className="slide-order">#{slide.order}</span>
                </div>

                <div className="slider-preview">
                  <div className="slider-image-preview">
                    {slide.image ? (
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        style={{ 
                          width: '60px', 
                          height: '40px', 
                          objectFit: 'cover', 
                          borderRadius: '4px' 
                        }}
                      />
                    ) : (
                      <FiImage size={40} />
                    )}
                    <span className="text-muted text-sm">{slide.image}</span>
                  </div>
                </div>

                <div className="slider-content">
                  <h3 className="slider-title">{slide.title}</h3>
                  <p className="slider-subtitle">{slide.subtitle}</p>
                  <div className="slider-meta">
                    <div className="meta-item">
                      <span className="text-muted">Link:</span>
                      <span>{slide.link}</span>
                    </div>
                    <div className="meta-item">
                      <span className="text-muted">Buton:</span>
                      <span>{slide.buttonText}</span>
                    </div>
                  </div>
                </div>

                <div className="slider-status">
                  <button 
                    className={`btn btn-sm ${slide.isActive ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => toggleActive(slide.id)}
                  >
                    {slide.isActive ? <FiEye /> : <FiEyeOff />}
                    {slide.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </div>

                <div className="slider-actions">
                  <div className="order-buttons">
                    <button 
                      className="btn-icon"
                      onClick={() => moveSlide(slide.id, 'up')}
                      disabled={index === 0}
                      title="Yukarı Taşı"
                    >
                      <FiArrowUp />
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={() => moveSlide(slide.id, 'down')}
                      disabled={index === slides.length - 1}
                      title="Aşağı Taşı"
                    >
                      <FiArrowDown />
                    </button>
                  </div>
                  <div className="action-buttons">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(slide)}>
                      <FiEdit2 /> Düzenle
                    </button>
                    <button className="btn-icon text-danger" onClick={() => handleDelete(slide.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="card mt-3">
        <div className="card-header">
          <h2 className="card-title">Slider Önizleme</h2>
        </div>
        <div className="card-body">
          <div className="slider-preview-container">
            <div className="alert alert-info">
              <strong>Bilgi:</strong> Slider önizlemesi için ana sayfayı ziyaret edebilirsiniz.
            </div>
            <div className="preview-stats">
              <div className="stat-item">
                <span className="stat-label">Toplam Slide:</span>
                <strong>{slides.length}</strong>
              </div>
              <div className="stat-item">
                <span className="stat-label">Aktif Slide:</span>
                <strong>{slides.filter(s => s.isActive).length}</strong>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pasif Slide:</span>
                <strong>{slides.filter(s => !s.isActive).length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Yeni Slide Ekle' : 'Slide Düzenle'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Başlık *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alt Başlık *</label>
            <input
              type="text"
              name="subtitle"
              className="form-control"
              value={formData.subtitle || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Görsel *</label>
            <ImageUpload
              value={formData.image || ''}
              onChange={handleImageChange}
              onError={handleImageError}
              placeholder="Slider görseli seçin"
            />
            {uploadError && (
              <div className="text-danger text-sm mt-1">{uploadError}</div>
            )}
            <small className="text-muted">Önerilen boyut: 1920x800px</small>
          </div>

          <div className="form-group">
            <label className="form-label">Link URL *</label>
            <input
              type="text"
              name="link"
              className="form-control"
              placeholder="/courses"
              value={formData.link || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Buton Metni *</label>
            <input
              type="text"
              name="buttonText"
              className="form-control"
              value={formData.buttonText || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleInputChange}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Aktif</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              <FiX /> İptal
            </button>
            <button type="submit" className="btn btn-primary">
              <FiSave /> {modalMode === 'add' ? 'Ekle' : 'Güncelle'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}
