'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiEye, FiDownload, FiSave, FiX } from 'react-icons/fi'

interface Student {
  id: number
  name: string
  email: string
  phone: string
  course: string
  enrollDate: string
  status: 'active' | 'pending' | 'completed' | 'suspended'
  payment: number
  progress: number
  tcNo?: string
  birthDate?: string
  address?: string
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    email: '',
    phone: '',
    course: '',
    status: 'pending',
    payment: 0,
    progress: 0,
    tcNo: '',
    birthDate: '',
    address: ''
  })

  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '0532 111 2233', course: 'Forklift Operatörlüğü', enrollDate: '2025-10-08', status: 'active', payment: 3500, progress: 45, tcNo: '12345678901', birthDate: '1990-05-15', address: 'İstanbul, Türkiye' },
    { id: 2, name: 'Fatma Demir', email: 'fatma@example.com', phone: '0533 222 3344', course: 'Vinç Operatörlüğü', enrollDate: '2025-10-07', status: 'active', payment: 4200, progress: 67, tcNo: '12345678902', birthDate: '1988-08-20', address: 'Ankara, Türkiye' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', phone: '0534 333 4455', course: 'Ekskavatör Eğitimi', enrollDate: '2025-10-06', status: 'pending', payment: 5000, progress: 0, tcNo: '12345678903', birthDate: '1995-03-10', address: 'İzmir, Türkiye' },
    { id: 4, name: 'Ayşe Yıldız', email: 'ayse@example.com', phone: '0535 444 5566', course: 'Manlift Eğitimi', enrollDate: '2025-10-05', status: 'active', payment: 3800, progress: 82, tcNo: '12345678904', birthDate: '1992-11-25', address: 'Bursa, Türkiye' },
    { id: 5, name: 'Ali Öztürk', email: 'ali@example.com', phone: '0536 555 6677', course: 'Beko Loder', enrollDate: '2025-10-04', status: 'completed', payment: 4500, progress: 100, tcNo: '12345678905', birthDate: '1985-07-30', address: 'Antalya, Türkiye' },
    { id: 6, name: 'Zeynep Şahin', email: 'zeynep@example.com', phone: '0537 666 7788', course: 'Forklift Operatörlüğü', enrollDate: '2025-10-03', status: 'active', payment: 3500, progress: 55, tcNo: '12345678906', birthDate: '1993-02-14', address: 'Adana, Türkiye' },
    { id: 7, name: 'Can Arslan', email: 'can@example.com', phone: '0538 777 8899', course: 'Vinç Operatörlüğü', enrollDate: '2025-10-02', status: 'active', payment: 4200, progress: 33, tcNo: '12345678907', birthDate: '1991-09-05', address: 'Gaziantep, Türkiye' },
    { id: 8, name: 'Elif Koç', email: 'elif@example.com', phone: '0539 888 9900', course: 'İş Güvenliği', enrollDate: '2025-10-01', status: 'suspended', payment: 2500, progress: 20, tcNo: '12345678908', birthDate: '1994-12-18', address: 'Konya, Türkiye' },
  ])

  // Modal işlemleri
  const openAddModal = () => {
    setModalMode('add')
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      status: 'pending',
      payment: 0,
      progress: 0,
      tcNo: '',
      birthDate: '',
      address: ''
    })
    setShowModal(true)
  }

  const openEditModal = (student: Student) => {
    setModalMode('edit')
    setSelectedStudent(student)
    setFormData(student)
    setShowModal(true)
  }

  const openDetailModal = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (modalMode === 'add') {
      const newStudent: Student = {
        ...formData as Student,
        id: Math.max(...students.map(s => s.id)) + 1,
        enrollDate: new Date().toISOString().split('T')[0],
      }
      setStudents([...students, newStudent])
    } else {
      setStudents(students.map(s => 
        s.id === selectedStudent?.id ? { ...s, ...formData } : s
      ))
    }
    
    setShowModal(false)
    setFormData({})
    setSelectedStudent(null)
  }

  const handleDelete = (id: number) => {
    if (confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      setStudents(students.filter(s => s.id !== id))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'payment' || name === 'progress' ? Number(value) : value
    }))
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      active: { class: 'badge-success', label: 'Aktif' },
      pending: { class: 'badge-warning', label: 'Beklemede' },
      completed: { class: 'badge-info', label: 'Tamamlandı' },
      suspended: { class: 'badge-danger', label: 'Askıda' },
    }
    return badges[status] || badges.active
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary">
          <FiDownload /> Dışa Aktar
        </button>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Yeni Öğrenci
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-icon">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Öğrenci ara (isim, email, kurs)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="pending">Beklemede</option>
                <option value="completed">Tamamlandı</option>
                <option value="suspended">Askıda</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-secondary w-100">
                <FiFilter /> Gelişmiş Filtre
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Öğrenci Adı</th>
                  <th>İletişim</th>
                  <th>Kurs</th>
                  <th>Kayıt Tarihi</th>
                  <th>İlerleme</th>
                  <th>Ödeme</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const statusBadge = getStatusBadge(student.status)
                  return (
                    <tr key={student.id}>
                      <td className="text-muted">#{student.id}</td>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>{student.email}</div>
                          <div className="text-muted">{student.phone}</div>
                        </div>
                      </td>
                      <td>{student.course}</td>
                      <td className="text-muted">{student.enrollDate}</td>
                      <td>
                        <div className="progress-container">
                          <div className="progress">
                            <div 
                              className="progress-bar"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="progress-text">{student.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <strong>₺{student.payment.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn-icon" title="Detay" onClick={() => openDetailModal(student)}>
                            <FiEye />
                          </button>
                          <button className="btn-icon" title="Düzenle" onClick={() => openEditModal(student)}>
                            <FiEdit2 />
                          </button>
                          <button className="btn-icon text-danger" title="Sil" onClick={() => handleDelete(student.id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-5 text-muted">
              <p>Arama kriterlerine uygun öğrenci bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Yeni Öğrenci Ekle' : 'Öğrenci Düzenle'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Ad Soyad *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">TC Kimlik No</label>
                <input
                  type="text"
                  name="tcNo"
                  className="form-control"
                  value={formData.tcNo || ''}
                  onChange={handleInputChange}
                  maxLength={11}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">E-posta *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Telefon *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Doğum Tarihi</label>
                <input
                  type="date"
                  name="birthDate"
                  className="form-control"
                  value={formData.birthDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Kurs *</label>
                <select
                  name="course"
                  className="form-control"
                  value={formData.course || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Forklift Operatörlüğü">Forklift Operatörlüğü</option>
                  <option value="Vinç Operatörlüğü">Vinç Operatörlüğü</option>
                  <option value="Ekskavatör Eğitimi">Ekskavatör Eğitimi</option>
                  <option value="Manlift Eğitimi">Manlift Eğitimi</option>
                  <option value="Beko Loder">Beko Loder</option>
                  <option value="İş Güvenliği">İş Güvenliği</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Ödeme Tutarı (₺)</label>
                <input
                  type="number"
                  name="payment"
                  className="form-control"
                  value={formData.payment || 0}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Durum</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status || 'pending'}
                  onChange={handleInputChange}
                >
                  <option value="pending">Beklemede</option>
                  <option value="active">Aktif</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="suspended">Askıda</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">İlerleme (%)</label>
                <input
                  type="number"
                  name="progress"
                  className="form-control"
                  value={formData.progress || 0}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Adres</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows={3}
                  value={formData.address || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
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

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Öğrenci Detayları"
        size="lg"
      >
        {selectedStudent && (
          <div>
            <div className="detail-section">
              <h3 className="detail-section-title">Kişisel Bilgiler</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Ad Soyad</span>
                  <span className="detail-value">{selectedStudent.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">TC Kimlik No</span>
                  <span className="detail-value">{selectedStudent.tcNo || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">E-posta</span>
                  <span className="detail-value">{selectedStudent.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Telefon</span>
                  <span className="detail-value">{selectedStudent.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Doğum Tarihi</span>
                  <span className="detail-value">{selectedStudent.birthDate || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Kayıt Tarihi</span>
                  <span className="detail-value">{selectedStudent.enrollDate}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">Kurs Bilgileri</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Kurs</span>
                  <span className="detail-value">{selectedStudent.course}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Durum</span>
                  <span className="detail-value">
                    <span className={`badge ${getStatusBadge(selectedStudent.status).class}`}>
                      {getStatusBadge(selectedStudent.status).label}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">İlerleme</span>
                  <span className="detail-value">
                    <div className="progress-container">
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${selectedStudent.progress}%` }} />
                      </div>
                      <span className="progress-text">{selectedStudent.progress}%</span>
                    </div>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ödeme</span>
                  <span className="detail-value">₺{selectedStudent.payment.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {selectedStudent.address && (
              <div className="detail-section">
                <h3 className="detail-section-title">Adres Bilgileri</h3>
                <div className="detail-item">
                  <span className="detail-value">{selectedStudent.address}</span>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                Kapat
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowDetailModal(false)
                openEditModal(selectedStudent)
              }}>
                <FiEdit2 /> Düzenle
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
