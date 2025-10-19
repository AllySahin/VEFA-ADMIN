'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiFileText, FiEye } from 'react-icons/fi'

interface MailTemplate {
  id: number
  name: string
  subject: string
  content: string
  variables: string[]
  createdAt: string
  lastUsed?: string
}

export default function MailTemplatesPage() {
  const [templates, setTemplates] = useState<MailTemplate[]>([
    {
      id: 1,
      name: 'Hoşgeldiniz Mesajı',
      subject: 'VEFA Eğitim Merkezine Hoşgeldiniz',
      content: `Sayın {name},

VEFA Eğitim Merkezine hoşgeldiniz! {course} eğitimine kayıt olduğunuz için teşekkür ederiz.

Eğitiminiz hakkında detaylı bilgi için en kısa sürede sizinle iletişime geçeceğiz.

İyi günler dileriz.
VEFA Eğitim Merkezi`,
      variables: ['name', 'course'],
      createdAt: '2025-01-15',
      lastUsed: '2025-10-10'
    },
    {
      id: 2,
      name: 'Hatırlatma Mesajı',
      subject: 'Eğitim Hatırlatması',
      content: `Sayın {name},

{course} eğitiminizin başlangıç tarihi yaklaşmaktadır. 

Lütfen gerekli belgelerinizi hazır bulundurunuz.

Saygılarımızla,
VEFA Eğitim Merkezi`,
      variables: ['name', 'course'],
      createdAt: '2025-01-15',
      lastUsed: '2025-10-12'
    },
    {
      id: 3,
      name: 'Sertifika Hazır',
      subject: 'Sertifikanız Hazır',
      content: `Sayın {name},

{course} eğitiminizi başarıyla tamamladınız. Sertifikanız hazır.

Sertifikanızı almak için merkezimize başvurabilirsiniz.

Tebrikler!
VEFA Eğitim Merkezi`,
      variables: ['name', 'course'],
      createdAt: '2025-01-15',
      lastUsed: '2025-10-08'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MailTemplate | null>(null)
  const [showPreview, setShowPreview] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: ''
  })

  const handleAdd = () => {
    setEditingTemplate(null)
    setFormData({
      name: '',
      subject: '',
      content: ''
    })
    setShowForm(true)
  }

  const handleEdit = (template: MailTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
      setTemplates(templates.filter(t => t.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Değişkenleri içerikten otomatik çıkar
    const variables = Array.from(formData.content.matchAll(/{(\w+)}/g))
      .map(match => match[1])
      .filter((v, i, arr) => arr.indexOf(v) === i)

    if (editingTemplate) {
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id
          ? { ...t, ...formData, variables }
          : t
      ))
    } else {
      const newTemplate: MailTemplate = {
        id: Date.now(),
        ...formData,
        variables,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTemplates([...templates, newTemplate])
    }

    setShowForm(false)
  }

  if (showForm) {
    return (
      <AdminLayout>
        <div className="mb-3">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            <FiX /> Geri Dön
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {editingTemplate ? 'Şablon Düzenle' : 'Yeni Şablon Ekle'}
            </h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Şablon Adı *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Örn: Hoşgeldiniz Mesajı"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mail Konusu *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Örn: VEFA Eğitim Merkezine Hoşgeldiniz"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mail İçeriği *</label>
                <textarea
                  className="form-control"
                  rows={12}
                  placeholder="Mail içeriğini yazın... Değişkenler için {name}, {course} gibi format kullanın."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <small className="text-muted">
                  💡 <strong>Kullanılabilir Değişkenler:</strong> {'{name}'} (Öğrenci adı), {'{course}'} (Kurs adı)
                </small>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <FiSave /> {editingTemplate ? 'Güncelle' : 'Kaydet'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FiPlus /> Yeni Şablon Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiFileText />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Şablon</div>
            <div className="stat-value">{templates.length}</div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="row">
        {templates.map((template) => (
          <div key={template.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: '1.125rem', margin: 0 }}>
                  {template.name}
                </h3>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                    <strong>Konu:</strong>
                  </div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {template.subject}
                  </div>

                  <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                    <strong>Değişkenler:</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {template.variables.map((variable) => (
                      <span 
                        key={variable}
                        style={{
                          background: '#e7f3ff',
                          color: 'var(--primary-anthracite)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace'
                        }}
                      >
                        {'{' + variable + '}'}
                      </span>
                    ))}
                  </div>

                  {template.lastUsed && (
                    <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                      Son kullanım: {template.lastUsed}
                    </div>
                  )}
                </div>

                {showPreview === template.id && (
                  <div style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {template.content}
                  </div>
                )}

                <div className="d-flex gap-1">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPreview(showPreview === template.id ? null : template.id)}
                    style={{ flex: 1 }}
                  >
                    <FiEye /> {showPreview === template.id ? 'Gizle' : 'Önizle'}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(template)}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
