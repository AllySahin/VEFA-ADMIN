'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { FiSearch, FiEye, FiEyeOff, FiTrash2, FiCheck, FiX, FiStar, FiRefreshCw } from 'react-icons/fi'

interface Comment {
  id: number
  name: string
  email: string
  rating: number
  comment: string
  date: string
  status: 'pending' | 'published' | 'rejected'
  isStarred: boolean
  course?: string
}

export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingCount: 0,
    publishedCount: 0
  })

  // Yorumları API'den yükle
  const fetchComments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') {
        params.append('status', filterStatus === 'unpublished' ? 'pending' : filterStatus)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/comments?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.comments)
        setStats({
          totalCount: data.totalCount,
          pendingCount: data.pendingCount,
          publishedCount: data.publishedCount
        })
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sayfa yüklendiğinde ve filtreler değiştiğinde yorumları yükle
  useEffect(() => {
    fetchComments()
  }, [filterStatus])

  // Arama için debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchComments()
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchTerm])

  // Yıldız render fonksiyonu
  const renderStars = (rating: number) => {
    return (
      <span style={{ display: 'flex', gap: '2px', color: '#ffc107' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star}>{star <= rating ? '★' : '☆'}</span>
        ))}
      </span>
    )
  }

  // Yayınlama durumunu değiştir
  const togglePublish = async (id: number) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggleStatus' })
      })
      
      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error('Durum değiştirme hatası:', error)
    }
  }

  // Yıldızlama durumunu değiştir
  const toggleStar = async (id: number) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggleStar' })
      })
      
      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error('Yıldızlama hatası:', error)
    }
  }

  // Yorum sil
  const deleteComment = async (id: number) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return
    
    try {
      const response = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error('Silme hatası:', error)
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Yorumlar</h1>
        <button 
          className="btn btn-secondary"
          onClick={fetchComments}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} /> Yenile
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiEye />
          </div>
          <div className="stat-info">
            <div className="stat-label">Toplam Yorum</div>
            <div className="stat-value">{stats.totalCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FiCheck />
          </div>
          <div className="stat-info">
            <div className="stat-label">Yayınlanan</div>
            <div className="stat-value">{stats.publishedCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <FiX />
          </div>
          <div className="stat-info">
            <div className="stat-label">Bekleyen</div>
            <div className="stat-value">{stats.pendingCount}</div>
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
      {loading ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <FiRefreshCw className="spin" size={32} />
            <p className="text-muted mt-3">Yorumlar yükleniyor...</p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {comments.map((comment: Comment) => (
            <div key={comment.id}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className={`badge ${comment.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                      {comment.status === 'published' ? 'Yayında' : 'Bekliyor'}
                    </span>
                    {comment.isStarred && (
                      <span style={{ color: '#ffc107' }}>
                        <FiStar size={18} fill="#ffc107" />
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                      {comment.name}
                    </h3>
                    {renderStars(comment.rating)}
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                    {comment.email} {comment.course && `• ${comment.course}`} • {comment.date}
                  </div>
                  
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    minHeight: '70px',
                    flex: 1
                  }}>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>
                      {comment.comment}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: 'auto' }}>
                    <button 
                      className={`btn btn-sm ${comment.status === 'published' ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => togglePublish(comment.id)}
                    >
                      {comment.status === 'published' ? (
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
          
          {comments.length === 0 && (
            <div>
              <div className="card">
                <div className="card-body text-center py-5">
                  <p className="text-muted">Yorum bulunamadı.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
