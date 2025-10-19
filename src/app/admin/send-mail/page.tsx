'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { 
  FiMail, FiSend, FiUsers, FiUser, FiCheckSquare, 
  FiSquare, FiEye, FiFilter, FiSearch, FiX
} from 'react-icons/fi'

interface Student {
  id: number
  name: string
  email: string
  course: string
  phone: string
  status: 'active' | 'completed' | 'pending'
  enrollDate: string
}

interface MailTemplate {
  id: number
  name: string
  subject: string
  content: string
}

export default function SendMailPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', course: 'Forklift Operatörlüğü', phone: '0532 111 2233', status: 'active', enrollDate: '2025-10-01' },
    { id: 2, name: 'Mehmet Demir', email: 'mehmet@example.com', course: 'Mobil Vinç', phone: '0533 222 3344', status: 'active', enrollDate: '2025-10-05' },
    { id: 3, name: 'Ayşe Kaya', email: 'ayse@example.com', course: 'Forklift Operatörlüğü', phone: '0534 333 4455', status: 'completed', enrollDate: '2025-09-15' },
    { id: 4, name: 'Fatma Yıldız', email: 'fatma@example.com', course: 'Ekskavatör', phone: '0535 444 5566', status: 'active', enrollDate: '2025-10-10' },
    { id: 5, name: 'Ali Öztürk', email: 'ali@example.com', course: 'Manlift', phone: '0536 555 6677', status: 'pending', enrollDate: '2025-10-12' },
    { id: 6, name: 'Zeynep Şahin', email: 'zeynep@example.com', course: 'Forklift Operatörlüğü', phone: '0537 666 7788', status: 'active', enrollDate: '2025-10-08' },
    { id: 7, name: 'Can Arslan', email: 'can@example.com', course: 'Mobil Vinç', phone: '0538 777 8899', status: 'completed', enrollDate: '2025-09-20' },
    { id: 8, name: 'Elif Çelik', email: 'elif@example.com', course: 'Forklift Operatörlüğü', phone: '0539 888 9900', status: 'active', enrollDate: '2025-10-03' },
  ])

  const [templates] = useState<MailTemplate[]>([
    {
      id: 1,
      name: 'Hoşgeldiniz Mesajı',
      subject: 'VEFA Eğitim Merkezine Hoşgeldiniz',
      content: `Sayın {name},

VEFA Eğitim Merkezine hoşgeldiniz! {course} eğitimine kayıt olduğunuz için teşekkür ederiz.

Eğitiminiz hakkında detaylı bilgi için en kısa sürede sizinle iletişime geçeceğiz.

İyi günler dileriz.
VEFA Eğitim Merkezi`
    },
    {
      id: 2,
      name: 'Hatırlatma Mesajı',
      subject: 'Eğitim Hatırlatması',
      content: `Sayın {name},

{course} eğitiminizin başlangıç tarihi yaklaşmaktadır. 

Lütfen gerekli belgelerinizi hazır bulundurunuz.

Saygılarımızla,
VEFA Eğitim Merkezi`
    },
    {
      id: 3,
      name: 'Sertifika Hazır',
      subject: 'Sertifikanız Hazır',
      content: `Sayın {name},

{course} eğitiminizi başarıyla tamamladınız. Sertifikanız hazır.

Sertifikanızı almak için merkezimize başvurabilirsiniz.

Tebrikler!
VEFA Eğitim Merkezi`
    },
    {
      id: 4,
      name: 'Özel Mesaj',
      subject: '',
      content: ''
    }
  ])

  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  
  const [mailSubject, setMailSubject] = useState('')
  const [mailContent, setMailContent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Filtreleme
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter
    return matchesSearch && matchesStatus && matchesCourse
  })

  // Benzersiz kurs listesi
  const courses = ['all', ...Array.from(new Set(students.map(s => s.course)))]

  // Tümünü seç/kaldır
  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id))
    }
  }

  // Tekil seçim
  const handleToggleStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id))
    } else {
      setSelectedStudents([...selectedStudents, id])
    }
  }

  // Template seçimi
  const handleTemplateSelect = (templateId: number) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setMailSubject(template.subject)
      setMailContent(template.content)
    }
  }

  // Mail gönder
  const handleSendMail = async () => {
    if (selectedStudents.length === 0) {
      alert('Lütfen en az bir öğrenci seçin!')
      return
    }

    if (!mailSubject.trim() || !mailContent.trim()) {
      alert('Lütfen konu ve içerik alanlarını doldurun!')
      return
    }

    setIsSending(true)

    try {
      const selectedStudentData = students.filter(s => selectedStudents.includes(s.id))
      
      // Her öğrenci için kişiselleştirilmiş mail
      const mailPromises = selectedStudentData.map(student => {
        const personalizedSubject = mailSubject.replace(/{name}/g, student.name).replace(/{course}/g, student.course)
        const personalizedContent = mailContent.replace(/{name}/g, student.name).replace(/{course}/g, student.course)
        
        // API çağrısı
        return fetch('/api/send-bulk-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: student.email,
            subject: personalizedSubject,
            content: personalizedContent
          })
        })
      })

      // Tüm mailleri gönder
      await Promise.all(mailPromises)
      
      alert(`✅ ${selectedStudents.length} öğrenciye mail başarıyla gönderildi!`)
      
      // Formu temizle
      setSelectedStudents([])
      setMailSubject('')
      setMailContent('')
      setSelectedTemplate(null)
      
    } catch (error) {
      alert('❌ Mail gönderiminde hata oluştu!')
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  // Önizleme
  const getPreviewContent = () => {
    if (selectedStudents.length === 0) return { subject: mailSubject, content: mailContent }
    
    const firstStudent = students.find(s => s.id === selectedStudents[0])
    if (!firstStudent) return { subject: mailSubject, content: mailContent }
    
    return {
      subject: mailSubject.replace(/{name}/g, firstStudent.name).replace(/{course}/g, firstStudent.course),
      content: mailContent.replace(/{name}/g, firstStudent.name).replace(/{course}/g, firstStudent.course)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { class: 'badge-success', label: 'Aktif' },
      completed: { class: 'badge-info', label: 'Tamamlandı' },
      pending: { class: 'badge-warning', label: 'Beklemede' }
    }
    return badges[status as keyof typeof badges]
  }

  return (
    <AdminLayout>


      {/* Stats */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiUsers />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Öğrenci</div>
            <div className="stat-value">{students.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FiCheckSquare />
          </div>
          <div className="stat-info">
            <div className="stat-label">Seçili Öğrenci</div>
            <div className="stat-value">{selectedStudents.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FiMail />
          </div>
          <div className="stat-info">
            <div className="stat-label">Gönderilecek Mail</div>
            <div className="stat-value">{selectedStudents.length}</div>
          </div>
        </div>
      </div>

      <div className="row" style={{ gap: '1.5rem' }}>
        {/* Sol Taraf - Öğrenci Listesi */}
        <div className="col-md-4" style={{ flex: '0 0 380px' }}>
          <div className="card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header" style={{ flexShrink: 0 }}>
              <h3 className="card-title">Öğrenci Listesi</h3>
            </div>
            <div className="card-body" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Arama ve Filtreler */}
              <div style={{ flexShrink: 0 }}>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <span className="input-group-icon">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Öğrenci ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <select 
                      className="form-control form-control-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tüm Durumlar</option>
                      <option value="active">Aktif</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="pending">Beklemede</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <select 
                      className="form-control form-control-sm"
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                    >
                      <option value="all">Tüm Kurslar</option>
                      {courses.slice(1).map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tümünü Seç */}
                <div className="form-group mb-3">
                  <button 
                    className="btn btn-secondary btn-sm w-100"
                    onClick={handleSelectAll}
                  >
                    {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ? (
                      <><FiX /> Tüm Seçimi Kaldır</>
                    ) : (
                      <><FiCheckSquare /> Tümünü Seç ({filteredStudents.length})</>
                    )}
                  </button>
                </div>
              </div>

              {/* Öğrenci Listesi */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                {filteredStudents.map(student => (
                  <div 
                    key={student.id}
                    style={{
                      padding: '0.875rem',
                      marginBottom: '0.75rem',
                      border: selectedStudents.includes(student.id) ? '2px solid #1a4c80' : '1px solid #e9ecef',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedStudents.includes(student.id) ? '#f0f7ff' : 'white',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedStudents.includes(student.id) ? '0 2px 8px rgba(26, 76, 128, 0.1)' : 'none'
                    }}
                    onClick={() => handleToggleStudent(student.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      <div style={{ fontSize: '1.25rem', marginTop: '2px', flexShrink: 0 }}>
                        {selectedStudents.includes(student.id) ? (
                          <FiCheckSquare style={{ color: '#1a4c80' }} />
                        ) : (
                          <FiSquare style={{ color: '#adb5bd' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.375rem', fontSize: '0.9375rem', color: '#2d3748' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiMail size={12} /> 
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.email}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className={`badge ${getStatusBadge(student.status).class}`} style={{ fontSize: '0.7rem' }}>
                            {getStatusBadge(student.status).label}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                            {student.course}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStudents.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#adb5bd', padding: '3rem 1rem', fontSize: '0.9375rem' }}>
                    <FiUsers size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <div>Öğrenci bulunamadı</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Mail Editörü */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header" style={{ flexShrink: 0 }}>
              <h3 className="card-title">Mail İçeriği</h3>
            </div>
            <div className="card-body" style={{ flex: 1, overflow: 'auto' }}>
              {/* Template Seçimi */}
              <div className="form-group">
                <label className="form-label">Şablon Seç (Opsiyonel)</label>
                <select 
                  className="form-control"
                  value={selectedTemplate || ''}
                  onChange={(e) => handleTemplateSelect(Number(e.target.value))}
                >
                  <option value="">Şablon seçin...</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                <small className="text-muted">
                  Değişkenler: {'{name}'} (öğrenci adı), {'{course}'} (kurs adı)
                </small>
              </div>

              {/* Konu */}
              <div className="form-group">
                <label className="form-label">Konu *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mail konusu..."
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                />
              </div>

              {/* İçerik */}
              <div className="form-group">
                <label className="form-label">İçerik *</label>
                <textarea
                  className="form-control"
                  rows={12}
                  placeholder="Mail içeriği..."
                  value={mailContent}
                  onChange={(e) => setMailContent(e.target.value)}
                />
              </div>

              {/* Önizleme ve Gönder */}
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={selectedStudents.length === 0}
                >
                  <FiEye /> {showPreview ? 'Önizlemeyi Kapat' : 'Önizle'}
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSendMail}
                  disabled={isSending || selectedStudents.length === 0 || !mailSubject.trim() || !mailContent.trim()}
                  style={{ flex: 1 }}
                >
                  {isSending ? (
                    <>⏳ Gönderiliyor...</>
                  ) : (
                    <><FiSend /> {selectedStudents.length > 0 ? `${selectedStudents.length} Öğrenciye` : '0 Öğrenciye'} Gönder</>
                  )}
                </button>
              </div>

              {/* Önizleme */}
              {showPreview && selectedStudents.length > 0 && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.25rem', 
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
                  borderRadius: '8px',
                  border: '2px solid #dee2e6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FiEye style={{ color: '#1a4c80', fontSize: '1.25rem' }} />
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 600, margin: 0, color: '#2d3748' }}>
                      Önizleme (İlk Öğrenci)
                    </h4>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'white', 
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e9ecef' }}>
                      <strong style={{ color: '#495057', fontSize: '0.875rem' }}>Konu:</strong> 
                      <div style={{ marginTop: '0.375rem', color: '#2d3748', fontSize: '0.9375rem' }}>
                        {getPreviewContent().subject}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: '#495057', fontSize: '0.875rem' }}>İçerik:</strong>
                      <div style={{ 
                        whiteSpace: 'pre-wrap', 
                        marginTop: '0.75rem',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '6px',
                        fontSize: '0.9375rem',
                        lineHeight: '1.6',
                        color: '#2d3748'
                      }}>
                        {getPreviewContent().content}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
