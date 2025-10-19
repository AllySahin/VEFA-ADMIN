'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi'

interface Reference {
  id: number
  name: string
  logo: string
  website?: string
  order: number
  isActive: boolean
  createdAt: string
}

export default function ReferencesPage() {
  const [references, setReferences] = useState<Reference[]>([
    { id: 1, name: 'Mercedes-Benz', logo: '/images/references/mercedes.png', website: 'https://mercedes-benz.com.tr', order: 1, isActive: true, createdAt: '2025-01-15' },
    { id: 2, name: 'Ford Otosan', logo: '/images/references/ford.png', website: 'https://ford.com.tr', order: 2, isActive: true, createdAt: '2025-01-16' },
    { id: 3, name: 'Tofaş', logo: '/images/references/tofas.png', website: 'https://tofas.com.tr', order: 3, isActive: true, createdAt: '2025-01-17' },
    { id: 4, name: 'Bosch', logo: '/images/references/bosch.png', website: 'https://bosch.com.tr', order: 4, isActive: true, createdAt: '2025-01-18' },
    { id: 5, name: 'Schneider Electric', logo: '/images/references/schneider.png', website: 'https://schneider-electric.com.tr', order: 5, isActive: true, createdAt: '2025-01-19' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    order: 0,
    isActive: true
  })

  const handleAdd = () => {
    setEditingReference(null)
    setFormData({ name: '', website: '', order: references.length + 1, isActive: true })
    setShowModal(true)
  }

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference)
    setFormData({
      name: reference.name,
      website: reference.website || '',
      order: reference.order,
      isActive: reference.isActive
    })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Bu referansı silmek istediğinizden emin misiniz?')) {
      setReferences(references.filter(ref => ref.id !== id))
    }
  }

  const handleToggleActive = (id: number) => {
    setReferences(references.map(ref => 
      ref.id === id ? { ...ref, isActive: !ref.isActive } : ref
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingReference) {
      // Update
      setReferences(references.map(ref =>
        ref.id === editingReference.id
          ? { ...ref, ...formData }
          : ref
      ))
    } else {
      // Create
      const newReference: Reference = {
        id: Date.now(),
        ...formData,
        logo: '/images/references/placeholder.png',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setReferences([...references, newReference])
    }
    
    setShowModal(false)
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FiPlus /> Yeni Referans Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiEye />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Referans</div>
            <div className="stat-value">{references.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FiEye />
          </div>
          <div className="stat-info">
            <div className="stat-label">Aktif Referans</div>
            <div className="stat-value">{references.filter(r => r.isActive).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FiEyeOff />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pasif Referans</div>
            <div className="stat-value">{references.filter(r => !r.isActive).length}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Referans Listesi</h3>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Logo</th>
                  <th>Firma Adı</th>
                  <th>Website</th>
                  <th>Durum</th>
                  <th>Eklenme Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {references
                  .sort((a, b) => a.order - b.order)
                  .map((reference) => (
                    <tr key={reference.id}>
                      <td>
                        <strong>#{reference.order}</strong>
                      </td>
                      <td>
                        <div style={{ 
                          width: '80px', 
                          height: '40px', 
                          background: '#f8f9fa',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #e9ecef'
                        }}>
                          <img 
                            src={reference.logo} 
                            alt={reference.name}
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%',
                              objectFit: 'contain'
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/references/placeholder.png'
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <strong>{reference.name}</strong>
                      </td>
                      <td>
                        {reference.website ? (
                          <a 
                            href={reference.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted"
                            style={{ fontSize: '0.875rem' }}
                          >
                            {reference.website.replace('https://', '')}
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleActive(reference.id)}
                          className={`badge ${reference.isActive ? 'badge-success' : 'badge-danger'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {reference.isActive ? (
                            <><FiEye size={12} /> Aktif</>
                          ) : (
                            <><FiEyeOff size={12} /> Pasif</>
                          )}
                        </button>
                      </td>
                      <td className="text-muted">{reference.createdAt}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEdit(reference)}
                            title="Düzenle"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(reference.id)}
                            title="Sil"
                          >
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

      {/* Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="card"
            style={{ 
              width: '600px', 
              maxWidth: '90%',
              margin: 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <h3 className="card-title">
                {editingReference ? 'Referans Düzenle' : 'Yeni Referans Ekle'}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Firma Adı *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Logo</label>
                  <div style={{ 
                    border: '2px dashed #e9ecef',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#f8f9fa'
                  }}>
                    <FiUpload size={32} style={{ color: '#6c757d', marginBottom: '1rem' }} />
                    <p className="text-muted">Logo yüklemek için tıklayın veya sürükleyin</p>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                    <button type="button" className="btn btn-secondary btn-sm">
                      Dosya Seç
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sıra No *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Aktif</span>
                  </label>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingReference ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
