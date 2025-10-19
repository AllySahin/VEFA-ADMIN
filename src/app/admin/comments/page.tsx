'use client'

import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiSearch, FiEye, FiEyeOff, FiTrash2, FiCheck, FiX, FiStar } from 'react-icons/fi'

interface Comment {
  id: number
  author: string
  email: string
  course: string
  rating: number
  comment: string
  date: string
  isPublished: boolean
  isStarred: boolean
}

export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [comments, setComments] = useState<Comment[]>([
    { 
      id: 1, 
      author: 'Ahmet Yılmaz', 
      email: 'ahmet@example.com', 
      course: 'Forklift Operatörlüğü', 
      rating: 5, 
      comment: 'Harika bir eğitimdi! Eğitmenler çok profesyonel ve ekipmanlar modern. Kesinlikle tavsiye ediyorum.', 
      date: '2025-10-12 14:30', 
      isPublished: true, 
      isStarred: false 
    },
    { 
      id: 2, 
      author: 'Fatma Demir', 
      email: 'fatma@example.com', 
      course: 'Mobil Vinç', 
      rating: 5, 
      comment: 'Çok memnun kaldım. Pratik eğitim imkanı harika. Sertifikamı da zamanında aldım.', 
      date: '2025-10-11 16:45', 
      isPublished: true, 
      isStarred: true 
    },
    { 
      id: 3, 
      author: 'Mehmet Kaya', 
      email: 'mehmet@example.com', 
      course: 'Ekskavatör', 
      rating: 4, 
      comment: 'Genel olarak iyiydi. Eğitim süresi biraz daha uzun olabilirdi.', 
      date: '2025-10-10 09:20', 
      isPublished: false, 
      isStarred: false 
    },
    { 
      id: 4, 
      author: 'Ayşe Yıldız', 
      email: 'ayse@example.com', 
      course: 'Forklift Operatörlüğü', 
      rating: 5, 
      comment: 'Mükemmel bir eğitim merkezi. Personel çok ilgili ve yardımcı. Teşekkürler!', 
      date: '2025-10-09 13:00', 
      isPublished: true, 
      isStarred: true 
    },
    { 
      id: 5, 
      author: 'Ali Öztürk', 
      email: 'ali@example.com', 
      course: 'Manlift', 
      rating: 3, 
      comment: 'Fena değildi ama beklentimin altındaydı. Pratik eğitim daha fazla olabilirdi.', 
      date: '2025-10-08 11:15', 
      isPublished: false, 
      isStarred: false 
    },
  ])

  const togglePublish = (id: number) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, isPublished: !comment.isPublished } : comment
    ))
  }

  const toggleStar = (id: number) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, isStarred: !comment.isStarred } : comment
    ))
  }

  const deleteComment = (id: number) => {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      setComments(comments.filter(comment => comment.id !== id))
    }
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comment.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'published' && comment.isPublished) ||
                          (filterStatus === 'unpublished' && !comment.isPublished)
    
    return matchesSearch && matchesStatus
  })

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px', color: '#ffc107' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star}>{star <= rating ? '★' : '☆'}</span>
        ))}
      </div>
    )
  }

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiEye />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Yorum</div>
            <div className="stat-value">{comments.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FiCheck />
          </div>
          <div className="stat-info">
            <div className="stat-label">Yayınlanan</div>
            <div className="stat-value">{comments.filter(c => c.isPublished).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FiX />
          </div>
          <div className="stat-info">
            <div className="stat-label">Bekleyen</div>
            <div className="stat-value">{comments.filter(c => !c.isPublished).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">
            <FiStar />
          </div>
          <div className="stat-info">
            <div className="stat-label">Öne Çıkan</div>
            <div className="stat-value">{comments.filter(c => c.isStarred).length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-icon">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Yorum ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select 
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm Yorumlar</option>
                <option value="published">Yayınlanan</option>
                <option value="unpublished">Bekleyen</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="row">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="col-md-12 mb-3">
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                        {comment.author}
                      </h3>
                      {renderStars(comment.rating)}
                      {comment.isStarred && (
                        <span style={{ color: '#ffc107' }}>
                          <FiStar size={18} fill="#ffc107" />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                      {comment.email} • {comment.course} • {comment.date}
                    </div>
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: '1rem', 
                      borderRadius: '6px',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    className={`btn btn-sm ${comment.isPublished ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => togglePublish(comment.id)}
                  >
                    {comment.isPublished ? (
                      <><FiEye /> Yayında</>
                    ) : (
                      <><FiEyeOff /> Yayınla</>
                    )}
                  </button>
                  
                  <button 
                    className={`btn btn-sm ${comment.isStarred ? 'btn-warning' : 'btn-secondary'}`}
                    onClick={() => toggleStar(comment.id)}
                  >
                    <FiStar /> {comment.isStarred ? 'Öne Çıkan' : 'Öne Çıkar'}
                  </button>

                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <FiTrash2 /> Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="text-muted">Yorum bulunamadı.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
